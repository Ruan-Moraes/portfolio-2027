'use client';

import 'leaflet/dist/leaflet.css';
import { ExternalLink, MapPin } from 'lucide-react';
import { useTranslations } from 'next-intl';
import { memo, useEffect, useRef, useState } from 'react';
import { DEVELOPER_PROFILE } from '@/entities/developer-profile';

const MAP_KEY = process.env.NEXT_PUBLIC_MAPTILER_KEY?.trim();
const [lat, lng] = DEVELOPER_PROFILE.location.coordinates;
const MAP_LINK = `https://www.openstreetmap.org/#map=12/${lat}/${lng}`;
const ATTRIBUTION =
  '&copy; <a href="https://www.maptiler.com/copyright/">MapTiler</a> &copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap contributors</a>';
const OSM_ATTRIBUTION =
  '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap contributors</a>';

function BeloHorizonteMapComponent() {
  const t = useTranslations('contact.map');
  const city = t('city');
  const mapContainerRef = useRef<HTMLDivElement | null>(null);

  const [shouldLoadMap, setShouldLoadMap] = useState(false);
  const [mapFailed, setMapFailed] = useState(false);
  const showFallback = mapFailed;

  useEffect(() => {
    const el = mapContainerRef.current;

    if (!el) return;

    if (typeof IntersectionObserver === 'undefined') {
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
    if (!shouldLoadMap || mapFailed) return;

    let isCancelled = false;
    let mapInstance: import('leaflet').Map | null = null;

    async function initMap() {
      const L = await import('leaflet');

      if (isCancelled || !mapContainerRef.current) return;

      mapInstance = L.map(mapContainerRef.current, {
        center: [lat, lng],
        zoom: 12,
        scrollWheelZoom: false,
      });

      let hasLoadedTile = false;
      const tiles = L.tileLayer(
        MAP_KEY
          ? `https://api.maptiler.com/maps/streets-v4/{z}/{x}/{y}.png?key=${encodeURIComponent(MAP_KEY)}`
          : 'https://tile.openstreetmap.org/{z}/{x}/{y}.png',
        {
          maxZoom: 18,
          minZoom: 1,
          tileSize: MAP_KEY ? 512 : 256,
          zoomOffset: MAP_KEY ? -1 : 0,
          attribution: MAP_KEY ? ATTRIBUTION : OSM_ATTRIBUTION,
          crossOrigin: true,
        }
      );

      tiles.on('tileload', () => {
        hasLoadedTile = true;
      });
      tiles.once('load', () => {
        if (!isCancelled && !hasLoadedTile) setMapFailed(true);
      });
      tiles.addTo(mapInstance);

      const pulseIcon = L.divIcon({
        className: 'custom-bh-marker',
        html: `<div style="width:18px;height:18px;border-radius:9999px;background:var(--ui-accent, #00ff7f);box-shadow:0 0 20px 6px var(--ui-accent, #00ff7f);border:3px solid #020617;"></div>`,
        iconSize: [18, 18],
        iconAnchor: [9, 9],
      });

      L.marker([lat, lng], { icon: pulseIcon, title: city, alt: city })
        .addTo(mapInstance)
        .bindPopup(() => {
          const content = document.createElement('p');
          content.textContent = city;

          return content;
        });
    }

    void initMap().catch(() => {
      if (!isCancelled) setMapFailed(true);
    });

    return () => {
      isCancelled = true;

      if (mapInstance) {
        mapInstance.remove();
      }
    };
  }, [city, mapFailed, shouldLoadMap]);

  return (
    <div className="relative isolate h-72 w-full overflow-hidden rounded-2xl border border-[var(--ui-border)] bg-[var(--ui-surface-elevated)] sm:h-80">
      {showFallback ? (
        <div className="flex h-full flex-col items-center justify-center gap-3 p-4 text-center">
          <MapPin aria-hidden="true" className="h-6 w-6 text-[var(--ui-accent)]" />
          <p className="text-sm text-[var(--ui-text-secondary)]">
            {t('fallback')}
          </p>
          <a
            href={MAP_LINK}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 rounded-lg border border-[var(--ui-border)] px-3 py-2 text-sm font-semibold text-[var(--ui-text-primary)] hover:border-[var(--ui-accent)]"
          >
            {t('openMap')}
            <ExternalLink aria-hidden="true" className="h-3.5 w-3.5" />
          </a>
        </div>
      ) : (
        <>
          <div ref={mapContainerRef} aria-label={city} className="h-full w-full" />
          {shouldLoadMap && MAP_KEY && (
            <a
              href="https://www.maptiler.com/"
              target="_blank"
              rel="noopener noreferrer"
              className="absolute bottom-2 left-2 z-[500] rounded bg-white/90 p-1"
            >
              {/* The provider supplies its own attribution logo. */}
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src="https://api.maptiler.com/resources/logo.svg"
                alt="MapTiler"
                width={72}
                height={16}
              />
            </a>
          )}
        </>
      )}
    </div>
  );
}

export const BeloHorizonteMap = memo(BeloHorizonteMapComponent);

