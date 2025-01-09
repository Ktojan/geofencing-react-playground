import { LatLngTuple } from "leaflet";
import { Marker, NominatimResult } from "../constants/types";

export function convertCoordsToLatLng({ ...geoJsonObject}: GeoJSON.Feature): GeoJSON.Feature {
    const target = geoJsonObject.geometry ?   //todo
        geoJsonObject.geometry['coordinates'][0]
        : geoJsonObject['coordinates'].length == 1
            ? geoJsonObject['coordinates'][0]
            : geoJsonObject['coordinates'];
    target.forEach(pair => pair.reverse())
    return geoJsonObject;
}

export function calculateMarkerCoordsForObject(geoJsonObject: GeoJSON.Feature ): LatLngTuple {
    const coords = geoJsonObject.geometry['coordinates'][0];
    const markerCoords: LatLngTuple = coords.reduce((res, curr, i) => {
        {
            res[0] += curr[0]; res[1] += curr[1];
            return res;            
        } 
    }, [0, 0]).map(el => el/coords.length);
    return markerCoords;
}

export const convertedToGeojsonObject = (inputObject: NominatimResult) => {
    const marker: Marker = {
         name: inputObject.custom_note ? inputObject.custom_note : '',
         coords: [Number(inputObject['lat']) , Number(inputObject['lon'])] as LatLngTuple
     };
    const outputObject = {
    draw: {
        type: "Feature",
        geometry: inputObject.geojson,
        properties: {
            name: inputObject.custom_note ? inputObject.custom_note : ''
        },
        id: inputObject['place_id']
    },
    marker
    };
    console.log(outputObject);
    return outputObject;
}
