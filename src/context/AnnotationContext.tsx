'use client';

import React, { createContext, useContext, useState } from 'react';
import { toast } from 'react-toastify';

export interface BackendAnnotation {
  id?: number;
  image: number;
  label_class: string;
  points: [number, number][];
}

export interface BackendImage {
  id: number;
  series: number;
  image_file: string;
  order: number;
  annotations: BackendAnnotation[];
}

interface ViewportState {
  images: BackendImage[];
  sliceIndex: number;
  zoom: number;
  selectedClass: string;
  hideAnnotations: boolean;
  selectedAnnotationId: number | string | null;
  loading: boolean;
}

interface AnnotationContextType {
  axial: ViewportState;
  sagittal: ViewportState;
  availableClasses: string[];
  updateViewport: (view: 'axial' | 'sagittal', fields: Partial<ViewportState>) => void;
  fetchSeriesDataByClass: (view: 'axial' | 'sagittal', className: string) => Promise<void>;
  saveSliceAnnotations: (view: 'axial' | 'sagittal', imageId: number, annotations: any[]) => Promise<void>;
  fetchBackendClasses: () => Promise<string[]>;
}

const DEFAULT_FALLBACK_CLASSES = ['Tumor', 'Cyst', 'Lesion']; // When Database empty 

const defaultState = (initialClass: string = 'Tumor'): ViewportState => ({
  images: [],
  sliceIndex: 1,
  zoom: 1,
  selectedClass: initialClass,
  hideAnnotations: false,
  selectedAnnotationId: null,
  loading: true,
});

const AnnotationContext = createContext<AnnotationContextType | undefined>(undefined);

export function AnnotationProvider({ children }: { children: React.ReactNode }) {
  const [axial, setAxial] = useState<ViewportState>(defaultState());
  const [sagittal, setSagittal] = useState<ViewportState>(defaultState());
  const [availableClasses, setAvailableClasses] = useState<string[]>(DEFAULT_FALLBACK_CLASSES);

  const updateViewport = (view: 'axial' | 'sagittal', fields: Partial<ViewportState>) => {
    if (view === 'axial') {
      setAxial((prev) => ({ ...prev, ...fields }));
    } else {
      setSagittal((prev) => ({ ...prev, ...fields }));
    }
  };

  const fetchBackendClasses = async (): Promise<string[]> => {
    try {
      const res = await fetch(`http://127.0.0.1:8000/api/label-classes/`);
      
      if (!res.ok) {
        throw new Error("Unauthorized or server error");
      }
      
      const data = await res.json();
      const classesList = Array.isArray(data) ? data : (data.results || []);
      const names: string[] = classesList.map((c: any) => c.name);
      
      if (names.length > 0) {
        setAvailableClasses(names);
        return names;
      } else {
        setAvailableClasses(DEFAULT_FALLBACK_CLASSES);
        return DEFAULT_FALLBACK_CLASSES;
      }
    } catch (error) {
      console.error("Error fetching classes from backend, using default fallback classes:", error);
      toast.warn("Backend disconnected! Loaded fallback template classes.");
      setAvailableClasses(DEFAULT_FALLBACK_CLASSES);
      return DEFAULT_FALLBACK_CLASSES;
    }
  };

  const fetchSeriesDataByClass = async (view: 'axial' | 'sagittal', className: string) => {
    updateViewport(view, { loading: true, selectedClass: className });
    try {
      const res = await fetch(`http://127.0.0.1:8000/api/series/?view_type=${view}&class_name=${encodeURIComponent(className)}`);
      
      if (!res.ok) {
        updateViewport(view, { images: [], sliceIndex: 1, loading: false });
        return;
      }

      const data = await res.json();
      const seriesList = Array.isArray(data) ? data : (data.results || []);
      const targetSeries = seriesList[0];
      
      if (targetSeries && targetSeries.images) {
        updateViewport(view, { 
          images: targetSeries.images, 
          sliceIndex: 1, 
          loading: false,
          selectedAnnotationId: null
        });
      } else {
        updateViewport(view, { images: [], sliceIndex: 1, loading: false, selectedAnnotationId: null });
      }
    } catch (error) {
      console.error(`Error filtering series data for ${view} - ${className}:`, error);
      updateViewport(view, { images: [], sliceIndex: 1, loading: false });
    }
  };

  const saveSliceAnnotations = async (view: 'axial' | 'sagittal', imageId: number, annotations: any[]) => {
    const current = view === 'axial' ? axial : sagittal;
    try {
      const res = await fetch(`http://127.0.0.1:8000/api/annotations/bulk-save/`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          image_id: imageId,
          annotations: annotations.map(ann => ({
            label_class: current.selectedClass,
            points: ann.points
          }))
        })
      });
      const savedData = await res.json();
      
      const updatedImages = current.images.map(img => {
        if (img.id === imageId) return { ...img, annotations: savedData };
        return img;
      });
      
      updateViewport(view, { images: updatedImages });
      toast.success("Annotations saved successfully to database!");
    } catch (error) {
      console.error("Failed to save annotations to backend:", error);
      toast.error("Failed to sync annotations with database.");
    }
  };

  return (
    <AnnotationContext.Provider value={{ axial, sagittal, availableClasses, updateViewport, fetchSeriesDataByClass, saveSliceAnnotations, fetchBackendClasses }}>
      {children}
    </AnnotationContext.Provider>
  );
}

export function useAnnotation() {
  const context = useContext(AnnotationContext);
  if (!context) throw new Error('useAnnotation must be used within an AnnotationProvider');
  return context;
}