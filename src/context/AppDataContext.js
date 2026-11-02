import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { studentService } from '../api/studentService';
import { courseService } from '../api/courseService';
import { sessionService } from '../api/sessionService';
import { assignmentService } from '../api/assignmentService';
import { gradeService } from '../api/gradeService';
import { getCache, setCache } from '../storage/cache';
import { STORAGE_KEYS } from '../storage/keys';
import { enqueue, getAll } from '../storage/outbox';
import { useNetworkStatus } from '../hooks/useNetworkStatus';

const AppDataContext = createContext(null);

export function AppDataProvider({ children }) {
  const { isOnline } = useNetworkStatus();

  const [student, setStudent] = useState(null);
  const [courses, setCourses] = useState([]);
  const [sessions, setSessions] = useState([]);
  const [assignments, setAssignments] = useState([]);
  const [grades, setGrades] = useState([]);

  const [pendingAssignmentIds, setPendingAssignmentIds] = useState(new Set());
  const [isStudentPending, setIsStudentPending] = useState(false);

  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState(null);
  const [lastUpdated, setLastUpdated] = useState(null);

  // Đọc danh sách các mục đang trong outbox để gắn nhãn pending
  const syncPendingBadges = useCallback(async () => {
    try {
      const outboxItems = await getAll();
      const pendingSet = new Set();
      let studentPending = false;

      outboxItems.forEach((item) => {
        if (item.url.includes('/assignments')) {
          if (item.entityId) {
            pendingSet.add(item.entityId);
          } else if (item.body && item.body.id) {
            pendingSet.add(item.body.id);
          } else {
            const match = item.url.match(/\/assignments\/(\d+)/);
            if (match) pendingSet.add(Number(match[1]));
          }
        }
        if (item.url.includes('/students')) {
          studentPending = true;
        }
      });

      setPendingAssignmentIds(pendingSet);
      setIsStudentPending(studentPending);
    } catch (err) {
      console.warn('Lỗi đồng bộ pending badges:', err);
    }
  }, []);

  // Tải dữ liệu: Cache trước, sau đó Mạng
  const loadAllData = useCallback(async () => {
    let hasAnyCache = false;

    // 1. Tải từ Cache
    try {
      const [cStudent, cCourses, cSessions, cAssignments, cGrades] = await Promise.all([
        getCache(STORAGE_KEYS.CACHE_STUDENT),
        getCache(STORAGE_KEYS.CACHE_COURSES),
        getCache(STORAGE_KEYS.CACHE_SESSIONS),
        getCache(STORAGE_KEYS.CACHE_ASSIGNMENTS),
        getCache(STORAGE_KEYS.CACHE_GRADES),
      ]);

      if (cStudent?.data) setStudent(cStudent.data);
      if (cCourses?.data) setCourses(cCourses.data);
      if (cSessions?.data) setSessions(cSessions.data);
      if (cAssignments?.data) setAssignments(cAssignments.data);
      if (cGrades?.data) setGrades(cGrades.data);

      const latestSavedAt = [
        cStudent?.savedAt,
        cCourses?.savedAt,
        cSessions?.savedAt,
        cAssignments?.savedAt,
        cGrades?.savedAt,
      ]
        .filter(Boolean)
        .sort()
        .pop();

      if (latestSavedAt) {
        setLastUpdated(latestSavedAt);
        hasAnyCache = true;
        setLoading(false);
      }
    } catch (cacheErr) {
      console.warn('Lỗi đọc cache tổng thể:', cacheErr);
    }

    await syncPendingBadges();

    // 2. Gọi mạng nếu online
    if (!isOnline) {
      setLoading(false);
      return;
    }

    try {
      const [resStudent, resCourses, resSessions, resAssignments, resGrades] = await Promise.all([
        studentService.getById(1),
        courseService.getAll(),
        sessionService.getAll(),
        assignmentService.getAll(),
        gradeService.getAll(),
      ]);

      setStudent(resStudent);
      setCourses(resCourses);
      setSessions(resSessions);
      setAssignments(resAssignments);
      setGrades(resGrades);

      const now = new Date().toISOString();
      setLastUpdated(now);
      setError(null);

      // Lưu song song vào cache
      await Promise.all([
        setCache(STORAGE_KEYS.CACHE_STUDENT, resStudent),
        setCache(STORAGE_KEYS.CACHE_COURSES, resCourses),
        setCache(STORAGE_KEYS.CACHE_SESSIONS, resSessions),
        setCache(STORAGE_KEYS.CACHE_ASSIGNMENTS, resAssignments),
        setCache(STORAGE_KEYS.CACHE_GRADES, resGrades),
      ]);
    } catch (apiErr) {
      console.warn('Lỗi lấy dữ liệu từ API:', apiErr);
      if (!hasAnyCache) {
        setError(apiErr);
      }
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, [isOnline, syncPendingBadges]);

  useEffect(() => {
    loadAllData();
  }, [loadAllData]);

  const refreshAll = useCallback(async () => {
    setRefreshing(true);
    await loadAllData();
  }, [loadAllData]);

  // A6 & B3: Cập nhật trạng thái bài tập (Optimistic update + Outbox nếu offline)
  const toggleAssignmentStatus = useCallback(
    async (id) => {
      const target = assignments.find((a) => a.id === id);
      if (!target) return;

      const newStatus = target.status === 'todo' ? 'done' : 'todo';
      const updatedTimestamp = new Date().toISOString();

      // Cập nhật lạc quan giao diện ngay lập tức
      const updatedList = assignments.map((a) =>
        a.id === id ? { ...a, status: newStatus, updatedAt: updatedTimestamp } : a,
      );
      setAssignments(updatedList);
      setCache(STORAGE_KEYS.CACHE_ASSIGNMENTS, updatedList);

      if (!isOnline) {
        // Đưa vào Outbox
        await enqueue({
          method: 'PATCH',
          url: `/assignments/${id}`,
          body: { status: newStatus, updatedAt: updatedTimestamp },
          entityType: 'assignment',
          entityId: id,
        });
        setPendingAssignmentIds((prev) => new Set(prev).add(id));
      } else {
        // Online: Gọi trực tiếp API
        try {
          await assignmentService.update(id, {
            status: newStatus,
            updatedAt: updatedTimestamp,
          });
        } catch {
          // Lỗi mạng đột xuất: fallback vào outbox
          await enqueue({
            method: 'PATCH',
            url: `/assignments/${id}`,
            body: { status: newStatus, updatedAt: updatedTimestamp },
            entityType: 'assignment',
            entityId: id,
          });
          setPendingAssignmentIds((prev) => new Set(prev).add(id));
        }
      }
    },
    [assignments, isOnline],
  );

  // A5 & B3: Thêm bài tập mới
  const addAssignment = useCallback(
    async (newAssignmentData) => {
      const now = new Date().toISOString();
      // Tìm course tương ứng để hiển thị ngay
      const course = courses.find((c) => c.id === Number(newAssignmentData.courseId));

      const tempId = Date.now();
      const optimisticItem = {
        ...newAssignmentData,
        id: tempId,
        status: 'todo',
        updatedAt: now,
        course,
      };

      // Cập nhật lạc quan vào danh sách
      const updatedList = [optimisticItem, ...assignments];
      setAssignments(updatedList);
      setCache(STORAGE_KEYS.CACHE_ASSIGNMENTS, updatedList);

      if (!isOnline) {
        await enqueue({
          method: 'POST',
          url: '/assignments',
          body: {
            courseId: Number(newAssignmentData.courseId),
            title: newAssignmentData.title,
            description: newAssignmentData.description || '',
            dueDate: newAssignmentData.dueDate,
            status: 'todo',
            updatedAt: now,
          },
          entityType: 'assignment',
          entityId: tempId,
        });
        setPendingAssignmentIds((prev) => new Set(prev).add(tempId));
      } else {
        try {
          const created = await assignmentService.create({
            courseId: Number(newAssignmentData.courseId),
            title: newAssignmentData.title,
            description: newAssignmentData.description || '',
            dueDate: newAssignmentData.dueDate,
            status: 'todo',
            updatedAt: now,
          });

          // Thay thế tempId bằng id thật từ server
          const finalList = updatedList.map((a) => (a.id === tempId ? { ...created, course } : a));
          setAssignments(finalList);
          setCache(STORAGE_KEYS.CACHE_ASSIGNMENTS, finalList);
        } catch {
          // Fallback lưu outbox
          await enqueue({
            method: 'POST',
            url: '/assignments',
            body: {
              courseId: Number(newAssignmentData.courseId),
              title: newAssignmentData.title,
              description: newAssignmentData.description || '',
              dueDate: newAssignmentData.dueDate,
              status: 'todo',
              updatedAt: now,
            },
            entityType: 'assignment',
            entityId: tempId,
          });
          setPendingAssignmentIds((prev) => new Set(prev).add(tempId));
        }
      }
    },
    [assignments, courses, isOnline],
  );

  // Cập nhật thông tin sinh viên
  const updateStudentProfile = useCallback(
    async (updatedFields) => {
      const now = new Date().toISOString();
      const updatedStudent = {
        ...student,
        ...updatedFields,
        updatedAt: now,
      };

      setStudent(updatedStudent);
      setCache(STORAGE_KEYS.CACHE_STUDENT, updatedStudent);

      if (!isOnline) {
        await enqueue({
          method: 'PATCH',
          url: '/students/1',
          body: { ...updatedFields, updatedAt: now },
          entityType: 'student',
          entityId: 1,
        });
        setIsStudentPending(true);
      } else {
        try {
          await studentService.update(1, {
            ...updatedFields,
            updatedAt: now,
          });
          setIsStudentPending(false);
        } catch {
          await enqueue({
            method: 'PATCH',
            url: '/students/1',
            body: { ...updatedFields, updatedAt: now },
            entityType: 'student',
            entityId: 1,
          });
          setIsStudentPending(true);
        }
      }
    },
    [student, isOnline],
  );

  // Số lượng bài tập chưa hoàn thành (todo) để hiển thị tabBarBadge
  const unfinishedAssignmentsCount = assignments.filter((a) => a.status === 'todo').length;

  return (
    <AppDataContext.Provider
      value={{
        student,
        courses,
        sessions,
        assignments,
        grades,
        pendingAssignmentIds,
        isStudentPending,
        loading,
        refreshing,
        error,
        lastUpdated,
        refreshAll,
        toggleAssignmentStatus,
        addAssignment,
        updateStudentProfile,
        unfinishedAssignmentsCount,
      }}
    >
      {children}
    </AppDataContext.Provider>
  );
}

export function useAppData() {
  const context = useContext(AppDataContext);
  if (!context) {
    throw new Error('useAppData phải được sử dụng bên trong AppDataProvider');
  }
  return context;
}

export default AppDataContext;

