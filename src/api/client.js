import { BASE_URL, TIMEOUT } from '../config';

/**
 * Hàm chung để gọi API có kèm timeout và chuẩn hóa lỗi
 * @param {'GET'|'POST'|'PATCH'|'PUT'|'DELETE'} method
 * @param {string} url - Đường dẫn tương đối (bắt đầu bằng /) hoặc tuyệt đối
 * @param {object|null} [body=null]
 * @returns {Promise<any>} Dữ liệu JSON trả về từ API
 * @throws {{ type: 'network'|'timeout'|'http', status: number, message: string }}
 */
export async function request(method, url, body = null) {
  const fullUrl = url.startsWith('http') ? url : `${BASE_URL}${url}`;
  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), TIMEOUT);

  const headers = {
    Accept: 'application/json',
    'Content-Type': 'application/json',
  };

  const options = {
    method,
    headers,
    signal: controller.signal,
  };

  if (body && (method === 'POST' || method === 'PATCH' || method === 'PUT')) {
    options.body = JSON.stringify(body);
  }

  try {
    const response = await fetch(fullUrl, options);
    clearTimeout(timeoutId);

    if (!response.ok) {
      let errorMessage = `Lỗi yêu cầu HTTP: ${response.status}`;
      try {
        const errorData = await response.json();
        if (errorData && errorData.message) {
          errorMessage = errorData.message;
        }
      } catch {
        // Bỏ qua nếu response không phải JSON
      }

      const error = new Error(errorMessage);
      error.type = 'http';
      error.status = response.status;
      error.message = errorMessage;
      throw error;
    }

    // Với phản hồi 204 No Content
    if (response.status === 204) {
      return null;
    }

    return await response.json();
  } catch (err) {
    clearTimeout(timeoutId);

    if (err.type === 'http') {
      throw err;
    }

    if (err.name === 'AbortError') {
      const error = new Error('Quá thời gian chờ phản hồi từ máy chủ (10s)');
      error.type = 'timeout';
      error.status = 0;
      error.message = 'Quá thời gian chờ phản hồi từ máy chủ (10s)';
      throw error;
    }

    const error = new Error(err.message || 'Lỗi kết nối mạng, vui lòng kiểm tra server');
    error.type = 'network';
    error.status = 0;
    error.message = 'Không thể kết nối đến máy chủ. Vui lòng kiểm tra mạng!';
    throw error;
  }
}

export default {
  request,
};

