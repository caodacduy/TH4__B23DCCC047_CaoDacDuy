import { request } from './client';

export const assignmentService = {
  getAll: () => request('GET', '/assignments?_expand=course&_sort=dueDate'),
  getById: (id) => request('GET', `/assignments/${id}?_expand=course`),
  update: (id, data) => request('PATCH', `/assignments/${id}`, data),
  create: (data) => request('POST', '/assignments', data),
};

export default assignmentService;

