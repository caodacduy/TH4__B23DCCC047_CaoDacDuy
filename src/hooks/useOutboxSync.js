import { useState, useEffect, useCallback, useRef } from 'react';
import { Alert } from 'react-native';
import { useNetworkStatus } from './useNetworkStatus';
import { getAll, remove } from '../storage/outbox';
import { request } from '../api/client';

/**
 * Custom hook quản lý đồng bộ hàng đợi Outbox khi có mạng
 * @param {() => void} [onSyncCompleted] - Callback được gọi sau khi hoàn thành đồng bộ để refresh data
 * @returns {{
 *   pendingCount: number,
 *   syncing: boolean,
 *   syncNow: () => Promise<void>
 * }}
 */
export function useOutboxSync(onSyncCompleted) {
  const { isOnline } = useNetworkStatus();
  const [pendingCount, setPendingCount] = useState(0);
  const [syncing, setSyncing] = useState(false);

  const prevOnlineRef = useRef(isOnline);
  const isSyncingRef = useRef(false);

  // Cập nhật số lượng thao tác đang chờ trong outbox
  const updatePendingCount = useCallback(async () => {
    try {
      const items = await getAll();
      setPendingCount(items.length);
    } catch {
      setPendingCount(0);
    }
  }, []);

  useEffect(() => {
    updatePendingCount();
  }, [updatePendingCount]);

  /**
   * Thực hiện đồng bộ các thao tác trong outbox lên server
   */
  const syncNow = useCallback(async () => {
    if (isSyncingRef.current || !isOnline) return;

    isSyncingRef.current = true;
    setSyncing(true);

    try {
      const queue = await getAll();
      if (queue.length === 0) {
        setSyncing(false);
        isSyncingRef.current = false;
        return;
      }

      let successCount = 0;
      let conflictCount = 0;

      // Xử lý tuần tự theo FIFO
      for (const action of queue) {
        try {
          // B5. Xử lý xung đột trước khi gửi PATCH
          if (action.method === 'PATCH') {
            try {
              // Lấy dữ liệu hiện thời trên server để kiểm tra updatedAt
              const serverData = await request('GET', action.url);
              if (
                serverData &&
                serverData.updatedAt &&
                action.createdAt &&
                new Date(serverData.updatedAt).getTime() > new Date(action.createdAt).getTime()
              ) {
                // Server mới hơn: bỏ qua cập nhật offline, ưu tiên server
                conflictCount += 1;
                await remove(action.id);
                continue;
              }
            } catch (checkErr) {
              // Nếu không lấy được để kiểm tra, tiếp tục thử thực thi
              console.warn('Không thể kiểm tra xung đột với server:', checkErr);
            }
          }

          // Chuẩn bị payload: gán updatedAt mới nếu là tạo hoặc sửa
          let payload = action.body;
          if (payload && (action.method === 'POST' || action.method === 'PATCH')) {
            payload = {
              ...payload,
              updatedAt: new Date().toISOString(),
            };
          }

          // Gửi yêu cầu lên server
          await request(action.method, action.url, payload);

          // Thành công thì xóa khỏi outbox
          await remove(action.id);
          successCount += 1;
        } catch (err) {
          console.warn(`Lỗi khi đồng bộ thao tác ${action.id}:`, err);
          // Thao tác lỗi thì giữ lại để thử lại sau
          break;
        }
      }

      await updatePendingCount();

      // Thông báo kết quả đồng bộ
      if (conflictCount > 0) {
        Alert.alert(
          'Xung đột dữ liệu',
          `Có ${conflictCount} thay đổi offline bị hủy bỏ do dữ liệu trên máy chủ mới hơn.`,
        );
      }

      if (successCount > 0) {
        Alert.alert('Thành công', `Đã đồng bộ ${successCount} thay đổi.`);
      }

      if ((successCount > 0 || conflictCount > 0) && onSyncCompleted) {
        onSyncCompleted();
      }
    } catch (err) {
      console.warn('Lỗi tiến trình đồng bộ:', err);
    } finally {
      setSyncing(false);
      isSyncingRef.current = false;
    }
  }, [isOnline, updatePendingCount, onSyncCompleted]);

  // Tự động kích hoạt đồng bộ khi isOnline chuyển sang true
  useEffect(() => {
    if (!prevOnlineRef.current && isOnline) {
      syncNow();
    }
    prevOnlineRef.current = isOnline;
  }, [isOnline, syncNow]);

  return {
    pendingCount,
    syncing,
    syncNow,
  };
}

export default useOutboxSync;

