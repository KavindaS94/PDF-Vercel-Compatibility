'use client';

import { useState, useEffect } from 'react';
import SimplePDFViewer from './SimplePDFViewer';

interface PDFViewerWrapperProps {
  file: File | string;
  onDownload?: () => void;
}

export default function PDFViewerWrapper({ file, onDownload }: PDFViewerWrapperProps) {
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  if (!isMounted) {
    return (
      <div className="flex items-center justify-center h-96 bg-gray-100 rounded-lg">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Initializing...</p>
        </div>
      </div>
    );
  }

  // Use simple viewer to avoid PDF.js issues
  return <SimplePDFViewer file={file} onDownload={onDownload} />;
}
