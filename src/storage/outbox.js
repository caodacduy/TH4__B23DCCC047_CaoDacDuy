import AsyncStorage from '@react-native-async-storage/async-storage';
import { STORAGE_KEYS } from './keys';

/**
 * Thêm một thao tác offline vào cuối hàng đợi outbox
 * @param {object} action - { id?, method, url, body, createdAt? }
 * @returns {Promise<object>} Thao tác vừa được đưa vào hàng đợi
 */
export async function enqueue(action) {
  try {
    const raw = await AsyncStorage.getItem(STORAGE_KEYS.OUTBOX_QUEUE);
    const queue = raw ? JSON.parse(raw) : [];

    const newAction = {
      id: action.id || `${Date.now()}_${Math.random().toString(36).substring(2, 8)}`,
      method: action.method,
      url: action.url,
      body: action.body || null,
      createdAt: action.createdAt || new Date().toISOString(),
      entityType: action.entityType || null, // Phân loại: 'assignment' | 'student'
      entityId: action.entityId || null,
    };

    queue.push(newAction);
    await AsyncStorage.setItem(STORAGE_KEYS.OUTBOX_QUEUE, JSON.stringify(queue));
    return newAction;
  } catch (err) {
    console.warn('Lỗi khi thêm vào outbox:', err);
    throw err;
  }
}

/**
 * Lấy toàn bộ danh sách thao tác trong hàng đợi outbox theo thứ tự thêm vào (FIFO)
 * @returns {Promise<Array>}
 */
export async function getAll() {
  try {
    const raw = await AsyncStorage.getItem(STORAGE_KEYS.OUTBOX_QUEUE);
    if (!raw) return [];
    return JSON.parse(raw);
  } catch (err) {
    console.warn('Lỗi khi lấy danh sách outbox:', err);
    return [];
  }
}

/**
 * Xóa một thao tác khỏi hàng đợi outbox theo id
 * @param {string} id
 * @returns {Promise<void>}
 */
export async function remove(id) {
  try {
    const raw = await AsyncStorage.getItem(STORAGE_KEYS.OUTBOX_QUEUE);
    if (!raw) return;
    const queue = JSON.parse(raw);
    const updated = queue.filter((item) => item.id !== id);
    await AsyncStorage.setItem(STORAGE_KEYS.OUTBOX_QUEUE, JSON.stringify(updated));
  } catch (err) {
    console.warn('Lỗi khi xóa khỏi outbox:', err);
  }
}

/**
 * Xóa sạch toàn bộ hàng đợi outbox
 * @returns {Promise<void>}
 */
export async function clearAll() {
  try {
    await AsyncStorage.removeItem(STORAGE_KEYS.OUTBOX_QUEUE);
  } catch (err) {
    console.warn('Lỗi khi làm sạch outbox:', err);
  }
}

export default {
  enqueue,
  getAll,
  remove,
  clearAll,
};

