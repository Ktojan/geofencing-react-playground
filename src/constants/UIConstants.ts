import * as L from "leaflet";

export const headerStyle: React.CSSProperties = {
    textAlign: 'left',
    color: '#fff',
    height: 64,
    lineHeight: '64px',
    backgroundColor: 'ivory',
    borderBottom: '4px #0854CE solid'
  };
  export const siderStyle: React.CSSProperties = {
    textAlign: 'center',
    color: '#4784EE', //lighter blue
    backgroundColor: 'white',
    borderRight: '3px #0854CE solid'
  };
  export const layoutStyle = {
    borderRadius: 8,
    overflow: 'hidden',
    width: '100%',
  };

export const markericon: L.Icon = L.icon({
    iconUrl: '../public/icons/bookmark-marker.svg',
    iconSize: [30, 30],
  });
export const pointicon: L.Icon = L.icon({
    iconUrl: '../public/icons/point.svg',
    iconSize: [15, 20],
});
export const noicon: L.Icon = L.icon({
    iconUrl: '../public/icons/point.svg',
    iconSize: [0, 0],
});
