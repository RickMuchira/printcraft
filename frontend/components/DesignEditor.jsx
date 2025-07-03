// components/DesignEditor.jsx
import React, { useState, useRef, useEffect } from 'react';
import { fabric } from 'fabric';

const DesignEditor = ({ product, onDesignChange }) => {
  const canvasRef = useRef(null);
  const [canvas, setCanvas] = useState(null);
  const [selectedTool, setSelectedTool] = useState('select');
  const [uploadedImages, setUploadedImages] = useState([]);

  useEffect(() => {
    // Initialize Fabric.js canvas
    const fabricCanvas = new fabric.Canvas(canvasRef.current, {
      width: 400,
      height: 400,
      backgroundColor: '#ffffff'
    });

    // Add product mockup as background
    if (product.mockupImage) {
      fabric.Image.fromURL(product.mockupImage, (img) => {
        img.set({
          left: 0,
          top: 0,
          scaleX: 0.5,
          scaleY: 0.5,
          selectable: false,
          evented: false
        });
        fabricCanvas.setBackgroundImage(img, fabricCanvas.renderAll.bind(fabricCanvas));
      });
    }

    // Add print area boundaries
    if (product.printAreas) {
      product.printAreas.forEach(area => {
        const rect = new fabric.Rect({
          left: area.x,
          top: area.y,
          width: area.width,
          height: area.height,
          fill: 'transparent',
          stroke: '#00ff00',
          strokeWidth: 2,
          strokeDashArray: [5, 5],
          selectable: false,
          evented: false
        });
        fabricCanvas.add(rect);
      });
    }

    setCanvas(fabricCanvas);

    return () => {
      fabricCanvas.dispose();
    };
  }, [product]);

  const addText = () => {
    if (!canvas) return;
    
    const text = new fabric.IText('Edit this text', {
      left: 100,
      top: 100,
      fontFamily: 'Arial',
      fontSize: 20,
      fill: '#000000'
    });
    canvas.add(text);
    canvas.setActiveObject(text);
    onDesignChange(canvas.toJSON());
  };

  const addImage = (file) => {
    if (!canvas) return;
    
    const reader = new FileReader();
    reader.onload = (e) => {
      fabric.Image.fromURL(e.target.result, (img) => {
        img.set({
          left: 100,
          top: 100,
          scaleX: 0.5,
          scaleY: 0.5
        });
        canvas.add(img);
        canvas.setActiveObject(img);
        onDesignChange(canvas.toJSON());
      });
    };
    reader.readAsDataURL(file);
  };

  const deleteSelected = () => {
    if (!canvas) return;
    
    const activeObject = canvas.getActiveObject();
    if (activeObject) {
      canvas.remove(activeObject);
      onDesignChange(canvas.toJSON());
    }
  };

  const exportDesign = () => {
    if (!canvas) return null;
    
    return {
      json: canvas.toJSON(),
      dataURL: canvas.toDataURL('image/png'),
      svg: canvas.toSVG()
    };
  };

  return (
    <div className="design-editor">
      <div className="toolbar mb-4 flex space-x-4">
        <button
          className={`px-4 py-2 rounded ${selectedTool === 'select' ? 'bg-blue-500 text-white' : 'bg-gray-200'}`}
          onClick={() => setSelectedTool('select')}
        >
          Select
        </button>
        <button
          className="px-4 py-2 bg-green-500 text-white rounded"
          onClick={addText}
        >
          Add Text
        </button>
        <label className="px-4 py-2 bg-purple-500 text-white rounded cursor-pointer">
          Upload Image
          <input
            type="file"
            accept="image/*"
            className="hidden"
            onChange={(e) => e.target.files[0] && addImage(e.target.files[0])}
          />
        </label>
        <button
          className="px-4 py-2 bg-red-500 text-white rounded"
          onClick={deleteSelected}
        >
          Delete
        </button>
      </div>
      
      <div className="canvas-container">
        <canvas ref={canvasRef} className="border border-gray-300"></canvas>
      </div>
      
      <div className="design-tools mt-4">
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium mb-2">Colors</label>
            <div className="flex space-x-2">
              {['#000000', '#ff0000', '#00ff00', '#0000ff', '#ffff00', '#ff00ff'].map(color => (
                <button
                  key={color}
                  className="w-8 h-8 rounded"
                  style={{ backgroundColor: color }}
                  onClick={() => {
                    const activeObject = canvas?.getActiveObject();
                    if (activeObject) {
                      activeObject.set('fill', color);
                      canvas.renderAll();
                      onDesignChange(canvas.toJSON());
                    }
                  }}
                />
              ))}
            </div>
          </div>
          
          <div>
            <label className="block text-sm font-medium mb-2">Fonts</label>
            <select
              className="w-full px-3 py-2 border rounded"
              onChange={(e) => {
                const activeObject = canvas?.getActiveObject();
                if (activeObject && activeObject.type === 'i-text') {
                  activeObject.set('fontFamily', e.target.value);
                  canvas.renderAll();
                  onDesignChange(canvas.toJSON());
                }
              }}
            >
              <option value="Arial">Arial</option>
              <option value="Times New Roman">Times New Roman</option>
              <option value="Helvetica">Helvetica</option>
              <option value="Georgia">Georgia</option>
            </select>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DesignEditor;