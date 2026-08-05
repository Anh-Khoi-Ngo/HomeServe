import { mapEmbedUrl } from '../services/osm.js'

/** OpenStreetMap embed for a location. Renders a placeholder while geocoding. */
export default function MapView({ lat, lon, title = 'Location' }) {
  if (lat == null || lon == null) {
    return (
      <div className="flex h-56 items-center justify-center rounded-2xl border border-dashed border-gray-300 bg-fog text-sm text-mist">
        Enter an address to see it on the map
      </div>
    )
  }

  return (
    <div className="overflow-hidden rounded-2xl border border-gray-200 shadow-sm">
      <iframe
        title={title}
        src={mapEmbedUrl(lat, lon)}
        className="h-56 w-full border-0"
        loading="lazy"
      />
      <div className="flex items-center justify-between bg-white px-4 py-2.5 text-xs text-ink-soft">
        <span>📍 OpenStreetMap</span>
        <a
          href={`https://www.openstreetmap.org/?mlat=${lat}&mlon=${lon}#map=16/${lat}/${lon}`}
          target="_blank"
          rel="noreferrer"
          className="font-semibold text-primary transition hover:text-primary-dark"
        >
          Open in OSM →
        </a>
      </div>
    </div>
  )
}
