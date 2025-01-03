import { useMap } from 'react-leaflet';
import { useState, useEffect } from 'react';
import * as L from "leaflet";
import type { Map } from 'leaflet';
import '@sjaakp/leaflet-search/dist/leaflet-search.js'; //https://github.com/sjaakp/leaflet-search uses nominatim.openstreetmap


export default function GeocoderSearch() {
  const mapInstance: Map = useMap();

  const [geocoder, setGeocoder] = useState<L.Control>(null)

  useEffect(() => {
    if (!mapInstance || geocoder) return;
    const geocoderInstance: L.Control = (L.control as any).search();
    mapInstance.addControl(geocoderInstance);
    setGeocoder(geocoderInstance);
  }, [mapInstance])

  return null
}
