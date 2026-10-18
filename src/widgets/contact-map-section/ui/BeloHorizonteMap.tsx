'use client';

import 'leaflet/dist/leaflet.css';
import { memo, useEffect, useRef, useState } from 'react';
import { DEVELOPER_PROFILE } from '@/entities/developer-profile';

function BeloHorizonteMapComponent() {
  const mapContainerRef = useRef<HTMLDivElement | null>(null);

  const [shouldLoadMap, setShouldLoadMap] = useState(false);

  useEffect(() => {
    const el = mapContainerRef.current;

    if (!el || typeof IntersectionObserver === 'undefined') {
      setShouldLoadMap(true);

      return;
    }

    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0]?.isIntersecting) {
          setShouldLoadMap(true);

          observer.disconnect();
        }
      },
      { rootMargin: '280px' }
    );

    observer.observe(el);

    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    if (!shouldLoadMap) return;

    let isCancelled = false;
    let mapInstance: import('leaflet').Map | null = null;

    async function initMap() {
      const L = await import('leaflet');

      if (isCancelled || !mapContainerRef.current) return;

      const [lat, lng] = DEVELOPER_PROFILE.location.coordinates;

      mapInstance = L.map(mapContainerRef.current, {
        center: [lat, lng],
        zoom: 12,
        zoomControl: false,
        attributionControl: false,
      });

      L.tileLayer(
        'https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png',
        {
          maxZoom: 18,
        }
      ).addTo(mapInstance);

      const pulseIcon = L.divIcon({
        className: 'custom-bh-marker',
        html: `<div style="width:18px;height:18px;border-radius:9999px;background:var(--ui-accent, #00ff7f);box-shadow:0 0 20px 6px var(--ui-accent, #00ff7f);border:3px solid #020617;"></div>`,
        iconSize: [18, 18],
        iconAnchor: [9, 9],
      });

      L.marker([lat, lng], { icon: pulseIcon })
        .addTo(mapInstance)
        .bindPopup(
          `<div style="font-family:monospace;font-size:12px;color:#0f172a;"><strong>${DEVELOPER_PROFILE.shortName}</strong><br/>Belo Horizonte, MG — Brasil</div>`
        );
    }

    void initMap();

    return () => {
      isCancelled = true;

      if (mapInstance) {
        mapInstance.remove();
      }
    };
  }, [shouldLoadMap]);

  return (
    <div className="relative h-72 w-full overflow-hidden rounded-2xl border border-[var(--ui-border)] sm:h-80">
      <div ref={mapContainerRef} className="h-full w-full bg-slate-950" />
    </div>
  );
}

export const BeloHorizonteMap = memo(BeloHorizonteMapComponent);

