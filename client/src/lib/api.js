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

api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401 && window.location.pathname.startsWith('/admin') && window.location.pathname !== '/admin/login') {
      localStorage.removeItem('rrp_admin_token');
      window.location.href = '/admin/login';
    }
    return Promise.reject(error);
  },
);

export const formatNaira = (value) => new Intl.NumberFormat('en-NG', {
  style: 'currency',
  currency: 'NGN',
  maximumFractionDigits: 0,
}).format(Number(value || 0));

export const whatsappNumber = import.meta.env.VITE_WHATSAPP_NUMBER || '2349084782126';

export const logoUrl = '/logo.png.jpeg';

export const bankDetails = {
  bankName: 'Moniepoint',
  accountNumber: '5042844833',
  accountName: 'Roc Realm Nigeria Limited',
};

export const deliveryOptions = [
  { value: 'PICKUP', label: 'Pickup from store', fee: 0, note: 'Pick up from Roc Realm Perfumes in Owerri after confirmation.' },
  { value: 'OWERRI_DELIVERY', label: 'Owerri delivery', fee: 3000, note: 'Delivery within Owerri. Rider delivery will be coordinated after order confirmation.' },
  { value: 'WAYBILL_PARK', label: 'Waybill / park dispatch', fee: 1000, note: 'Covers sending your order to the park. Transport/rider may contact you for remaining delivery cost based on location.' },
  { value: 'OTHER_STATES_DISPATCH', label: 'Lagos & other states dispatch', fee: 0, note: 'Same-day dispatch may be available. Final transport/rider cost may depend on destination.' },
];

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
