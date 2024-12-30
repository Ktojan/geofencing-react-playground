import { useMap } from 'react-leaflet';
import { useState, useEffect } from 'react';
import * as L from "leaflet";
import '@sjaakp/leaflet-search/dist/leaflet-search.js'; //https://github.com/sjaakp/leaflet-search uses nominatim.openstreetmap


export default function GeocoderSearch() {
  const mapInstance = useMap();
  mapInstance.addControl((L.control as any).search());
  return null
}
