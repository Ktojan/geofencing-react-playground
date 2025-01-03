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
  TableRow,
  Button,
  Switch
} from "@material-ui/core";
import { Alert } from "@material-ui/lab";
import GeoUtil from "../util/GeoUtil";
import { MAPBOX_API_KEY } from "../../env";
import { initialAnimationPoints } from '../constants/AnimationConstants'
import markersFromGeojson from '../public/geofiles/markers.geo.json'
import areasFromGeojson from '../public/geofiles/initial-areas.geo.json'

function Alert2(props) {
  return <Alert elevation={6} variant="filled" {...props} />;
}


// --------------  TABLE ---------------
function createData(
  subject: string,
  area: Array<any>,
  time: number, //todo Date-time
  isInside: boolean,
) {
  return { subject, area, time, isInside };
}
// --------------  TABLE END ---------------

//todo dialogue to input user api-key
mapboxgl.accessToken = 'pk.eyJ1IjoiZnJvbnQta2FycCIsImEiOiJjbTJnbWQwOGQwMzl1MmtzZ2k1YmYwdzF0In0.JUG2IY5Iondl4R7lUzumxQ';

interface AppState {
  map?: Map;
  location: any;
  currentCheckCoords?: any;
  showAlert: boolean;
  isInsideGeofence: boolean;
  tableData: any;
  selectedAreas: Array<{ name: string, color: string, active: boolean, coords: Array<any>}>;
  markers: Array<any>;
}

export default class App extends Component<{}, AppState> {
  mapContainerRef: any;
  // mapContainerRef: RefObject<HTMLDivElement> | HTMLElement | null;

  constructor(props) {
    super(props);
    const mercedesLocation =  { longitude: 10.969604155309582, latitude: 50.97299477896706 };
    this.mapContainerRef = React.createRef();
    this.state = {
      isInsideGeofence: false,
      showAlert: false,
      currentCheckCoords: { object: '', longitude: [], latitude: [] },
      location: { ...mercedesLocation },
      tableData: [],
      selectedAreas: areasFromGeojson.features.map(feature => ({
         name: feature.properties.name,
         color: feature.properties.color,
         active: true,
         coords: feature.geometry.coordinates})
      ),
      markers: []
    };
  }

  componentDidMount() {
    this.initMap();
  }

  validateObjectGeofencing = (markerName: string) => {
    let { currentCheckCoords, selectedAreas, markers } = { ...this.state };
    let geoCoordinates = [];
    selectedAreas
      .filter(area => area.active)
      .forEach(area => {
        const addedZone = area.coords[0].map(el => ({
          "longitude": el[0],
          "latitude": el[1],
        }))
        geoCoordinates = geoCoordinates.concat(addedZone)
     });  
    let isInsideGeofence = GeoUtil.pointInPolygon(geoCoordinates, currentCheckCoords);
    const markio = markers.find(m => m.name == markerName);
    markio.classList[isInsideGeofence ? 'remove' : 'add']('invalidated');
    this.setState({ showAlert: true, isInsideGeofence });
    return isInsideGeofence;
  };

  initMap() {
    mapboxgl.accessToken = MAPBOX_API_KEY;
    const { location, markers, tableData } = { ...this.state };
    const map = new mapboxgl.Map({
      container: this.mapContainerRef.current,
      style: "mapbox://styles/mapbox/streets-v11",
      center: [location.longitude, location.latitude],
      pitch: 15,
      zoom: 16,
    });
    const scale = new mapboxgl.ScaleControl({
      maxWidth: 80,
      unit: "metric",
    });
    map.addControl(scale);

    map.on("load", () => {
      this.add3DLayer(map);
      
      this.addAreasToMap(map);  
     
      if (!markersFromGeojson || markersFromGeojson.features?.length === 0) return;
      this.addMarkersToMap(map);
  });
  
    this.setState({ map });   
  }

  add3DLayer(map) {
    const labelLayerId = map.getStyle().layers.find((layer) => layer.type === 'symbol' && layer.layout['text-field']).id;
    map.addLayer(
      {
        id: 'add-3d-buildings',
        source: 'composite',
        'source-layer': 'building',
        filter: ['==', 'extrude', 'true'],
        type: 'fill-extrusion',
        minzoom: 15,
        paint: {
          'fill-extrusion-color': '#aaa',
          'fill-extrusion-height': [
            'interpolate',
            ['linear'],
            ['zoom'],
            15,
            0,
            15.05,
            ['get', 'height']
          ],
          'fill-extrusion-base': [
            'interpolate',
            ['linear'],
            ['zoom'],
            15,
            0,
            15.05,
            ['get', 'min_height']
          ],
          'fill-extrusion-opacity': 0.7
        }
      },
      labelLayerId
    );
  }

  addAreasToMap(map) {
    areasFromGeojson.features.forEach(el => {
      map.addSource(el.properties.name, {
        type: "geojson",
        data: {
          type: "Feature",
          properties: [],
          geometry: {
            type: "Polygon",
            coordinates: el.geometry.coordinates,
          },
        },
      });
      map.addLayer({
        id: el.properties.name,
        type: "fill",
        source: el.properties.name,
        layout: {},
        paint: {
          'fill-color': el.properties.color,
          'fill-opacity': 0.6
        },
      }).on('click', el.properties.name, (e) => {
      new mapboxgl.Popup({ closeOnClick: true, closeOnMove: true })
        .setLngLat(e.lngLat)
        .setHTML(`<div style="cursor: pointer;">
          <h2 style="color: saddlebrown;">Area: ${el.properties.name}</h2>
          <b>color: ${el.properties.color}</b><br>
          <b>number of points: ${el.geometry.coordinates[0].length - 1}</b></div>
          `) // first point == last point
        .addTo(map);
      })
    })
  }

  addMarkersToMap(map) {
    const { markers, tableData, selectedAreas } = { ...this.state };
    for (const marker of markersFromGeojson.features) {
      const el = document.createElement('div');
      const p = document.createElement('p');
      p.innerText = marker.properties.name;
      el.className = 'mariomarker';
      el.appendChild(p);
      const Markio = new mapboxgl.Marker({ element: el, draggable: true })
        .setLngLat(mapboxgl.LngLat.convert(marker.geometry.coordinates as [number, number]))
        .setPopup(new mapboxgl.Popup().setHTML(`<h1>${marker.properties.name}</h1><p>`))
        .on('dragend', (event) => {
          const lngLat = event.target.getLngLat(); 
          this.addValidationRecord(marker.properties.name, lngLat.lng, lngLat.lat)
        }).addTo(map);
        markers.push({ 
          name: marker.properties.name,
          mapObject: Markio,
          classList: Markio.getElement().classList,
          valid: true,
          pointsForMotion: []
        })
    }
    this.setState({ markers });   
  }

  addValidationRecord(markerName: string, lng: number, lat: number) {
    const { tableData, selectedAreas } = { ...this.state };
    this.setState({
      currentCheckCoords: { name: markerName, latitude: lat, longitude: lng},
    });
    const areas = selectedAreas.filter(a => a.active);
    const newTableRecord = createData(
      markerName,
      areas,
      Date.now(),
      this.validateObjectGeofencing(markerName)
    );         
    tableData.unshift(newTableRecord);
    this.setState({
      tableData
    });
  }

  toggleAnimation(start, marker, index) {
    if (start) {
      marker.pointsForMotion = [...initialAnimationPoints[index]];
      this.animateMarker(marker)
    } else {
      marker.pointsForMotion = [];
    }
  }

  animateMarker(marker) {
    if (!marker.pointsForMotion || marker.pointsForMotion.length == 0) return;
    let counter = 1, coef =  Math.floor(30 / marker.pointsForMotion.length);
    console.log(marker.pointsForMotion.length, 'coef: ', coef);  
    const intrId = setInterval(() => {
      if (marker.pointsForMotion?.length == 0) {
        clearInterval(intrId);
        return;
      }
      const currentLnglat = marker.pointsForMotion.shift();
      marker.mapObject.setLngLat(currentLnglat as [number, number]);
      if (counter % (5-coef) == 0) this.addValidationRecord(marker.name, currentLnglat[0], currentLnglat[1]);
      counter++;
    }, 250*coef);
  }

  render() {
    const {
      location,
      currentCheckCoords,
      showAlert,
      isInsideGeofence,
      tableData,
      selectedAreas,
      markers
    } = {
      ...this.state,
    };
    return (
      <div className="container">
        <div ref={this.mapContainerRef} className="map-container" />
        <Card className="form-container">
        <h2>Drag Markios to check <s>for drugs</s> geofencing</h2>
        <hr></hr>
        <aside className="handlers-container">
          <FormControl component="fieldset">
              <FormLabel component="legend">Areas to check validation</FormLabel>
              <RadioGroup
                aria-label="Areas"
                name="areas"
              >
                { selectedAreas.map((area, i) => (
                <div style={{position: 'relative'}} key={area.name + i}>
                  <FormControlLabel
                    key={i}
                    value={area.name}
                    label={area.name}
                    control={<Checkbox
                      checked={area.active}
                      onChange={(e) => {
                        selectedAreas.find(el => el.name == area.name).active = e.target['checked'];
                        this.setState({ selectedAreas });
                      } } />}
                    />
                    <span className="area-color-indicator checkbox-indicator" style={{backgroundColor: area.color}} key={area.color}></span>
                  </div>
                ))}
              </RadioGroup>
          </FormControl>
          <FormControl component="fieldset">
              <FormLabel component="legend">Interactions with Markios</FormLabel>
              <ul style={{listStyle: 'none'}}>
              { markers.map((m, i) => (
                <li key={m.name}>{m.name}&nbsp;
              <FormControlLabel style={{marginLeft: '5px'}} control={
                <Switch onChange={(event) => this.toggleAnimation(event.target.checked, m, i) } />
                } label="Animate" />
              </li>
              ))}
              </ul>
              
          </FormControl>
        </aside>

      <hr></hr>
      <Button
        variant="contained"
        color="secondary"
        disabled={tableData.length < 1}
        onClick={() => this.setState({
          tableData: []
        })}> Clear table
      </Button>
      <Table aria-label="simple table">
        <TableHead>
          <TableRow>
            <TableCell>№</TableCell>
            <TableCell>Subject</TableCell>
            <TableCell>Active areas</TableCell>
            <TableCell>Time&nbsp;(Date.now)</TableCell>
            <TableCell>Valid?</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {tableData.map((row, i) => (
            <TableRow key={row.time}>
              <TableCell scope="row"> {tableData.length - i} </TableCell>
              <TableCell scope="row"> {row.subject} </TableCell>
              <TableCell scope="row">{
                  row.area.map(area => {
                    return (<span className="area-color-indicator tablecell-indicator" style={{backgroundColor: area.color}} key={area.color}></span>)
              })}</TableCell>
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
