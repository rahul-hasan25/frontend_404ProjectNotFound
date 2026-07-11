'use client';

import React from 'react';
import { AnnotationProvider } from '../../context/AnnotationContext';
import AnnotationPanel from '../../components/AnnotationPanel';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

export default function AnnotatePage() {
  return (
    <AnnotationProvider>
      <div className="w-full h-screen md:max-h-screen bg-white p-2 font-sans antialiased text-slate-900 overflow-y-auto md:overflow-hidden flex flex-col justify-center">
        <main className="max-w-262.5 w-full mx-auto grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-10 items-center h-full max-h-[96vh] py-1">
          <div className="h-full py-1">
            <AnnotationPanel viewType="axial" title="Axial View" />
          </div>
          
          <div className="h-full py-1">
            <AnnotationPanel viewType="sagittal" title="Sagittal View" />
          </div>
          
        </main>
      </div>

      <ToastContainer position="top-right" autoClose={3000} hideProgressBar={false} newestOnTop={false} closeOnClick rtl={false} pauseOnFocusLoss draggable pauseOnHover theme="colored"/>
    </AnnotationProvider>
  );
}