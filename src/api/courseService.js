import { request } from './client';

export const courseService = {
  getAll: () => request('GET', '/courses'),
  getById: (id) => request('GET', `/courses/${id}`),
};

export default courseService;

