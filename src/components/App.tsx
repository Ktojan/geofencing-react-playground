import React, { useEffect, useState } from 'react';
import "./App.scss";
import DrawToolbar from "./DrawToolbar";
import GeocoderSearch from "./GeocoderSearch";
import { layoutStyle, headerStyle, siderStyle } from "../constants/UIConstants";
// Design, UI components
import { Layout } from "antd";
import { Button, Checkbox, Form, Input } from 'antd';
// Mapping libs and files
import * as L from "leaflet";
import type { LatLngTuple } from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { FeatureGroup, MapContainer, Polygon, Popup, ScaleControl, TileLayer, LayersControl, Marker, useMap } from 'react-leaflet'; //https://react-leaflet.js.org/
import areasFromGeojson from '../public/geofiles/initial-areas.geo.json'
import { initialMarkers } from '../public/geofiles/initial-markers'

const initialLocation = {
  name: 'Germany geocenter', initialZoom: 7, coordsLeaflet: [51.163715932396634, 10.447797582382846],
}
const greenOptions = { color: 'green', fillColor: 'green' }
const purpleOptions = { color: 'purple', fillColor: 'purple' }

const { Header, Sider, Content } = Layout;

export default function App() {
  const [drawObject, setDrawObject] = useState(null);
  const markericon = L.icon({
    iconUrl: '../public/icons/bookmark-marker.svg',
    iconSize: [30, 30],
  });

  function onSaved(values) {
    if (!drawObject) return;
    if (values.areaname) {
      drawObject['draw']['properties'].name = values.areaname;
      drawObject['marker'].name = values.areaname;
    }
    console.log('Saved Area object in GeoJSON format: ', drawObject['draw']);
    console.log('Saved attached Marker ', drawObject['marker']);
  };

  return (
    <Layout style={layoutStyle}>
      <Header style={headerStyle}><img height='65' src='../public/images/litelog-logo.png'></img></Header>
      <Layout>
        <Sider width="15%" style={siderStyle}>
          <Form
            name="basic"
            layout="vertical"
            style={{ maxWidth: '90%', margin: '40px auto' }}
            initialValues={{ areaname: '' }}
            onFinish={onSaved}
            autoComplete="off"
          >
            <Form.Item
              label="NEW AREA NAME"
              name="areaname"
            ><Input width="80" />
            </Form.Item>

            <Form.Item label={null}>
              <Button type="primary" htmlType="submit" disabled={!drawObject}>
                Save
              </Button>
            </Form.Item>
          </Form>
        </Sider>
        <Content>
          <MapContainer id="map-cont" center={initialLocation.coordsLeaflet as LatLngTuple} zoom={initialLocation.initialZoom}>
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
                    <><Polygon
                      positions={area.geometry.coordinates[0] as LatLngTuple[]}
                      stroke={true} key={area.properties.name + i}>
                      <Popup key={area.properties.name}><b>Area: </b> {area.properties.name}</Popup>
                    </Polygon>
                    </>)
                  )}
                </FeatureGroup>
              </LayersControl.Overlay> }

              {/* todo optimize handling cases with no initial objects */}
              { initialMarkers && initialMarkers.length > 0 &&
              <LayersControl.Overlay name="Markers for saved objects" checked={true}>
                <FeatureGroup>
                  {initialMarkers.map(m => (
                    <Marker position={m.coords} icon={markericon} key={m.name}>
                      <Popup>{m.name}</Popup>
                    </Marker>
                  ))}
                </FeatureGroup>
              </LayersControl.Overlay>
              }
            </LayersControl>
            <DrawToolbar setDrawObject={setDrawObject}></DrawToolbar>
            <ScaleControl position="bottomleft" imperial={false} metric={true} />
            
           <GeocoderSearch/>

          </MapContainer>
        </Content>
      </Layout>
    </Layout>
  )
}
