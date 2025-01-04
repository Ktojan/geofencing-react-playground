import { TerraDraw, TerraDrawFreehandMode, TerraDrawPolygonMode, TerraDrawRectangleMode, TerraDrawSelectMode, TerraDrawLeafletAdapter, 
   TerraDrawPointMode} from 'terra-draw' //https://github.com/JamesLMilner/terra-draw/tree/main
import { useMap } from 'react-leaflet';
import { useState, useEffect } from 'react';
import * as L from "leaflet";
import type { LatLngTuple, Map } from 'leaflet';
import { calculateMarkerCoordsForObject, convertCoordsToLatLng } from "../util/Functions";
import { Draw_buttons, DrawButton, SELECT_MODE_CONFIG } from '../constants/DrawingConstants'
import { Marker, DrawObjectType, Point } from '../constants/types'
import { pointicon, noicon } from '../constants/UIConstants';
import { Switch } from 'antd';

const DEFAULT_MODE = 'select';

export default function DrawToolbar({ setDrawObject }) {

  const map: Map = useMap(); //an instance of Leaflet native Map with all API available. Yeah, useful hook.
  const [currentMode, setCurrentMode] = useState<string>(DEFAULT_MODE) //default mode
  const [draw, setDraw] = useState<TerraDraw>(null)

  useEffect(() => {
    if (map || !draw) initializeDraw();
  }, [map])

  useEffect(() => {
    // receive drawn objects when finished whether drawing, drag point or drag hole object
    if (draw) {
      draw.on("finish", (id: string, context: { action: string, mode: string }) => {
        if (['draw', 'dragFeature', 'dragCoordinate'].includes(context.action) && context.mode!== "point") {
          const object: any = draw.getSnapshot()[0];
          const currentDraw: GeoJSON.Feature = convertCoordsToLatLng(object);
          console.log('----- Finished draw action: ', context.action,  '.--------');
          console.log(currentDraw); //todo handle multiple draws
          const marker: Marker = { name: 'new area marker', coords: [0 ,0] as LatLngTuple };
          marker.coords = calculateMarkerCoordsForObject(currentDraw) || currentDraw.geometry['coordinates'][0][0];
          setDrawObject({ draw: currentDraw, marker } as DrawObjectType);    
        } 
        if (context.mode === "point") {
          const object: any = draw.getSnapshot().at(-1);
          const Lcoords = object.geometry.coordinates.reverse();
          const pointName = prompt('Provide label', 'Point'); //todo
          L.marker(Lcoords, { icon: noicon})
            .bindTooltip(pointName, { permanent: true, opacity: 1, direction: 'auto' })
            .addTo(map);
          console.log('----- Push to store of markers/points ');
          console.log({ coords: Lcoords, label: pointName, id: object.id } as Point);          
        }
      }); 
      draw.on("change", (ids, type) => {
        if (type === "delete") {  //todo handle other objects beside points and markers if needed
          console.log('-------- Remove from store object with ID: ', ids);
        }
      });
    }
  }, [draw]) 

  function initializeDraw() {
    setCurrentMode(DEFAULT_MODE);
    const adapter = new TerraDrawLeafletAdapter({ map, lib: L });
    const modes = [new TerraDrawPolygonMode(), new TerraDrawRectangleMode(), new TerraDrawFreehandMode(), new TerraDrawPointMode(),
      new TerraDrawSelectMode(SELECT_MODE_CONFIG as any)];  
    const drawInstance: TerraDraw = new TerraDraw({
      adapter: adapter,
      modes: modes 
    });  
    drawInstance.start();
    drawInstance.setMode(DEFAULT_MODE);
    setDraw(drawInstance);
  }

  function toggleDrawMode(checked: boolean) {
    if (checked) {
      initializeDraw();
     } else {     
      if (draw) {
        draw.stop();
        draw.clear(); 
      }
      setDraw(null);
      setCurrentMode(null);
     }
  }

  return <div className='draw-toolbar'>
        <label> DRAW
        <Switch size="small" defaultChecked onChange={toggleDrawMode} />
        </label>
        { Draw_buttons.map((b: DrawButton) => (<button
        key={b.title}
        title={b.title}
        className={ currentMode === b.button_mode ? 'is-current' : ''}
        onClick={() => {
            draw.setMode(b.button_mode);
            setCurrentMode(b.button_mode);
        }}>
        <img src={`../public/icons/${b.icon_link}`} /> {/* todo in config public folder as default */}
      </button>)) }
    </div>
}
