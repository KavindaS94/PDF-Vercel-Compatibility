'use client';

import { useState } from 'react';
import PDFGenerator from '@/components/PDFGenerator';
import PDFViewerWrapper from '@/components/PDFViewerWrapper';
import { FileText, Download } from 'lucide-react';

export default function Home() {
  const [currentPDF, setCurrentPDF] = useState<File | null>(null);
  const [activeTab, setActiveTab] = useState<'generator' | 'viewer'>('generator');

  const handlePDFGenerated = (file: File) => {
    setCurrentPDF(file);
    setActiveTab('viewer');
  };

  const handleDownload = () => {
    if (currentPDF) {
      const url = URL.createObjectURL(currentPDF);
      const a = document.createElement('a');
      a.href = url;
      a.download = currentPDF.name;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center space-x-3">
              <FileText className="h-8 w-8 text-blue-600" />
              <h1 className="text-2xl font-bold text-gray-900">PDF Viewer & Generator</h1>
            </div>
            <div className="flex space-x-4">
              <button
                onClick={() => setActiveTab('generator')}
                className={`px-4 py-2 rounded-md font-medium ${
                  activeTab === 'generator'
                    ? 'bg-blue-600 text-white'
                    : 'text-gray-600 hover:text-gray-900'
                }`}
              >
                Generate PDF
              </button>
              <button
                onClick={() => setActiveTab('viewer')}
                className={`px-4 py-2 rounded-md font-medium ${
                  activeTab === 'viewer'
                    ? 'bg-blue-600 text-white'
                    : 'text-gray-600 hover:text-gray-900'
                }`}
              >
                View PDF
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {activeTab === 'generator' ? (
          <div className="max-w-4xl mx-auto">
            <PDFGenerator onPDFGenerated={handlePDFGenerated} />
          </div>
        ) : (
          <div className="max-w-6xl mx-auto">
            {currentPDF ? (
              <PDFViewerWrapper file={currentPDF} onDownload={handleDownload} />
            ) : (
              <div className="text-center py-12">
                <FileText className="h-16 w-16 text-gray-400 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-gray-900 mb-2">No PDF to view</h3>
                <p className="text-gray-600 mb-6">
                  Generate a PDF first or upload an existing PDF to view it here.
                </p>
                <button
                  onClick={() => setActiveTab('generator')}
                  className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
                >
                  Generate PDF
                </button>
              </div>
            )}
          </div>
        )}
      </main>

      {/* Footer */}
      <footer className="bg-white border-t mt-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="text-center text-gray-600">
            <p>Built with Next.js, Puppeteer, and React-PDF</p>
          </div>
        </div>
      </footer>
    </div>
  );
}