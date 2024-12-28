import { TerraDraw, TerraDrawMapboxGLAdapter, TerraDrawFreehandMode, TerraDrawPolygonMode,
   TerraDrawRectangleMode, TerraDrawSelectMode, TerraDrawLeafletAdapter } from 'terra-draw' //https://github.com/JamesLMilner/terra-draw/tree/main
import { useMap } from 'react-leaflet';
import { useState, useEffect } from 'react';
import * as L from "leaflet";
import { convertCoordsToLatLng } from "../util/Functions";
import { SELECT_MODE_CONFIG } from '../constants/DrawingConstants'

const DEFAULT_MODE = 'select';

export default function DrawToolbar({ setDrawObject }) {

  const map = useMap(); //an instance of Leaflet native Map with all API available. Yeah, useful hook.
  const [currentMode, setCurrentMode] = useState(DEFAULT_MODE) //default mode
  const [draw, setDraw] = useState(null as TerraDraw)

  useEffect(() => {
    if (!map || draw) return;
    const adapter = new TerraDrawLeafletAdapter({ map, lib: L });
    const modes = [new TerraDrawPolygonMode(), new TerraDrawRectangleMode(), new TerraDrawFreehandMode(),
      new TerraDrawSelectMode(SELECT_MODE_CONFIG as any)];  
    const drawInstance = new TerraDraw({
      adapter: adapter,
      modes: modes 
    });  
    drawInstance.start();
    drawInstance.setMode(DEFAULT_MODE);
    setDraw(drawInstance);
    console.log('Draw instance: ', draw);

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
          const currentDraw = convertCoordsToLatLng(draw.getSnapshot()[0]);
          console.log('------- Finished draw action: ', context.action,  '.--------');
          console.log(currentDraw); //todo handle multiple draws
          setDrawObject(currentDraw);
        } 
      }); 
    }
  }, [draw]) 

  const Draw_buttons = [
    { title: "Draw Polygon", button_mode: 'polygon', icon_link: 'draw-polygon.png' },
    { title: "Draw Rectangle", button_mode: 'rectangle', icon_link: 'rectangle.png' },
    { title: "Freehand drawing", button_mode: 'freehand', icon_link: 'pencil.png' },
    { title: "Select & Modify/Remove", button_mode: 'select', icon_link: 'select-mode.png' },
  ];

  return <div className='draw-toolbar'>
        <label>DRAW</label>
        { Draw_buttons.map(b => (<button
        key={b.title}
        title={b.title}
        disabled={!draw}
        className={ currentMode === b.button_mode ? 'is-current' : ''}
        onClick={() => {
            draw.setMode(b.button_mode);
            setCurrentMode(b.button_mode);
        }}>
        <img src={`./public/icons/${b.icon_link}`} /> {/* todo in config public folder as default */}
      </button>)) }
    </div>
}
