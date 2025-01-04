import { useMap } from 'react-leaflet';
import { useState, useEffect } from 'react';
import * as L from "leaflet";
import type { Map } from 'leaflet';
import { FeatureGroup, Popup, Marker } from 'react-leaflet'; //https://react-leaflet.js.org/
import { initialMarkers, initialPoints } from '../public/geofiles/initial-markers';
import { markericon, pointicon } from '../constants/UIConstants';


export default function MarkersPoints() {
  const mapInstance: Map = useMap();

  useEffect(() => {
    initialPoints.forEach(m => {
      const mar: any = L.marker(m.coords, { icon: pointicon});
      mar.bindTooltip(m.label, { permanent: true, opacity: 1, direction: 'auto' }).addTo(mapInstance);
    })
  }, [])

  return <FeatureGroup>
    {initialMarkers.map(m => (
      <Marker position={m.coords} icon={markericon} title={m.name} key={m.name}>
        <Popup content={`<b>Marker ${m.name}</b>`}></Popup>
      </Marker>
    ))}
  </FeatureGroup>

}

