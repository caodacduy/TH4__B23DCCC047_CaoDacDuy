import { Platform } from 'react-native';

// Khi chạy trên máy ảo Android dùng 10.0.2.2:3000
// Khi chạy trên thiết bị thật qua Expo Go, đổi thành IP LAN máy tính (ví dụ: http://192.168.1.10:3000)
// Khi chạy iOS Simulator hoặc Web dùng localhost:3000
const DEFAULT_URL = Platform.select({
  android: 'http://10.0.2.2:3000',
  default: 'http://localhost:3000',
});

export const BASE_URL = DEFAULT_URL;

// Thời gian chờ tối đa cho mỗi yêu cầu API (10 giây theo yêu cầu A1)
export const TIMEOUT = 10000;

// Thời gian sống của cache (mặc định 1 giờ)
export const CACHE_TTL = 3600000;

export default {
  BASE_URL,
  TIMEOUT,
  CACHE_TTL,
};

