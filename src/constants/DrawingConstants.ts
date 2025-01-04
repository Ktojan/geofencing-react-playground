export type DrawButton = {
  title: string,
  button_mode: string,
  icon_link?: string
}
export const Draw_buttons: DrawButton[] = [
  { title: "Draw Polygon", button_mode: 'polygon', icon_link: 'draw-polygon.png' },
  { title: "Draw Rectangle", button_mode: 'rectangle', icon_link: 'rectangle.png' },
  { title: "Freehand drawing", button_mode: 'freehand', icon_link: 'pencil.png' },
  { title: "Points", button_mode: 'point', icon_link: 'point.svg' },
  { title: "Select & Modify/Remove", button_mode: 'select', icon_link: 'select-mode.png' },
];

export const SELECT_MODE_CONFIG = {
    dragEventThrottle: 3,
    flags: {
      polygon: {
        feature: {
          draggable: true,
          rotateable: true, //todo how to rotate
          scaleable: true, //todo how to scale
          coordinates: {
            midpoints: true,
            draggable: true,
            deletable: true,
          },
        },
      },
      rectangle: {
        feature: {
          draggable: true,
          coordinates: {
            midpoints: true,
            draggable: true,
            deletable: true,
          },
        },
      },
      freehand: {
        feature: {
          draggable: true,
          coordinates: {
            midpoints: true,
            draggable: true,
            deletable: true,
          },
        },
      },
      point: {
        feature: {
          draggable: false,
          deletable: true
        },
      },
    },
    styles: {
      selectedPolygonColor: '#f6cd63',
      selectedPolygonOutlineColor: '#faa38f',
      selectionPointWidth: 5,
      selectionPointColor: '#faa38f',
      selectionPointOutlineWidth: 2,
      selectionPointOutlineColor: '#f5f5f5',
      midPointColor: '#f6cd63',
      midPointOutlineColor: '#f5f5f5',
      midPointWidth: 3,
      midPointOutlineWidth: 2,
      selectedPointWidth: 3
    }
  }
