import type { LatLngTuple } from 'leaflet';

export interface Marker {
    coords: LatLngTuple,
    name: string
}

export const initialMarkers: Marker[] = [ 
    {
        name: "Mercedes",
        coords: [50.97292922987347, 10.968317868785817]
    },
    {
        name: "Frankfurt-OST",
        coords: [ 50.09455, 8.679255 ]
    },
    {
        name: 'Gardens or cemetry maybe',
        coords: [ 50.970064517375, 10.985115389125001 ]
    },
    {
        name: 'Bremen musicians camp',
        coords: [ 53.063424738535865, 8.81839343977244 ]
    }
]
