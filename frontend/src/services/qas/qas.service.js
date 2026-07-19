import { API_ENDPOINTS } from '../api/endpoints';
import { get, post, put, del } from '../api/request';
import { APP_CONFIG } from '@/config/app';

export function list(params = {}) {
  if (!APP_CONFIG.apiEnabled) return Promise.resolve({ data: [], total: 0, success: true });
  return get(API_ENDPOINTS.qas.list, { params });
}

export function getDetail(id) {
  if (!APP_CONFIG.apiEnabled) return Promise.resolve(null);
  return get(API_ENDPOINTS.qas.detail(id));
}

export function create(data) {
  if (!APP_CONFIG.apiEnabled) return Promise.resolve({ success: true, data: { ...data, id: 'temp' } });
  return post(API_ENDPOINTS.qas.create, data);
}

export function update(id, data) {
  if (!APP_CONFIG.apiEnabled) return Promise.resolve({ success: true, data: { ...data, id } });
  return put(API_ENDPOINTS.qas.update(id), data);
}

export function remove(id) {
  if (!APP_CONFIG.apiEnabled) return Promise.resolve({ success: true });
  return del(API_ENDPOINTS.qas.delete(id));
}

export const qasService = { list, getDetail, create, update, remove };
