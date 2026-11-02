/**
 * Quy đổi điểm hệ 10 sang điểm hệ 4 và điểm chữ
 * @param {number} score10
 * @returns {{ scale4: number, letter: string }}
 */
export function toScale4(score10) {
  const score = Number(score10);
  if (isNaN(score)) return { scale4: 0, letter: 'F' };

  if (score >= 8.5) return { scale4: 4.0, letter: 'A' };
  if (score >= 8.0) return { scale4: 3.5, letter: 'B+' };
  if (score >= 7.0) return { scale4: 3.0, letter: 'B' };
  if (score >= 6.5) return { scale4: 2.5, letter: 'C+' };
  if (score >= 5.5) return { scale4: 2.0, letter: 'C' };
  if (score >= 5.0) return { scale4: 1.5, letter: 'D+' };
  if (score >= 4.0) return { scale4: 1.0, letter: 'D' };
  return { scale4: 0.0, letter: 'F' };
}

/**
 * Tính điểm trung bình tích lũy GPA hệ 4 và tổng số tín chỉ tích lũy
 * GPA = tổng (điểm hệ 4 × số tín chỉ) / tổng số tín chỉ
 * Môn điểm F không tính vào số tín chỉ tích lũy
 * @param {Array} grades - Danh sách điểm từ API (có thể đã kèm course hoặc courseId)
 * @param {Array} [courses=[]] - Danh sách môn học để tra cứu số tín chỉ nếu grade chưa có
 * @returns {{ gpa: number, totalCredits: number }}
 */
export function calcGpa(grades = [], courses = []) {
  if (!grades || grades.length === 0) {
    return { gpa: 0, totalCredits: 0 };
  }

  const courseMap = new Map();
  courses.forEach((c) => {
    courseMap.set(c.id, c.credits || 0);
  });

  let totalWeightedScore = 0;
  let totalCreditsForGpa = 0;
  let accumulatedCredits = 0;

  grades.forEach((grade) => {
    // Tìm số tín chỉ: grade.course?.credits hoặc lấy qua courseId trong courseMap
    const credits = grade.course?.credits || courseMap.get(grade.courseId) || 0;
    const { scale4, letter } = toScale4(grade.total);

    if (credits > 0) {
      totalWeightedScore += scale4 * credits;
      totalCreditsForGpa += credits;

      // Môn F không tính vào số tín chỉ tích lũy
      if (letter !== 'F') {
        accumulatedCredits += credits;
      }
    }
  });

  const gpa = totalCreditsForGpa > 0 ? Number((totalWeightedScore / totalCreditsForGpa).toFixed(2)) : 0;

  return {
    gpa,
    totalCredits: accumulatedCredits,
  };
}

