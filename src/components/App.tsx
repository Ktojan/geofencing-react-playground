import { useState } from 'react';
import DrawToolbar from "./DrawToolbar";
import AddressSearch from "./AddressSearch";
import MarkersPoints from "./Markers_Points";
import SidePanel from "./SidePanel";
import Mobiles from "./Mobiles";
import "./App.scss";
// Design, UI components
import { Layout } from "antd";
import { layoutStyle, headerStyle, siderStyle } from "../constants/UIConstants";
// Mapping libs and files
import * as L from "leaflet";
import type { LatLngTuple } from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { FeatureGroup, MapContainer, Polygon, Popup, ScaleControl, ZoomControl, TileLayer, LayersControl } from 'react-leaflet'; //https://react-leaflet.js.org/
import areasFromGeojson from '../public/geofiles/initial-areas.geo.json' //todo maybe import from ts or some other way
import { initialMarkers, initialMobiles } from '../public/geofiles/initial-markers';
import { CustomLocation, DrawObjectType } from '../constants/types';
import { convertCoordsToLatLng } from '../util/Functions';

// **************************************   LEAFLET-OSM MAP   *********************************************//

const initialLocation: CustomLocation = {
  name: 'Germany geocenter', initialZoom: 7, coordsLeaflet: [51.163715932396634, 10.447797582382846],
}
const ErfurtMercedes: CustomLocation = {
  name: 'Mercedes Erfurt', initialZoom: 16, coordsLeaflet: [50.974079269, 10.969829791],
}

const greenOptions = { color: 'green', fillColor: 'green' }
const purpleOptions = { color: 'purple', fillColor: 'purple' }

const { Header, Sider, Content } = Layout;

export default function App() {
  const [drawObject, setDrawObject] = useState<DrawObjectType>(null);
  const [selectedBySearchObject, setSelectedBySearchObject] = useState<DrawObjectType>(null)
  const [devicesLocations, setDevicesLocations ] = useState(initialMobiles);

  function saveObjectToStore(values: {areaname: string}) {
    console.log('drawObject', drawObject);
    console.log('selectedBySearchObject', selectedBySearchObject);
    const drawToSave = drawObject ? drawObject
     : { draw: convertCoordsToLatLng(selectedBySearchObject['draw']), marker: selectedBySearchObject.marker };
    if (values.areaname) {
      drawToSave['draw']['properties'].name = values.areaname;
      drawToSave['marker'].name = values.areaname;
    }
    console.log('----- Push to store of areas ', drawToSave['draw']);
    console.log('----- Push to array of markers ', drawToSave['marker']);
  };


  return (
    <Layout style={layoutStyle}>
      <Header style={headerStyle}><img height='65' src='../public/images/litelog-logo.png'></img></Header>
      <Layout>
        <Sider width="22%" style={siderStyle}>
          <SidePanel
            devicesLocations={devicesLocations}
            setDevicesLocations={setDevicesLocations}
            saveObjectToStore={saveObjectToStore}/>
        </Sider>

        <Content>
          <MapContainer id="map-cont" center={ErfurtMercedes.coordsLeaflet as LatLngTuple}
            zoom={ErfurtMercedes.initialZoom || 12} zoomControl={false}>
            <LayersControl position="topright">
              <LayersControl.BaseLayer name="OSM Basic" checked={true}>
                <TileLayer url="https://tile.openstreetmap.de/{z}/{x}/{y}.png"
                  attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors' />
              </LayersControl.BaseLayer>
              <LayersControl.BaseLayer name="Umap Deutcheland">
                <TileLayer url="https://tile.openstreetmap.de/tiles/osmde/{z}/{x}/{y}.png" //https://umap.openstreetmap.de/de/map/new/#6/51.014/1.956
                  attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors <a class=""> — Info-Fenster öffnen</a>' />
              </LayersControl.BaseLayer>
              <LayersControl.BaseLayer name="Satellite">
                <TileLayer url="http://services.arcgisonline.com/ArcGis/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}.png"
                  attribution='&copy; Source: Esri, Maxar, Earthstar Geographics, and the GIS User Community' />
              </LayersControl.BaseLayer>

              {/* todo optimize handling cases with no initial objects */}
              { areasFromGeojson && areasFromGeojson['features'] && areasFromGeojson['features'].length>0 &&
               <LayersControl.Overlay name="Saved objects" checked={true}>
                <FeatureGroup pathOptions={purpleOptions}> 
                  {areasFromGeojson['features'].map((area, i) => (
                    <Polygon
                      positions={area.geometry.coordinates[0] as LatLngTuple[]}
                      stroke={true} key={i + area.properties.name + i}>
                      <Popup key={area.properties.name}><b>Area: </b> {area.properties.name}</Popup>
                    </Polygon>
                    )
                  )}
                </FeatureGroup>
              </LayersControl.Overlay> }

              {/* todo optimize handling cases with no initial objects */}
              { initialMarkers && initialMarkers.length > 0 &&
                <LayersControl.Overlay name="Markers for saved objects" checked={true}>                                    
                    <MarkersPoints />
                </LayersControl.Overlay>
              }
            </LayersControl>
            <ScaleControl position="bottomleft" imperial={false} metric={true} />
            <ZoomControl position="topright"/>

            {/* if user sets an object with help of AddressSearch then we start drawing with it, otherwise empty draw */}
            <AddressSearch setSelectedBySearchObject={setSelectedBySearchObject}/>

            <DrawToolbar setDrawObject={setDrawObject} selectedBySearchObject={selectedBySearchObject}></DrawToolbar>
            
            <Mobiles devicesLocations={devicesLocations}/>

          </MapContainer>
        </Content>
      </Layout>
    </Layout>
  )
}
