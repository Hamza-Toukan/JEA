import { API_ENDPOINTS } from "../api/endpoints";
import { get, post, put, del } from "../api/request";
import { APP_CONFIG } from "@/config/app";

export function listCampaigns(params = {}) {
  if (!APP_CONFIG.apiEnabled) {
    return Promise.resolve({ data: [], total: 0, limit: params.limit || 50, offset: params.offset || 0, success: true });
  }
  return get(API_ENDPOINTS.campaigns.list, {
    params: {
      limit: params.limit != null ? String(params.limit) : undefined,
      offset: params.offset != null ? String(params.offset) : undefined,
    },
  });
}

export function getCampaign(id) {
  if (!APP_CONFIG.apiEnabled) return Promise.resolve(null);
  return get(API_ENDPOINTS.campaigns.detail(id));
}

export function createCampaign(data) {
  if (!APP_CONFIG.apiEnabled) return Promise.resolve({ success: true, data: { ...data, id: "temp-id" } });
  return post(API_ENDPOINTS.campaigns.create, data);
}

export function updateCampaign(id, data) {
  if (!APP_CONFIG.apiEnabled) return Promise.resolve({ success: true, data: { ...data, id } });
  return put(API_ENDPOINTS.campaigns.update(id), data);
}

export function deleteCampaign(id) {
  if (!APP_CONFIG.apiEnabled) return Promise.resolve({ success: true, message: "Deleted successfully" });
  return del(API_ENDPOINTS.campaigns.delete(id));
}

export const campaignsService = { listCampaigns, getCampaign, createCampaign, updateCampaign, deleteCampaign };
