export function convertCoordsToLatLng({ ...geoJsonObject}) {
    geoJsonObject.geometry.coordinates[0] = geoJsonObject.geometry.coordinates[0].map(pair => pair.reverse())
    return geoJsonObject;
}

export function calculateMarkerCoordsForObject(geoJsonObject) {
    const coords = geoJsonObject.geometry.coordinates[0];
    const markerCoords = coords.reduce((res, curr, i) => {
        {
            res[0] += curr[0]; res[1] += curr[1];
            return res;            
        } 
    }, [0, 0]).map(el => el/coords.length);
    return markerCoords;
}
