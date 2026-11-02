import { request } from './client';

export const sessionService = {
  getAll: () => request('GET', '/sessions?_expand=course'),
  getById: (id) => request('GET', `/sessions/${id}?_expand=course`),
};

export default sessionService;

