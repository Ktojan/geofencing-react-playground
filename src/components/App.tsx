import React, { useEffect, useState } from 'react';
import "./App.scss";
import DrawToolbar from "./DrawToolbar";
import { layoutStyle, headerStyle, siderStyle} from "../constants/UIConstants";
// Design, UI components
import { Layout } from "antd";
import { Button, Checkbox, Form, Input } from 'antd';
// Mapping libs and files
import * as L from "leaflet";
import type { LatLngTuple } from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { FeatureGroup, MapContainer, Polygon, Popup, TileLayer } from 'react-leaflet';
import areasFromGeojson from '../public/geofiles/initial-areas.geo.json'

const initialLocation = {
  name: 'Germany geocenter', initialZoom: 7, coordsLeaflet: [51.163715932396634, 10.447797582382846],
}
const greenOptions = { color: 'green', fillColor: 'green' }
const purpleOptions = { color: 'purple', fillColor: 'purple' }

const { Header, Sider, Content } = Layout;

export default function App() {
  const [drawObject, setDrawObject] = useState(null);

  function onSaved(values) {
    if (!drawObject) return;
    if (values.areaname) drawObject['properties'].name = values.areaname
    console.log('Saved object in GeoJSON format: ', drawObject);
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
            initialValues={{ areaname: 'Led Zeppelin area'  }}
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
          <MapContainer center={initialLocation.coordsLeaflet as LatLngTuple} zoom={initialLocation.initialZoom}>
            <TileLayer
              attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
              url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            />
            {/* Grouped existing objects with common fill color, other then current for drawing */}
            <FeatureGroup pathOptions={purpleOptions}>
              {areasFromGeojson.features.map((area, i) => (
                <><Polygon
                  positions={area.geometry.coordinates[0] as LatLngTuple[]}
                  stroke={true} key={i}>
                  <Popup key={area.properties.name}><b>Area: </b> {area.properties.name}</Popup>
                  </Polygon>
                  </>)
              )}
            </FeatureGroup>
            <DrawToolbar setDrawObject={setDrawObject}></DrawToolbar>
            {/* <GeocoderComponent/> */}
          </MapContainer>
        </Content>
      </Layout>
    </Layout>
  )
}
