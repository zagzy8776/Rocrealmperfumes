import axios from 'axios';

const rawApiUrl = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

const normalizeApiUrl = (url) => {
  const cleanUrl = String(url).replace(/\/+$/, '');
  return cleanUrl.endsWith('/api') ? cleanUrl : `${cleanUrl}/api`;
};

export const API_URL = normalizeApiUrl(rawApiUrl);

export const api = axios.create({ baseURL: API_URL });

api.interceptors.request.use((config) => {
  const token = localStorage.getItem('rrp_admin_token');
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

export const formatNaira = (value) => new Intl.NumberFormat('en-NG', {
  style: 'currency',
  currency: 'NGN',
  maximumFractionDigits: 0,
}).format(Number(value || 0));

export const whatsappNumber = import.meta.env.VITE_WHATSAPP_NUMBER || '2349084782126';

export const businessInfo = {
  name: 'Roc Realm Nigeria Limited',
  brand: 'Roc Realm Perfumes',
  email: 'rocrealmnigerialimited@gmail.com',
  phoneDisplay: '+234 908 478 2126',
  instagram: '@rocrealm_perfumes',
  tiktok: '@rocrealm_perfumes',
  instagramUrl: 'https://instagram.com/rocrealm_perfumes',
  tiktokUrl: 'https://www.tiktok.com/@rocrealm_perfumes',
  location: 'Owerri, Imo State, Nigeria',
  mapUrl: 'https://www.google.com/maps/dir/?api=1&destination=Roc%20Realm%20Perfumes%20Owerri%20Imo%20State%20Nigeria',
};
