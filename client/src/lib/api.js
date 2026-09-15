import axios from 'axios';
const env=import.meta.env||{};
const rawApiUrl=env.VITE_API_URL||'http://localhost:5000/api';const normalizeApiUrl=url=>{const clean=String(url).replace(/\/+$/,'');return clean.endsWith('/api')?clean:`${clean}/api`;};export const API_URL=normalizeApiUrl(rawApiUrl);export const api=axios.create({baseURL:API_URL,withCredentials:true});
const readCookie=name=>document.cookie.split('; ').find(row=>row.startsWith(`${name}=`))?.split('=')[1]||'';
api.interceptors.request.use(config=>{if(!['get','head','options'].includes((config.method||'get').toLowerCase())){const csrf=readCookie('rrp_csrf');if(csrf)config.headers['X-CSRF-Token']=decodeURIComponent(csrf);}return config;});api.interceptors.response.use(r=>r,e=>{if(e.response?.status===401&&window.location.pathname.startsWith('/admin')&&window.location.pathname!=='/admin/login')window.location.href='/admin/login';return Promise.reject(e);});
export const formatNaira=value=>new Intl.NumberFormat('en-NG',{style:'currency',currency:'NGN',maximumFractionDigits:0}).format(Number(value||0));export const whatsappNumber=env.VITE_WHATSAPP_NUMBER||'2349084782126';export const logoUrl='/logo.png.jpeg';export const bankDetails={bankName:env.VITE_BANK_NAME||'Moniepoint',accountNumber:env.VITE_BANK_ACCOUNT_NUMBER||'',accountName:env.VITE_BANK_ACCOUNT_NAME||'Roc Realm Nigeria Limited'};export const deliveryOptions=[{value:'PICKUP',label:'Pickup from store',fee:0,note:'Pick up from Roc Realm Perfumes in Owerri after confirmation.'},{value:'OWERRI_DELIVERY',label:'Owerri delivery',fee:3000,note:'Delivery within Owerri. Rider delivery will be coordinated after order confirmation.'},{value:'WAYBILL_PARK',label:'Waybill / park dispatch',fee:1000,note:'Covers sending your order to the park. Transport/rider may contact you for remaining delivery cost based on location.'},{value:'OTHER_STATES_DISPATCH',label:'Other states dispatch',fee:0,note:'Other locations are coordinated based on destination.'}];export const businessInfo={
  name:'Roc Realm Nigeria Limited',
  brand:'Roc Realm Perfumes',
  email:'rocrealmnigerialimited@gmail.com',
  phoneDisplay:'+234 908 478 2126',
  callLine:'08085100229',
  storePhoneE164:'+2348085100229',
  whatsappE164:'+2349084782126',
  address:{street:'Prof Avenue Junction, by Spibat Road, Uratta',locality:'Owerri',region:'Imo State',postalCode:'460221',country:'NG'},
  fullAddress:'Prof Avenue Junction, by Spibat Road, Uratta, Owerri, Imo State 460221, Nigeria',
  location:'Owerri, Imo State, Nigeria',
  openingHours:'Monday - Saturday, 9:00am - 8:00pm',
  kgmid:'/g/11z5srdjhd',
  hasMap:'https://www.google.com/maps/search/?api=1&query=Roc+Realm+Perfumes+Uratta+Owerri',
  mapEmbed:'https://www.google.com/maps?q=Roc+Realm+Perfumes+Uratta+Owerri&output=embed',
  mapUrl:'https://www.google.com/maps/dir/?api=1&destination=Roc+Realm+Perfumes%2C+Prof+Avenue+Junction%2C+by+Spibat+Road%2C+Uratta%2C+Owerri%2C+Imo+State+460221%2C+Nigeria',
  instagram:'@rocrealm_perfumes',
  tiktok:'@rocrealm_perfumes',
  instagramUrl:'https://instagram.com/rocrealm_perfumes',
  tiktokUrl:'https://www.tiktok.com/@rocrealm_perfumes'
};
