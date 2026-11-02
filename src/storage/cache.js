import AsyncStorage from '@react-native-async-storage/async-storage';

/**
 * Lấy dữ liệu cache từ AsyncStorage
 * @param {string} key
 * @returns {Promise<{ data: any, savedAt: string } | null>}
 */
export async function getCache(key) {
  try {
    const raw = await AsyncStorage.getItem(key);
    if (!raw) return null;
    return JSON.parse(raw);
  } catch (err) {
    console.warn(`Lỗi khi đọc cache với khóa ${key}:`, err);
    return null;
  }
}

/**
 * Lưu dữ liệu vào cache kèm thời điểm lưu
 * @param {string} key
 * @param {any} data
 * @returns {Promise<void>}
 */
export async function setCache(key, data) {
  try {
    const payload = {
      data,
      savedAt: new Date().toISOString(),
    };
    await AsyncStorage.setItem(key, JSON.stringify(payload));
  } catch (err) {
    console.warn(`Lỗi khi ghi cache với khóa ${key}:`, err);
  }
}

export default {
  getCache,
  setCache,
};

