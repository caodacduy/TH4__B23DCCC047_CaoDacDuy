import { request } from './client';

export const studentService = {
  getById: (id = 1) => request('GET', `/students/${id}`),
  update: (id, data) => request('PATCH', `/students/${id}`, data),
};

export default studentService;

