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
      }
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
      midPointOutlineWidth: 2
    }
  }
