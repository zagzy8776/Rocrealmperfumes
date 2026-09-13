const SITE_URL = (import.meta.env.VITE_SITE_URL || window.location.origin).replace(/\/$/, '');
const DEFAULT_IMAGE = `${SITE_URL}/og-image.svg`;
const SITE_TITLE = 'Roc Realm Perfumes | Luxury Perfumes in Owerri';
const DEFAULT_DESCRIPTION = 'Shop original designer Arabian fragrances, oil perfumes, body mists, diffusers, humidifiers, gift sets, and home scents in Owerri, Imo State.';

const upsert = (selector, attributes) => {
  let tag = document.head.querySelector(selector);
  if (!tag) { tag = document.createElement('meta'); document.head.appendChild(tag); }
  Object.entries(attributes).forEach(([key,value]) => tag.setAttribute(key,value));
};
const canonical = (url) => {
  let link = document.head.querySelector('link[rel="canonical"]');
  if (!link) { link = document.createElement('link'); link.rel='canonical'; document.head.appendChild(link); }
  link.href = url;
};
const absolute = (value) => { if (!value) return DEFAULT_IMAGE; try { return new URL(value, SITE_URL).href; } catch { return DEFAULT_IMAGE; } };

export const setPageMeta = ({ title, description, image, url, type='website', noindex=false } = {}) => {
  const finalTitle = title ? `${title} | Roc Realm Perfumes` : SITE_TITLE;
  const finalDescription = description || DEFAULT_DESCRIPTION;
  const finalUrl = url ? new URL(url, SITE_URL).href : `${SITE_URL}${window.location.pathname}`;
  const finalImage = absolute(image);
  document.title = finalTitle;
  upsert('meta[name="description"]',{name:'description',content:finalDescription});
  upsert('meta[name="robots"]',{name:'robots',content:noindex?'noindex,follow':'index,follow'});
  upsert('meta[property="og:title"]',{property:'og:title',content:finalTitle});
  upsert('meta[property="og:description"]',{property:'og:description',content:finalDescription});
  upsert('meta[property="og:type"]',{property:'og:type',content:type});
  upsert('meta[property="og:url"]',{property:'og:url',content:finalUrl});
  upsert('meta[property="og:image"]',{property:'og:image',content:finalImage});
  upsert('meta[property="og:site_name"]',{property:'og:site_name',content:'Roc Realm Perfumes'});
  upsert('meta[property="og:locale"]',{property:'og:locale',content:'en_NG'});
  upsert('meta[name="twitter:card"]',{name:'twitter:card',content:'summary_large_image'});
  upsert('meta[name="twitter:title"]',{name:'twitter:title',content:finalTitle});
  upsert('meta[name="twitter:description"]',{name:'twitter:description',content:finalDescription});
  upsert('meta[name="twitter:image"]',{name:'twitter:image',content:finalImage});
  canonical(finalUrl);
};

export const setJsonLd = (id, data) => {
  let script = document.getElementById(id);
  if (!script) { script=document.createElement('script'); script.id=id; script.type='application/ld+json'; document.head.appendChild(script); }
  script.textContent = JSON.stringify(data);
};

export const setProductStructuredData = (product) => {
  if (!product) return;
  const url = `${SITE_URL}/product/${product.slug}`;
  setJsonLd('product-jsonld',{ '@context':'https://schema.org', '@type':'Product', name:product.name, description:product.description || DEFAULT_DESCRIPTION, image:(product.images||[]).map(absolute), sku:product.id, category:product.category?.name, brand:product.brandType ? {'@type':'Brand',name:product.brandType}:undefined, offers:{'@type':'Offer',url,priceCurrency:'NGN',price:Number(product.salePrice||product.price),availability:product.stock>0?'https://schema.org/InStock':'https://schema.org/OutOfStock'} });
  setJsonLd('breadcrumb-jsonld',{'@context':'https://schema.org','@type':'BreadcrumbList',itemListElement:[{'@type':'ListItem',position:1,name:'Home',item:SITE_URL},{'@type':'ListItem',position:2,name:'Shop',item:`${SITE_URL}/shop`},{'@type':'ListItem',position:3,name:product.name,item:url}]});
};

export const setOrganizationStructuredData = () => setJsonLd('organization-jsonld',{'@context':'https://schema.org','@type':'LocalBusiness','name':'Roc Realm Perfumes','url':SITE_URL,'telephone':'+2349084782126','email':'rocrealmnigerialimited@gmail.com','address':{'@type':'PostalAddress','addressLocality':'Owerri','addressRegion':'Imo State','addressCountry':'NG'}});
