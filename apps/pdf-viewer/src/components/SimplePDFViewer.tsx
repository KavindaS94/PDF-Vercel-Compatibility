'use client';

import { useState, useEffect } from 'react';
import { ChevronLeft, ChevronRight, Download, ZoomIn, ZoomOut, RotateCw, FileText } from 'lucide-react';

interface SimplePDFViewerProps {
  file: File | string;
  onDownload?: () => void;
}

export default function SimplePDFViewer({ file, onDownload }: SimplePDFViewerProps) {
  const [scale, setScale] = useState<number>(1.0);
  const [rotation, setRotation] = useState<number>(0);
  const [fileUrl, setFileUrl] = useState<string>('');
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const url = typeof file === 'string' ? file : URL.createObjectURL(file);
    setFileUrl(url);
    
    return () => {
      if (typeof file !== 'string') {
        URL.revokeObjectURL(url);
      }
    };
  }, [file]);

  const zoomIn = () => {
    setScale(prev => Math.min(prev + 0.2, 3.0));
  };

  const zoomOut = () => {
    setScale(prev => Math.max(prev - 0.2, 0.5));
  };

  const rotate = () => {
    setRotation(prev => (prev + 90) % 360);
  };

  const resetView = () => {
    setScale(1.0);
    setRotation(0);
  };

  return (
    <div className="bg-white rounded-lg shadow-lg overflow-hidden">
      {/* Controls */}
      <div className="bg-gray-50 px-4 py-3 border-b flex items-center justify-between flex-wrap gap-2">
        <div className="flex items-center space-x-2">
          <span className="text-sm font-medium text-gray-600">
            PDF Viewer
          </span>
        </div>

        <div className="flex items-center space-x-2">
          <button
            onClick={zoomOut}
            className="p-2 rounded-md hover:bg-gray-200"
            title="Zoom Out"
          >
            <ZoomOut className="h-5 w-5" />
          </button>
          
          <span className="text-sm font-medium min-w-[60px] text-center">
            {Math.round(scale * 100)}%
          </span>
          
          <button
            onClick={zoomIn}
            className="p-2 rounded-md hover:bg-gray-200"
            title="Zoom In"
          >
            <ZoomIn className="h-5 w-5" />
          </button>
          
          <button
            onClick={rotate}
            className="p-2 rounded-md hover:bg-gray-200"
            title="Rotate"
          >
            <RotateCw className="h-5 w-5" />
          </button>
          
          <button
            onClick={resetView}
            className="px-3 py-1 text-sm bg-gray-200 hover:bg-gray-300 rounded-md"
          >
            Reset
          </button>
        </div>

        {onDownload && (
          <button
            onClick={onDownload}
            className="flex items-center space-x-2 px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
          >
            <Download className="h-4 w-4" />
            <span>Download</span>
          </button>
        )}
      </div>

      {/* PDF Content */}
      <div className="p-4 bg-gray-100 overflow-auto max-h-[800px]">
        <div className="flex justify-center">
          {fileUrl ? (
            <div 
              className="shadow-lg"
              style={{
                transform: `rotate(${rotation}deg)`,
                transformOrigin: 'center',
              }}
            >
              <iframe
                src={fileUrl}
                className="border-0"
                style={{
                  width: `${100 * scale}%`,
                  height: '600px',
                }}
                title="PDF Viewer"
                onError={() => setError('Failed to load PDF')}
              />
            </div>
          ) : (
            <div className="flex items-center justify-center h-64">
              <div className="text-center">
                <FileText className="h-16 w-16 text-gray-400 mx-auto mb-4" />
                <p className="text-gray-600">Loading PDF...</p>
              </div>
            </div>
          )}
        </div>
        
        {error && (
          <div className="mt-4 p-4 bg-red-50 border border-red-200 rounded-md">
            <p className="text-red-600 text-sm">{error}</p>
            <p className="text-red-500 text-xs mt-1">
              Try downloading the PDF instead or check if the file is valid.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
