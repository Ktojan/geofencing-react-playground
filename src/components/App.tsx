import React, { Component } from "react";
import mapboxgl, { LngLat, Map } from "mapbox-gl";
import "./App.scss";
import {
  Card,
  FormControl,
  FormControlLabel,
  FormLabel,
  Grid,
  RadioGroup,
  Checkbox,
  Snackbar,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow
} from "@material-ui/core";
import { Alert } from "@material-ui/lab";
import GeoUtil from "../util/GeoUtil";
import { MAPBOX_API_KEY } from "../../env";
import { Position } from "@turf/turf";

function Alert2(props) {
  return <Alert elevation={6} variant="filled" {...props} />;
}

// --------------  TABLE ---------------
function createData(
  subject: string,
  area: string,
  time: number, //todo Date-time
  isInside: boolean,
) {
  return { subject, area, time, isInside };
}

// --------------  TABLE END ---------------

mapboxgl.accessToken = 'pk.eyJ1IjoiZnJvbnQta2FycCIsImEiOiJjbTJnbWQwOGQwMzl1MmtzZ2k1YmYwdzF0In0.JUG2IY5Iondl4R7lUzumxQ'; //todo dialogue to input user api-key

const geojson = {
  type: 'FeatureCollection',
  features: [
    {
      type: 'Feature',
      properties: {
        name: 'Markio 1',
      },
      geometry: {
        type: 'Point',
        coordinates: [ 10.9711122, 50.972089 ]
      }
    },
    {
      type: 'Feature',
      properties: {
        name: 'Markio 2',
      },
      geometry: {
        type: 'Point',
        coordinates: [ 10.9705348, 50.973224 ]
      }
    },
  ]
};

//todo relocate inside geojson or to separate file
const mercedes1coords = [
  [
  10.968020388593118,
  50.972827834411845
],[
  10.971137542953386,
  50.97408440426818
],[
  10.970725065063903,
  50.97445140654085
],[
  10.967643439854498,
  50.9731018510395
],[
  10.968020388593118,
  50.972827834411845
]
]

const mercedes2coords: Position[] = [
  [
      10.970072288649476,
      50.9733232998332
  ],  [
      10.97080807026299,
      50.97266093547202
  ],  [
      10.972219680914321,
      50.9729663792786
  ],  [
      10.971320392275572,
      50.973848379893894
  ],  [
      10.970072288649476,
      50.9733232998332
  ]
]

const mercedes3coords: Position[] =  [
  [
    10.969470651174845,
    50.97297049728169
  ],
  [
    10.969790813486185,
    50.97265936054694
  ],
  [
    10.971936721803644,
    50.97234081639877
  ],
  [
    10.971907446045293,
    50.97251678794342
  ],
  [
    10.971089182791872,
    50.97282905240701
  ],
  [
    10.970585644271722,
    50.9726438295248
  ],
  [
    10.970117638674452,
    50.97284057118674
  ],
  [
    10.969741807371179,
    50.97308532396454
  ],
  [
    10.969470651174845,
    50.97297049728169
  ]
]

interface AppState {
  map?: Map;
  location: any;
  currentCheckCoords?: any;
  showAlert: boolean;
  isInsideGeofence: boolean;
  tableData: any;
  selectedAreas: Array<{ name: string, active: boolean, coords: Array<any>}>
}

export default class App extends Component<{}, AppState> {
  mapContainerRef: any;
  // mapContainerRef: RefObject<HTMLDivElement> | HTMLElement | null;

  constructor(props) {
    super(props);
    this.mapContainerRef = React.createRef();
    const latitude = mercedes2coords[0][1];
    const longitude = mercedes2coords[0][0];
    this.state = {
      isInsideGeofence: false,
      showAlert: false,
      currentCheckCoords: { object: '', longitude: [], latitude: [] },
      location: {
        latitude,
        longitude
      },
      tableData: [],
      selectedAreas: [ 
        {name: 'Area1 green', active: true, coords: mercedes1coords},
        {name: 'Area2 blue', active: true, coords: mercedes2coords},
        {name: 'Area3 violet', active: false, coords: mercedes3coords}
      ]
    };
  }

  componentDidMount() {
    this.initMap();
  }

  checkIntersection = () => {
    let { currentCheckCoords, selectedAreas } = { ...this.state };
    let geoCoordinates = [];
    selectedAreas
      .filter(area => area.active)
      .forEach(area => {
        const addedZone = area.coords.map(el => ({
          "longitude": el[0],
          "latitude": el[1],
        }))
        geoCoordinates = geoCoordinates.concat(addedZone)
     });  
    console.log(geoCoordinates);
    let isInsideGeofence = GeoUtil.pointInPolygon(geoCoordinates, currentCheckCoords);
    this.setState({ showAlert: true, isInsideGeofence });
    return isInsideGeofence;
  };

  initMap() {
    mapboxgl.accessToken = MAPBOX_API_KEY;
    const { location, currentCheckCoords, tableData, selectedAreas } = { ...this.state };
    const map = new mapboxgl.Map({
      container: this.mapContainerRef.current,
      style: "mapbox://styles/mapbox/streets-v11",
      center: [location.longitude, location.latitude],
      zoom: 16,
    });
    const scale = new mapboxgl.ScaleControl({
      maxWidth: 80,
      unit: "imperial",
    });
    map.addControl(scale);
    scale.setUnit("imperial");
    
    map.on("load", () => {
      map.addSource("geofence2", {
        type: "geojson",
        data: {
          type: "Feature",
          properties: [],
          geometry: {
            type: "Polygon",
            coordinates: [mercedes2coords],
          },
        },
      });
      map.addLayer({
        id: "geofence2",
        type: "fill",
        source: "geofence2",
        layout: {},
        paint: {
         'fill-color': '#0080ff',
          'fill-opacity': 0.6
        },
      });
      map.addSource("geofence1", {
        type: "geojson",
        data: {
          type: "Feature",
          properties: [],
          geometry: {
            type: "Polygon",
            coordinates: [mercedes1coords],
          },
        },
      })
      map.addLayer({
        id: "geofence1",
        type: "fill",
        source: "geofence1",
        layout: {},
        paint: {
         'fill-color': 'lightgreen',
          'fill-opacity': 0.6
        },
      })
      map.addSource("geofence3", {
        type: "geojson",
        data: {
          type: "Feature",
          properties: [],
          geometry: {
            type: "Polygon",
            coordinates: [mercedes3coords],
          },
        },
      })
      map.addLayer({
        id: "geofence3",
        type: "fill",
        source: "geofence3",
        layout: {},
        paint: {
         'fill-color': 'indigo',
          'fill-opacity': 0.5
        },
      })
     
    
    for (const marker of geojson.features) {
      const el = document.createElement('div');
      const p = document.createElement('p');
      p.innerText = marker.properties.name;
      el.className = 'mariomarker';
      el.appendChild(p);
      new mapboxgl.Marker({ element: el, draggable: true })
        .setLngLat(mapboxgl.LngLat.convert(marker.geometry.coordinates as [number, number]))
        .setPopup(new mapboxgl.Popup().setHTML(`<h1>${marker.properties.name}</h1><p>`))
        .on('dragend', (event) => {
          const lngLat = event.target.getLngLat(); 
          this.setState({
            currentCheckCoords: { name: marker.properties.name, latitude: lngLat.lat, longitude: lngLat.lng},
          });
          const areas = selectedAreas.filter(a => a.active).reduce((acc, el)=> acc += el.name + ', ', '');
          const newTableRecord = createData(
            marker.properties.name,
            areas,
            Date.now(),
            this.checkIntersection()
          );         
          tableData.push(newTableRecord);
          this.setState({
            tableData
          });
        }).addTo(map);
    }
  });

    this.setState({ map });   
  }

  render() {
    const {
      location,
      currentCheckCoords,
      showAlert,
      isInsideGeofence,
      tableData,
      selectedAreas
    } = {
      ...this.state,
    };
    return (
      <div className="container">
        <div ref={this.mapContainerRef} className="map-container" />
        <Card className="form-container">
        <h2>Drag Markios to check <s>for drugs</s> geofencing</h2>
        <hr></hr>
        <FormControl component="fieldset">
            <FormLabel component="legend">Areas to check validation</FormLabel>
            <RadioGroup
              aria-label="Areas"
              name="areas"
            >
              { selectedAreas.map((area, i) => (
              <FormControlLabel              
                key={i}
                value={area.name}
                label={area.name}
                control={< Checkbox 
                  checked={area.active}
                  onChange={(e) => {
                    selectedAreas.find(el => el.name == area.name).active = e.target['checked'];
                    this.setState({ selectedAreas });
                  }}
                />}
              />
              ))}
            </RadioGroup>
      </FormControl>

      <hr></hr>

      <Table aria-label="simple table">
        <TableHead>
          <TableRow>
            <TableCell>Subject</TableCell>
            <TableCell>Active areas</TableCell>
            <TableCell>Time&nbsp;(Date.now)</TableCell>
            <TableCell>Valid?</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {tableData.map((row) => (
            <TableRow key={row.time}>
              <TableCell scope="row"> {row.subject} </TableCell>
              <TableCell scope="row">{row.area}</TableCell>
              <TableCell scope="row">{row.time}</TableCell>
              <TableCell scope="row" className={row.isInside ? 'green' : 'red'}>
                <b>{row.isInside ? 'YES' : 'NO'}</b></TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>

          <Grid item xs={12}>
          </Grid>
          {isInsideGeofence && (
            <Snackbar
              open={showAlert}
              //autoHideDuration={2000}
              onClose={() => {
                //this.setState({ showAlert: false }); //todo autohide
              }}
            >
              <Alert2                
                severity="success"
                //autoHideDuration={2000}
              >
                {currentCheckCoords.name} is inside the Geofence!
              </Alert2>
            </Snackbar>
          )}
          {!isInsideGeofence && (
            <Snackbar
              open={showAlert}
              //autoHideDuration={2000}
              onClose={() => {
                //this.setState({ showAlert: false });
              }}
            >
              <Alert2                
                severity="error"
                //autoHideDuration={2000}
              >
                {currentCheckCoords.name} is outside Geofence
              </Alert2>
            </Snackbar>
          )}
        </Card>
      </div>
    );
  }
}
