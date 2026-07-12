import axiosInstance from './axiosInstance';

export interface ReverseGeocodeResponse {
  label: string | null;
  address?: Record<string, string>;
  cached?: boolean;
}

// Calls our own server (/api/geocode), which proxies to Nominatim with the
// correct User-Agent, caching, and rate limiting — see server/controllers/geocodeController.ts
export const fetchReverseGeocode = async (lat: number, lng: number): Promise<string | null> => {
  try {
    const { data } = await axiosInstance.get<ReverseGeocodeResponse>('/geocode', {
      params: { lat, lng },
    });
    return data.label ?? null;
  } catch (err) {
    console.error('Reverse geocode proxy request failed:', err);
    return null;
  }
};