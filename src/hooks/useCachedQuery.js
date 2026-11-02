import { useState, useEffect, useCallback, useRef } from 'react';
import { getCache, setCache } from '../storage/cache';
import { useNetworkStatus } from './useNetworkStatus';

/**
 * Custom hook thực thi truy vấn theo chiến lược "Cache trước, Mạng sau"
 * @param {string} key - Khóa cache trong AsyncStorage
 * @param {() => Promise<any>} fetcher - Hàm gọi API lấy dữ liệu
 * @returns {{
 *   data: any,
 *   loading: boolean,
 *   error: any,
 *   refreshing: boolean,
 *   lastUpdated: string | null,
 *   refresh: () => Promise<void>
 * }}
 */
export function useCachedQuery(key, fetcher) {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [refreshing, setRefreshing] = useState(false);
  const [lastUpdated, setLastUpdated] = useState(null);

  const { isOnline } = useNetworkStatus();
  const isMounted = useRef(true);

  useEffect(() => {
    isMounted.current = true;
    return () => {
      isMounted.current = false;
    };
  }, []);

  const loadData = useCallback(
    async (isManualRefresh = false) => {
      if (isManualRefresh) {
        setRefreshing(true);
      }

      let hasCache = false;

      // 1. Đọc dữ liệu từ cache trước
      try {
        const cached = await getCache(key);
        if (cached && isMounted.current) {
          setData(cached.data);
          setLastUpdated(cached.savedAt);
          hasCache = true;
          // Nếu đã có cache thì không cần hiển thị màn hình loading toàn trang
          if (!isManualRefresh) {
            setLoading(false);
          }
        }
      } catch (cacheErr) {
        console.warn(`Lỗi đọc cache cho khóa ${key}:`, cacheErr);
      }

      // 2. Nếu không có cache, hiển thị trạng thái loading
      if (!hasCache && !isManualRefresh && isMounted.current) {
        setLoading(true);
      }

      // 3. Nếu đang offline và đã có cache thì dừng lại
      if (!isOnline && hasCache) {
        if (isMounted.current) {
          setLoading(false);
          setRefreshing(false);
        }
        return;
      }

      // 4. Gọi API từ mạng
      try {
        const result = await fetcher();
        if (isMounted.current) {
          setData(result);
          setError(null);
          const now = new Date().toISOString();
          setLastUpdated(now);
          await setCache(key, result);
        }
      } catch (err) {
        console.warn(`Lỗi fetch API cho khóa ${key}:`, err);
        if (isMounted.current) {
          // Chỉ set error làm gián đoạn màn hình nếu không có dữ liệu cache nào
          if (!hasCache) {
            setError(err);
          }
        }
      } finally {
        if (isMounted.current) {
          setLoading(false);
          setRefreshing(false);
        }
      }
    },
    [key, fetcher, isOnline],
  );

  useEffect(() => {
    loadData();
  }, [loadData]);

  const refresh = useCallback(() => {
    return loadData(true);
  }, [loadData]);

  return {
    data,
    loading,
    error,
    refreshing,
    lastUpdated,
    refresh,
  };
}

export default useCachedQuery;

