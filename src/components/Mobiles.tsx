import { useMap } from 'react-leaflet';
import { useEffect, useState } from 'react';
import * as L from "leaflet";
import type { Map } from 'leaflet';

export default function Mobiles( { devicesLocations}) {
  const mapInstance: Map = useMap();
  const [ mobiles, setMobiles ] = useState([])

  useEffect(() => {      
    if (devicesLocations && devicesLocations.length > 0) {
      const updatedMobiles = [];
      if (mobiles && mobiles.length > 0) {
        mobiles.forEach(mobile => mapInstance.removeLayer(mobile));
      }
      devicesLocations.forEach(m => {
        const icon = L.icon({
          iconUrl: `../public/icons/${m.mobile.toLowerCase()}.png`,
          iconSize: [45, 45]
        });
        const moby: L.Marker = L.marker([m.lat, m.lon], { icon, draggable: true });
        moby.on('dragend', (ev) => console.log(ev['target'].getLatLng()));
        moby.bindPopup(m.mobile + ' coords: ' + m.lat + ' , ' + m.lon);
        updatedMobiles.push(moby);
        moby.addTo(mapInstance);
      });
      if(updatedMobiles.length > 0) setMobiles(updatedMobiles);
    }    
  }, [devicesLocations])

  return null
}

