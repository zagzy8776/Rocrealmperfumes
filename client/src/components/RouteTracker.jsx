import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { trackPageView } from '../lib/analytics.js';
import { setCanonicalMeta, setLocalGeoMeta, setOrganizationStructuredData, clearPageStructuredData } from '../lib/seo.js';

export default function RouteTracker() {
  const location = useLocation();

  useEffect(() => {
    setOrganizationStructuredData();
    setLocalGeoMeta();
    setCanonicalMeta({ url: `${window.location.origin}${location.pathname}${location.search}` });
    const timer = window.setTimeout(() => trackPageView(), 250);
    return () => window.clearTimeout(timer);
  }, [location.pathname, location.search]);

  useEffect(() => {
    clearPageStructuredData();
  }, [location.pathname, location.search]);

  return null;
}