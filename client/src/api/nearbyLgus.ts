import axiosInstance from './axiosInstance';
import type { NearbyLGU, NearbyLGUStatus } from '../types/ticket';

interface NearbyLGUsResponse {
  status: NearbyLGUStatus;
  lgus: NearbyLGU[];
}

export const fetchNearbyLGUs = async (ticketId: string): Promise<NearbyLGUsResponse> => {
  const { data } = await axiosInstance.get<NearbyLGUsResponse>(`/tickets/${ticketId}/nearby-lgus`);
  return data;
};