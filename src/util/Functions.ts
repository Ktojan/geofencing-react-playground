import { LatLngTuple } from "leaflet";

export function convertCoordsToLatLng({ ...geoJsonObject}: GeoJSON.Feature): GeoJSON.Feature {
    geoJsonObject.geometry['coordinates'][0] = geoJsonObject.geometry['coordinates'][0].map(pair => pair.reverse())
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
