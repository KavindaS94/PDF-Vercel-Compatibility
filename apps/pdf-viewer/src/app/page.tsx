'use client';

import { useState } from 'react';
import { FileText, Eye } from 'lucide-react';
import PDFGenerator from '../components/PDFGenerator';
import PDFViewerWrapper from '../components/PDFViewerWrapper';

export default function Page() {
  const [activeTab, setActiveTab] = useState<'generate' | 'view'>('generate');
  const [generatedPDF, setGeneratedPDF] = useState<File | null>(null);

  const handlePDFGenerated = (file: File) => {
    setGeneratedPDF(file);
    setActiveTab('view');
  };

  const handleDownload = () => {
    if (generatedPDF) {
      const url = URL.createObjectURL(generatedPDF);
      const a = document.createElement('a');
      a.href = url;
      a.download = generatedPDF.name;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
    }
  };

  return (
    <div className="min-h-screen bg-gray-100">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-gray-800 mb-2">
            PDF Viewer & Generator
          </h1>
          <p className="text-gray-600">
            Create and view PDFs with custom content, logos, and images
          </p>
        </div>

        {/* Tab Navigation */}
        <div className="flex justify-center mb-8">
          <div className="bg-white rounded-lg shadow-sm p-1">
            <button
              onClick={() => setActiveTab('generate')}
              className={`flex items-center space-x-2 px-6 py-3 rounded-md transition-colors ${
                activeTab === 'generate'
                  ? 'bg-blue-600 text-white'
                  : 'text-gray-600 hover:text-gray-800'
              }`}
            >
              <FileText className="h-5 w-5" />
              <span>Generate PDF</span>
            </button>
            <button
              onClick={() => setActiveTab('view')}
              className={`flex items-center space-x-2 px-6 py-3 rounded-md transition-colors ${
                activeTab === 'view'
                  ? 'bg-blue-600 text-white'
                  : 'text-gray-600 hover:text-gray-800'
              }`}
            >
              <Eye className="h-5 w-5" />
              <span>View PDF</span>
            </button>
          </div>
        </div>

        {/* Tab Content */}
        <div className="max-w-4xl mx-auto">
          {activeTab === 'generate' && (
            <PDFGenerator onPDFGenerated={handlePDFGenerated} />
          )}
          
          {activeTab === 'view' && (
            <div>
              {generatedPDF ? (
                <PDFViewerWrapper 
                  file={generatedPDF} 
                  onDownload={handleDownload}
                />
              ) : (
                <div className="bg-white rounded-lg shadow-lg p-8 text-center">
                  <div className="text-gray-400 mb-4">
                    <FileText className="h-16 w-16 mx-auto" />
                  </div>
                  <h3 className="text-xl font-semibold text-gray-700 mb-2">
                    No PDF Generated Yet
                  </h3>
                  <p className="text-gray-500 mb-4">
                    Generate a PDF first to view it here
                  </p>
                  <button
                    onClick={() => setActiveTab('generate')}
                    className="px-6 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
                  >
                    Go to Generate PDF
                  </button>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}