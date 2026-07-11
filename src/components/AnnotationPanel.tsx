'use client';

import React, { useEffect, useRef, useState } from 'react';
import { useAnnotation } from '../context/AnnotationContext';
import { FaArrowLeft, FaArrowRight, FaPen, FaTimes, FaSearch, FaSearchPlus, FaSearchMinus, FaTrash, FaUndo } from 'react-icons/fa';
import { toast } from 'react-toastify';

interface PanelProps {
  viewType: 'axial' | 'sagittal';
  title: string;
}

function isPointInPolygon(point: [number, number], vs: [number, number][]) {
  const x = point[0], y = point[1];
  let inside = false;
  for (let i = 0, j = vs.length - 1; i < vs.length; j = i++) {
    const xi = vs[i][0], yi = vs[i][1];
    const xj = vs[j][0], yj = vs[j][1];
    const intersect = ((yi > y) !== (yj > y)) && (x < (xj - xi) * (y - yi) / (yj - yi) + xi);
    if (intersect) inside = !inside;
  }
  return inside;
}

export default function AnnotationPanel({ viewType, title }: PanelProps) {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const { axial, sagittal, availableClasses, updateViewport, fetchSeriesDataByClass, saveSliceAnnotations, fetchBackendClasses } = useAnnotation();
  const state = viewType === 'axial' ? axial : sagittal;

  const [isDrawMode, setIsDrawMode] = useState<boolean>(false);
  const [currentPath, setCurrentPath] = useState<[number, number][]>([]);
  const [imageObj, setImageObj] = useState<HTMLImageElement | null>(null);

  const totalImages = state.images.length;
  const currentImage = state.images[state.sliceIndex - 1];
  const currentAnnotations = currentImage ? currentImage.annotations.filter(ann => ann.label_class === state.selectedClass) : [];

  useEffect(() => {
    const initLoad = async () => {
      const classes = await fetchBackendClasses();
      if (classes.length > 0) {
        await fetchSeriesDataByClass(viewType, classes[0]);
      }
    };
    initLoad();
  }, []);

  useEffect(() => {
    if (currentImage && currentImage.image_file) {
      const img = new Image();
      img.src = currentImage.image_file;
      img.onload = () => {
        setImageObj(img);
      };
    } else {
      setImageObj(null);
    }
  }, [currentImage]);

  // Mouse Wheel Scroll Nevigation
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const handleWheel = (e: WheelEvent) => {
      e.preventDefault();
      if (totalImages === 0) return;

      if (e.deltaY < 0) {
        updateViewport(viewType, { 
          sliceIndex: Math.min(totalImages, state.sliceIndex + 1), 
          selectedAnnotationId: null 
        });
      } else if (e.deltaY > 0) {
        updateViewport(viewType, { 
          sliceIndex: Math.max(1, state.sliceIndex - 1), 
          selectedAnnotationId: null 
        });
      }
    };

    canvas.addEventListener('wheel', handleWheel, { passive: false });
    return () => canvas.removeEventListener('wheel', handleWheel);
  }, [totalImages, state.sliceIndex]);

  // Canvas Drawing (with zoom fixed)
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Background Black Clear
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.fillStyle = '#000000';
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    ctx.save();

    // Zoom Scrolling from Canvas center point
    ctx.translate(canvas.width / 2, canvas.height / 2);
    ctx.scale(state.zoom, state.zoom);
    ctx.translate(-canvas.width / 2, -canvas.height / 2);

    // Image Draw
    if (imageObj) {
      ctx.drawImage(imageObj, 0, 0, canvas.width, canvas.height);
    }

    // Annotation Draw
    if (!state.hideAnnotations) {
      currentAnnotations.forEach((ann) => {
        if (!ann.points || ann.points.length === 0) return;
        ctx.beginPath();
        ctx.moveTo(ann.points[0][0], ann.points[0][1]);
        ann.points.forEach(([x, y]) => ctx.lineTo(x, y));
        ctx.closePath();
        
        const isSelected = state.selectedAnnotationId === ann.id;
        ctx.fillStyle = isSelected ? 'rgba(34, 197, 94, 0.35)' : 'rgba(220, 38, 38, 0.45)';
        ctx.fill();
        ctx.strokeStyle = isSelected ? '#22c55e' : '#2563eb';
        ctx.lineWidth = isSelected ? 3 / state.zoom : 2 / state.zoom;
        ctx.stroke();

        ann.points.forEach(([x, y]) => {
          ctx.beginPath();
          ctx.arc(x, y, 5 / state.zoom, 0, 2 * Math.PI);
          ctx.fillStyle = isSelected ? '#4ade80' : '#3b82f6';
          ctx.fill();
          ctx.strokeStyle = '#ffffff';
          ctx.lineWidth = 1 / state.zoom;
          ctx.stroke();
        });
      });

      // Current Drawing path Draw
      if (currentPath.length > 0) {
        ctx.beginPath();
        ctx.moveTo(currentPath[0][0], currentPath[0][1]);
        currentPath.forEach(([x, y]) => ctx.lineTo(x, y));
        ctx.strokeStyle = '#2563eb';
        ctx.lineWidth = 2 / state.zoom;
        ctx.stroke();

        currentPath.forEach(([x, y], idx) => {
          ctx.beginPath();
          ctx.arc(x, y, 5 / state.zoom, 0, 2 * Math.PI);
          ctx.fillStyle = idx === 0 ? '#ef4444' : '#3b82f6';
          ctx.fill();
          ctx.strokeStyle = '#ffffff';
          ctx.lineWidth = 1 / state.zoom;
          ctx.stroke();
        });
      }
    }

    ctx.restore();
  }, [state.images, state.sliceIndex, state.zoom, state.selectedClass, state.hideAnnotations, state.selectedAnnotationId, currentPath, imageObj]);

  const handleClassChange = async (newClass: string) => {
    await fetchSeriesDataByClass(viewType, newClass);
  };

  const handleCanvasClick = async (e: React.MouseEvent<HTMLCanvasElement>) => {
    if (!currentImage) return;
    const canvas = canvasRef.current;
    if (!canvas) return;
    const rect = canvas.getBoundingClientRect();
    
    // Normal Screen Ratio Calculation
    const baseClickX = ((e.clientX - rect.left) / rect.width) * canvas.width;
    const baseClickY = ((e.clientY - rect.top) / rect.height) * canvas.height;

    const clickX = (baseClickX - canvas.width / 2) / state.zoom + canvas.width / 2;
    const clickY = (baseClickY - canvas.height / 2) / state.zoom + canvas.height / 2;

    if (isDrawMode) {
      if (currentPath.length >= 3) {
        const [startX, startY] = currentPath[0];
        if (Math.sqrt(Math.pow(clickX - startX, 2) + Math.pow(clickY - startY, 2)) < (15 / state.zoom)) {
          const newAnn = {
            label_class: state.selectedClass,
            points: currentPath
          };
          
          const updatedList = [...currentImage.annotations, newAnn];
          toast.loading("Saving new polygon...", { toastId: "save-poly" });
          await saveSliceAnnotations(viewType, currentImage.id, updatedList);
          toast.dismiss("save-poly");
          
          setCurrentPath([]);
          return;
        }
      }
      setCurrentPath([...currentPath, [clickX, clickY]]);
    } else {
      let clickedOnPolygon = false;
      let foundId: number | string | null = null;
      
      for (let i = currentAnnotations.length - 1; i >= 0; i--) {
        if (isPointInPolygon([clickX, clickY], currentAnnotations[i].points)) {
          foundId = currentAnnotations[i].id || null;
          clickedOnPolygon = true;
          break;
        }
      }

      if (clickedOnPolygon) {
        updateViewport(viewType, { selectedAnnotationId: foundId });
      } else {
        // Left/Right Click Nevigation
        const midPoint = rect.width / 2;
        const relativeClickX = e.clientX - rect.left;

        if (relativeClickX > midPoint) {
          updateViewport(viewType, { 
            sliceIndex: Math.min(totalImages, state.sliceIndex + 1), 
            selectedAnnotationId: null 
          });
        } else {
          updateViewport(viewType, { 
            sliceIndex: Math.max(1, state.sliceIndex - 1), 
            selectedAnnotationId: null 
          });
        }
      }
    }
  };

  const handleDeleteSelected = async () => {
    if (!currentImage || !state.selectedAnnotationId) return;
    const remains = currentImage.annotations.filter(ann => ann.id !== state.selectedAnnotationId);
    
    await saveSliceAnnotations(viewType, currentImage.id, remains);
    toast.success("Selected polygon deleted successfully.");
    updateViewport(viewType, { selectedAnnotationId: null });
  };

  if (state.loading) {
    return <div className="flex items-center justify-center h-full text-gray-500 font-semibold">Backend Loading...</div>;
  }

  return (
    <div className="flex flex-col bg-white select-none h-full justify-between p-0.5">
      <div className="flex items-center justify-between mb-0.5">
        <button onClick={() => updateViewport(viewType, { sliceIndex: Math.max(1, state.sliceIndex - 1), selectedAnnotationId: null })} className="w-8 h-8 bg-[#1a73e8] hover:bg-blue-600 text-white rounded flex items-center justify-center transition-colors cursor-pointer">
          <FaArrowLeft size={11} />
        </button>
        <span className="text-lg font-bold text-gray-800 tracking-wide">
          {title} ({totalImages > 0 ? `${state.sliceIndex}/${totalImages}` : '0/0'})
        </span>
        <button onClick={() => updateViewport(viewType, { sliceIndex: Math.min(totalImages, state.sliceIndex + 1), selectedAnnotationId: null })} className="w-8 h-8 bg-[#1a73e8] hover:bg-blue-600 text-white rounded flex items-center justify-center transition-colors cursor-pointer">
          <FaArrowRight size={11} />
        </button>
      </div>

      <div className="grid grid-cols-2 items-center gap-4 text-[11px] font-semibold text-gray-700 mb-1">
        <div className="flex flex-col relative">
          <span className="text-gray-400 mb-0.5 text-[10px] font-medium">Select Class:</span>
          <select value={state.selectedClass} onChange={(e) => handleClassChange(e.target.value)} className="border border-gray-300 rounded px-1.5 py-0.5 font-bold bg-white text-gray-800 focus:outline-none text-xs cursor-pointer w-full max-w-35">
            {availableClasses.map((className) => (
              <option key={className} value={className}>
                {className}
              </option>
            ))}
          </select>
        </div>

        <label className="flex items-center gap-1.5 cursor-pointer mt-3 justify-end">
          <input type="checkbox" checked={state.hideAnnotations} onChange={(e) => updateViewport(viewType, { hideAnnotations: e.target.checked })} className="rounded border-gray-300 text-[#1a73e8] focus:ring-0 h-4 w-4" />
          <span className="leading-tight text-xs">Hide Annotations</span>
        </label>
      </div>

      <div className="flex-1 flex items-center justify-center bg-black border border-gray-300 rounded overflow-hidden relative max-h-[68vh] aspect-3/4 mx-auto w-full">
        {totalImages > 0 ? (
          <canvas ref={canvasRef} width={360} height={480} onClick={handleCanvasClick} className="w-full h-full block cursor-pointer" />
        ) : (
          <div className="text-gray-400 text-xs">No images uploaded for this class & side.</div>
        )}
      </div>

      <div className="w-full py-1">
        <input type="range" min="1" max={totalImages || 1} value={state.sliceIndex} onChange={(e) => updateViewport(viewType, { sliceIndex: parseInt(e.target.value), selectedAnnotationId: null })} className="w-full h-1 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-[#1a73e8]" />
      </div>

      <div className="grid grid-cols-6 gap-1 w-full">
        <button onClick={() => { setIsDrawMode(!isDrawMode); setCurrentPath([]); }} title={isDrawMode ? "Close Draw" : "Draw Mode"} className={`py-2 text-white rounded flex items-center justify-center cursor-pointer ${isDrawMode ? 'bg-red-600 hover:bg-red-700' : 'bg-[#1a73e8] hover:bg-blue-600'}`}>
          {isDrawMode ? <FaTimes size={11} /> : <FaPen size={11} />}
        </button>
        <button onClick={() => updateViewport(viewType, { zoom: 1 })} title="Reset Zoom" className="py-2 bg-[#1a73e8] text-white rounded hover:bg-blue-600 flex items-center justify-center cursor-pointer"><FaSearch size={11} /></button>
        <button onClick={() => updateViewport(viewType, { zoom: Math.min(state.zoom + 0.2, 4) })} title="Zoom In" className="py-2 bg-[#1a73e8] text-white rounded hover:bg-blue-600 flex items-center justify-center cursor-pointer"><FaSearchPlus size={11} /></button>
        <button onClick={() => updateViewport(viewType, { zoom: Math.max(state.zoom - 0.2, 0.6) })} title="Zoom Out" className="py-2 bg-[#1a73e8] text-white rounded hover:bg-blue-600 flex items-center justify-center cursor-pointer"><FaSearchMinus size={11} /></button>
        
        <button onClick={handleDeleteSelected} disabled={!state.selectedAnnotationId} title="Delete Selected Polygon" className={`py-2 text-white rounded flex items-center justify-center ${state.selectedAnnotationId ? 'bg-[#1a73e8] hover:bg-blue-600 cursor-pointer' : 'bg-gray-300 cursor-not-allowed'}`}>
          <FaTrash size={11} />
        </button>

        <button onClick={() => setCurrentPath(p => p.slice(0, -1))} disabled={currentPath.length === 0} title="Undo Node" className={`py-2 text-white rounded flex items-center justify-center ${currentPath.length > 0 ? 'bg-[#1a73e8] hover:bg-blue-600 cursor-pointer' : 'bg-gray-300 cursor-not-allowed'}`}><FaUndo size={11} /></button>
      </div>

    </div>
  );
}