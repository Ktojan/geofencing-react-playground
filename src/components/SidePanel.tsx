import { Button, Form, Input, InputNumber, Table } from 'antd';
const { Column } = Table;
import React from 'react';

export default function SidePanel( { devicesLocations, setDevicesLocations, saveObjectToStore}) {

function updateMobile(record) {
  const newCoords = record.automoveCoords.shift();
  if(!newCoords) {
    alert('No more coords for automove, ya');
    return;
  }
  record.lat = newCoords[0];
  record.lon = newCoords[1];
  setDevicesLocations([...devicesLocations]);
}

function onChange (value, record, param) {
  if(!value || !record[param] || record[param] === value) return;
  record[param] = value;
  setDevicesLocations([...devicesLocations]);
};

  return  <>
  <Form
    layout="vertical"
    style={{ maxWidth: '70%', margin: '40px auto' }}
    initialValues={{ areaname: '' }}
    onFinish={saveObjectToStore}
  >
    <Form.Item
      label="NEW AREA NAME"
      name="areaname"
    ><Input width="70" />
    </Form.Item>
    <Form.Item label={null}>
      <Button type="primary" htmlType="submit">
        Save
      </Button>
    </Form.Item>
  </Form>
  
  <hr/>
  <h2>Mobiles coordinates</h2>
  <Table dataSource={devicesLocations}
    size="small"  style={{width: '100%'}} pagination={{ hideOnSinglePage: true }}>
    <Column title="Mobile" dataIndex="mobile" key="mobile" />
    <Column title="Latitude" dataIndex="lat" key="lat"
      render={(_: any, record) => (
        <InputNumber defaultValue={record.lat} step="0.001" onChange={(value) => onChange(value, record, 'lat')} />
      )} />
    <Column title="Longitude" dataIndex="lon" key="lon" 
     render={(_: any, record) => (
      <InputNumber defaultValue={record.lon} step="0.001" onChange={(value) => onChange(value, record, 'lon')} />
    )} />
    <Column title="Automove"  key="automove"  render={(_: any, record) => (
        <Button color="primary" variant="outlined" onClick={() => updateMobile(record)}>Step</Button>
      )}
    />
  </Table>
  </>
}

