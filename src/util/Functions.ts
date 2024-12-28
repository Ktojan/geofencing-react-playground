export function convertCoordsToLatLng({ ...geoJsonObject}) {
    geoJsonObject.geometry.coordinates[0] = geoJsonObject.geometry.coordinates[0].map(pair => pair.reverse())
    return geoJsonObject;
}
