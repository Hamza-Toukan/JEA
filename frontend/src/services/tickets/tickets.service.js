import { API_ENDPOINTS } from "../api/endpoints";
import { get, post, put, del } from "../api/request";
import { APP_CONFIG } from "@/config/app";

export function listTickets(params = {}) {
  if (!APP_CONFIG.apiEnabled) {
    return Promise.resolve({ data: [], total: 0, limit: params.limit || 50, offset: params.offset || 0, success: true });
  }
  return get(API_ENDPOINTS.tickets.list, {
    params: {
      limit: params.limit != null ? String(params.limit) : undefined,
      offset: params.offset != null ? String(params.offset) : undefined,
    },
  });
}

export function getTicket(id) {
  if (!APP_CONFIG.apiEnabled) return Promise.resolve(null);
  return get(API_ENDPOINTS.tickets.detail(id));
}

export function createTicket(data) {
  if (!APP_CONFIG.apiEnabled) return Promise.resolve({ success: true, data: { ...data, id: "temp-id" } });
  return post(API_ENDPOINTS.tickets.create, data);
}

export function updateTicket(id, data) {
  if (!APP_CONFIG.apiEnabled) return Promise.resolve({ success: true, data: { ...data, id } });
  return put(API_ENDPOINTS.tickets.update(id), data);
}

export function deleteTicket(id) {
  if (!APP_CONFIG.apiEnabled) return Promise.resolve({ success: true, message: "Deleted successfully" });
  return del(API_ENDPOINTS.tickets.delete(id));
}

export const ticketsService = { listTickets, getTicket, createTicket, updateTicket, deleteTicket };
