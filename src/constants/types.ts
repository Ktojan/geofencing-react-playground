import type { LatLngTuple } from 'leaflet';

export type CustomLocation = {
    name: string,
    coordsLeaflet: LatLngTuple,
    initialZoom?: number,
  }
  
  export type Marker = { //is attached to areas, generated automatically and used for easily find them in big scale, has popup with name
    name: string,
    coords: LatLngTuple
  }
  
  export type Point = { // Leaflet marker that is set and named by user for some add info, has permanent text label
    coords: LatLngTuple
    label: string,
    id?: string; // needed for update\delete operations
  }
  
  export type DrawObjectType = {
    draw: GeoJSON.Feature,
    marker?: Marker,
    points?: Point[]
  }
