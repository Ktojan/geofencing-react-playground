import { TerraDraw, TerraDrawMapboxGLAdapter, TerraDrawFreehandMode, TerraDrawPolygonMode,
   TerraDrawRectangleMode, TerraDrawSelectMode, TerraDrawLeafletAdapter } from 'terra-draw' //https://github.com/JamesLMilner/terra-draw/tree/main
import { useMap } from 'react-leaflet';
import { useState, useEffect } from 'react';
import * as L from "leaflet";
import type { LatLngTuple, Map } from 'leaflet';
import { calculateMarkerCoordsForObject, convertCoordsToLatLng } from "../util/Functions";
import { Draw_buttons, DrawButton, SELECT_MODE_CONFIG } from '../constants/DrawingConstants'
import { DrawObjectType, Marker } from './App';

const DEFAULT_MODE = 'select';

export default function DrawToolbar({ setDrawObject }) {

  const map: Map = useMap(); //an instance of Leaflet native Map with all API available. Yeah, useful hook.
  const [currentMode, setCurrentMode] = useState<string>(DEFAULT_MODE) //default mode
  const [draw, setDraw] = useState<TerraDraw>(null)

  useEffect(() => {
    if (!map || draw) return;
    const adapter = new TerraDrawLeafletAdapter({ map, lib: L });
    const modes = [new TerraDrawPolygonMode(), new TerraDrawRectangleMode(), new TerraDrawFreehandMode(),
      new TerraDrawSelectMode(SELECT_MODE_CONFIG as any)];  
    const drawInstance: TerraDraw = new TerraDraw({
      adapter: adapter,
      modes: modes 
    });  
    drawInstance.start();
    drawInstance.setMode(DEFAULT_MODE);
    setDraw(drawInstance);

    // Ensure clear up on dismount
    return () => {
      drawInstance.stop()
    }
  }, [map])

  useEffect(() => {
    // receive drawn objects when finished whether drawing, drag point or drag hole object
    if (draw) {
      draw.on("finish", (id: string, context: { action: string, mode: string }) => {
        if (['draw', 'dragFeature', 'dragCoordinate'].includes(context.action)) {
          const currentDraw: GeoJSON.Feature = convertCoordsToLatLng(draw.getSnapshot()[0]);
          console.log('------- Finished draw action: ', context.action,  '.--------');
          console.log(currentDraw); //todo handle multiple draws
          const marker: Marker = { name: 'new area marker', coords: [] as LatLngTuple[] };
          marker.coords = calculateMarkerCoordsForObject(currentDraw) || currentDraw.geometry['coordinates'][0][0];
          setDrawObject({ draw: currentDraw, marker } as DrawObjectType);    
        } 
      }); 
    }
  }, [draw]) 



  return <div className='draw-toolbar'>
        <label>DRAW</label>
        { Draw_buttons.map((b: DrawButton) => (<button
        key={b.title}
        title={b.title}
        disabled={!draw}
        className={ currentMode === b.button_mode ? 'is-current' : ''}
        onClick={() => {
            draw.setMode(b.button_mode);
            setCurrentMode(b.button_mode);
        }}>
        <img src={`../public/icons/${b.icon_link}`} /> {/* todo in config public folder as default */}
      </button>)) }
    </div>
}
