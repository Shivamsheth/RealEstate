// src/services/mapService.js

/**
 * Dynamically load the Google Maps JavaScript API
 * @param {string} apiKey – Your Google Maps API key (defaults to env var)
 * @param {string[]} [libraries=['places']] – Additional libraries to load
 * @returns {Promise<void>} Resolves when the API is ready
 */
let _gmapsPromise = null;
export function loadGoogleMaps(
  apiKey = process.env.REACT_APP_GOOGLE_MAPS_API_KEY,
  libraries = ['places']
) {
  if (window.google && window.google.maps) {
    return Promise.resolve();
  }
  if (_gmapsPromise) {
    return _gmapsPromise;
  }

  _gmapsPromise = new Promise((resolve, reject) => {
    const script = document.createElement('script');
    const libsParam = libraries.length ? `&libraries=${libraries.join(',')}` : '';
    script.src = `https://maps.googleapis.com/maps/api/js?key=${apiKey}${libsParam}`;
    script.async = true;
    script.defer = true;
    script.onload = () => resolve();
    script.onerror = (err) => reject(new Error('Google Maps failed to load: ' + err));
    document.head.appendChild(script);
  });

  return _gmapsPromise;
}

/**
 * Geocode an address string into latitude/longitude
 * @param {string} address
 * @returns {Promise<{ lat: number, lng: number }>}
 */
export async function geocodeAddress(address) {
  await loadGoogleMaps();
  const geocoder = new window.google.maps.Geocoder();
  return new Promise((resolve, reject) => {
    geocoder.geocode({ address }, (results, status) => {
      if (status === 'OK' && results[0]) {
        const { lat, lng } = results[0].geometry.location;
        resolve({ lat: lat(), lng: lng() });
      } else {
        reject(new Error(`Geocode failed: ${status}`));
      }
    });
  });
}

/**
 * Reverse geocode a lat/lng into a human-readable address
 * @param {{ lat: number, lng: number }} coords
 * @returns {Promise<string>}
 */
export async function reverseGeocode({ lat, lng }) {
  await loadGoogleMaps();
  const geocoder = new window.google.maps.Geocoder();
  return new Promise((resolve, reject) => {
    geocoder.geocode({ location: { lat, lng } }, (results, status) => {
      if (status === 'OK' && results[0]) {
        resolve(results[0].formatted_address);
      } else {
        reject(new Error(`Reverse geocode failed: ${status}`));
      }
    });
  });
}

/**
 * Create and initialize a map in the given container
 * @param {HTMLElement|string} container – Element or its ID
 * @param {{ lat: number, lng: number }} center
 * @param {number} [zoom=14]
 * @returns {Promise<google.maps.Map>}
 */
export async function createMap(container, center, zoom = 14) {
  await loadGoogleMaps();
  const el = typeof container === 'string'
    ? document.getElementById(container)
    : container;
  if (!el) {
    throw new Error('Map container not found');
  }
  return new window.google.maps.Map(el, {
    center,
    zoom,
    disableDefaultUI: true,
  });
}

/**
 * Add a marker to a map
 * @param {google.maps.Map} map
 * @param {{ lat: number, lng: number }} position
 * @param {Object} [options]
 * @returns {google.maps.Marker}
 */
export function addMarker(map, position, options = {}) {
  return new window.google.maps.Marker({
    position,
    map,
    ...options,
  });
}

/**
 * Fit map bounds to an array of LatLng-like points
 * @param {google.maps.Map} map
 * @param {Array<{ lat: number, lng: number }>} coords
 */
export function fitBounds(map, coords) {
  const bounds = new window.google.maps.LatLngBounds();
  coords.forEach(pt => bounds.extend(pt));
  map.fitBounds(bounds);
}