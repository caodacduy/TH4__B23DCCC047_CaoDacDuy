/**
 * Kiểm tra tính hợp lệ dữ liệu bài tập
 * @param {object} param0
 * @param {string} param0.title
 * @param {string} param0.dueDate
 * @param {number|string} param0.courseId
 * @returns {{ isValid: boolean, errors: object }}
 */
export function validateAssignment({ title, dueDate, courseId }) {
  const errors = {};

  if (!title || !title.trim()) {
    errors.title = 'Tiêu đề không được để trống';
  }

  if (!courseId) {
    errors.courseId = 'Vui lòng chọn môn học';
  }

  if (!dueDate || !dueDate.trim()) {
    errors.dueDate = 'Hạn nộp không được để trống';
  } else {
    const dueTime = new Date(dueDate).getTime();
    if (isNaN(dueTime)) {
      errors.dueDate = 'Định dạng ngày không hợp lệ';
    } else if (dueTime < Date.now()) {
      errors.dueDate = 'Hạn nộp không được ở trong quá khứ';
    }
  }

  return {
    isValid: Object.keys(errors).length === 0,
    errors,
  };
}

/**
 * Kiểm tra tính hợp lệ dữ liệu sinh viên
 * @param {object} param0
 * @param {string} param0.fullName
 * @param {string} param0.email
 * @param {string} param0.phone
 * @returns {{ isValid: boolean, errors: object }}
 */
export function validateProfile({ fullName, email, phone }) {
  const errors = {};

  if (!fullName || !fullName.trim()) {
    errors.fullName = 'Họ tên không được để trống';
  }

  if (email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim())) {
    errors.email = 'Email không hợp lệ';
  }

  if (phone && !/^[0-9]{10,11}$/.test(phone.trim())) {
    errors.phone = 'Số điện thoại phải từ 10 - 11 chữ số';
  }

  return {
    isValid: Object.keys(errors).length === 0,
    errors,
  };
}

