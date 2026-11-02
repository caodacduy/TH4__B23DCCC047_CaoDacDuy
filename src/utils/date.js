/**
 * Định dạng ngày giờ từ chuỗi ISO
 * @param {string|Date} isoString
 * @param {'datetime'|'date'|'time'} [formatType='datetime']
 * @returns {string}
 */
export function formatDate(isoString, formatType = 'datetime') {
  if (!isoString) return '';
  const date = new Date(isoString);
  if (isNaN(date.getTime())) return '';

  const pad = (n) => String(n).padStart(2, '0');
  const day = pad(date.getDate());
  const month = pad(date.getMonth() + 1);
  const year = date.getFullYear();
  const hours = pad(date.getHours());
  const minutes = pad(date.getMinutes());

  if (formatType === 'date') {
    return `${day}/${month}/${year}`;
  }
  if (formatType === 'time') {
    return `${hours}:${minutes}`;
  }
  return `${hours}:${minutes}, ${day}/${month}/${year}`;
}

/**
 * Kiểm tra bài tập đã quá hạn hay chưa
 * @param {string} dueDate - Chuỗi ISO
 * @returns {boolean}
 */
export function isOverdue(dueDate) {
  if (!dueDate) return false;
  const due = new Date(dueDate).getTime();
  const now = Date.now();
  return due < now;
}

/**
 * Tính số ngày còn lại đến hạn nộp
 * @param {string} dueDate - Chuỗi ISO
 * @returns {number}
 */
export function daysLeft(dueDate) {
  if (!dueDate) return 0;
  const due = new Date(dueDate).getTime();
  const now = Date.now();
  const diffTime = due - now;
  return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
}

