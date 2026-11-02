import { request } from './client';

export const gradeService = {
  getAll: () => request('GET', '/grades?_expand=course'),
  getById: (id) => request('GET', `/grades/${id}?_expand=course`),
};

export default gradeService;

