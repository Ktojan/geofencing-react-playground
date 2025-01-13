import { Marker, Point } from '../../constants/types';

export const initialMarkers: Marker[] = [ //is attached to areas, generated automatically and used for easily find them in big scale, has popup with name
    {
        name: "Mercedes",
        coords: [50.97292922987347, 10.968317868785817]
    },
    {
        name: "Frankfurt-OST",
        coords: [50.09455, 8.679255]
    },
    {
        name: 'Gardens or cemetry maybe',
        coords: [50.970064517375, 10.985115389125001]
    },
    {
        name: 'Bremen musicians camp',
        coords: [53.060136378, 8.83028016]
    }
]
export const initialMobiles: any[] = [ // movable points of mobile users
    {
        mobile: 'Terminator', lat: 50.97286583, lon: 10.96921128,
        automoveCoords: [
            [
                50.9726298,
                10.9704709
            ],
            [
                50.9722769,
                10.9698703
            ],
            [
                50.9728658,
                10.9692112
            ],
            [
                50.9734884,
                10.9691565
            ],
            [
                50.9740460,
                10.9691410
            ],
            [
                50.9740673,
                10.9704889
            ],
            [
                50.9732708,
                10.9703795
            ]
        ]
    },
    {
        mobile: 'Shrek', lat: 50.9721342, lon: 10.971275,
        automoveCoords: [
            [
                50.9722077,
                10.9715199
            ],
            [
                50.9722681,
                10.9716388
            ],
            [
                50.9724233,
                10.9717427
            ],
            [
                50.9726896,
                10.9717798
            ],
            [
                50.9729389,
                10.9714306
            ],
            [
                50.9729877,
                10.9711434
            ],
            [
                50.9729877,
                10.9708323
            ],
            [
                50.9729528,
                10.9703275
            ],
            [
                50.9730367,
                10.9701251
            ],
            [
                50.9729249,
                10.9698236
            ],
            [
                50.9727240,
                10.9700035
            ],
            [
                50.9725184,
                10.9701600
            ],
            [
                50.9723895,
                10.9704218
            ],
            [
                50.9723219,
                10.9705782
            ]
        ]
    },

]

export const initialPoints: Point[] = [ // Leaflet marker that is set and named by user for some add info, has permanent text label
    {
        "coords": [
            50.97288322, 10.967732134
        ],
        "label": "e-chargers"
    },
    {
        "coords": [
            50.974079269, 10.969829791
        ],
        "label": "Garden entrance"
    },
    {
        "coords": [
            50.972832951, 10.972020833
        ],
        "label": "VIP-parking"
    },
    {
        "coords": [
            50.971076218,
            10.97862208
        ],
        "label": "Nord-West parking lot"
    },
    {
        "coords": [
            53.058426281,
            8.837438822
        ],
        "label": "Meth lab",
        "id": "940bb883-1563-4c28-8606-e4d71fc36ba6"
    },
    {
        "coords": [
            53.059077527,
            8.832546473
        ],
        "label": "dead body zone",
        "id": "2ff4d209-c9a8-4afd-831d-35c922020abd"
    },
    {
        "coords": [
            53.060212349,
            8.833533525
        ],
        "label": "cops detector",
        "id": "1fae9950-e5bf-4956-9419-7873fdf2e4c7"
    }
]
