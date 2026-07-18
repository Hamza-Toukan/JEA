import { API_ENDPOINTS } from "../api/endpoints";
import { get, post, put, del } from "../api/request";
import { APP_CONFIG } from "@/config/app";

export function listEmployees(params = {}) {
  if (!APP_CONFIG.apiEnabled) {
    return Promise.resolve({ data: [], total: 0, limit: params.limit || 50, offset: params.offset || 0, success: true });
  }
  return get(API_ENDPOINTS.employees.list, {
    params: {
      limit: params.limit != null ? String(params.limit) : undefined,
      offset: params.offset != null ? String(params.offset) : undefined,
    },
  });
}

export function getEmployee(id) {
  if (!APP_CONFIG.apiEnabled) return Promise.resolve(null);
  return get(API_ENDPOINTS.employees.detail(id));
}

export function createEmployee(data) {
  if (!APP_CONFIG.apiEnabled) return Promise.resolve({ success: true, data: { ...data, id: "temp-id" } });
  return post(API_ENDPOINTS.employees.create, data);
}

export function updateEmployee(id, data) {
  if (!APP_CONFIG.apiEnabled) return Promise.resolve({ success: true, data: { ...data, id } });
  return put(API_ENDPOINTS.employees.update(id), data);
}

export function deleteEmployee(id) {
  if (!APP_CONFIG.apiEnabled) return Promise.resolve({ success: true, message: "Deleted successfully" });
  return del(API_ENDPOINTS.employees.delete(id));
}

export const employeesService = { listEmployees, getEmployee, createEmployee, updateEmployee, deleteEmployee };
