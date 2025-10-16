'use client';

import { useState } from 'react';
import { Download, Image, Type, Upload, X } from 'lucide-react';

interface PDFGeneratorProps {
  onPDFGenerated: (file: File) => void;
}

export default function PDFGenerator({ onPDFGenerated }: PDFGeneratorProps) {
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [logo, setLogo] = useState<File | null>(null);
  const [images, setImages] = useState<File[]>([]);
  const [logoPreview, setLogoPreview] = useState<string | null>(null);
  const [imagePreviews, setImagePreviews] = useState<string[]>([]);
  const [isGenerating, setIsGenerating] = useState(false);

  const handleLogoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setLogo(file);
      const reader = new FileReader();
      reader.onload = (e) => {
        setLogoPreview(e.target?.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    setImages(prev => [...prev, ...files]);
    
    files.forEach(file => {
      const reader = new FileReader();
      reader.onload = (e) => {
        setImagePreviews(prev => [...prev, e.target?.result as string]);
      };
      reader.readAsDataURL(file);
    });
  };

  const removeImage = (index: number) => {
    setImages(prev => prev.filter((_, i) => i !== index));
    setImagePreviews(prev => prev.filter((_, i) => i !== index));
  };

  const removeLogo = () => {
    setLogo(null);
    setLogoPreview(null);
  };

  const generatePDF = async () => {
    if (!title.trim() && !content.trim()) {
      alert('Please add a title or content to generate PDF');
      return;
    }

    setIsGenerating(true);

    try {
      // Convert files to base64
      let logoBase64 = null;
      if (logo) {
        logoBase64 = await new Promise<string>((resolve) => {
          const reader = new FileReader();
          reader.onload = (e) => resolve(e.target?.result as string);
          reader.readAsDataURL(logo);
        });
      }

      const imageBase64s = await Promise.all(
        images.map(file => 
          new Promise<string>((resolve) => {
            const reader = new FileReader();
            reader.onload = (e) => resolve(e.target?.result as string);
            reader.readAsDataURL(file);
          })
        )
      );

      const response = await fetch('/api/generate-pdf', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          title,
          content,
          logo: logoBase64,
          images: imageBase64s,
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to generate PDF');
      }

      const blob = await response.blob();
      const file = new File([blob], `${title || 'document'}.pdf`, { type: 'application/pdf' });
      
      onPDFGenerated(file);
    } catch (error) {
      console.error('Error generating PDF:', error);
      alert('Failed to generate PDF. Please try again.');
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-lg p-6">
      <h2 className="text-2xl font-bold text-gray-800 mb-6 flex items-center">
        <Type className="h-6 w-6 mr-2 text-blue-600" />
        PDF Generator
      </h2>

      <div className="space-y-6">
        {/* Title Input */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Document Title
          </label>
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="Enter document title..."
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-black placeholder-gray-600"
          />
        </div>

        {/* Content Input */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Content
          </label>
          <textarea
            value={content}
            onChange={(e) => setContent(e.target.value)}
            placeholder="Enter your content here... (supports HTML formatting)"
            rows={8}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-black placeholder-gray-600"
          />
          <p className="text-xs text-gray-800 mt-1">
            You can use HTML tags for formatting (e.g., &lt;h1&gt;, &lt;p&gt;, &lt;strong&gt;, &lt;em&gt;)
          </p>
        </div>

        {/* Logo Upload */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Logo
          </label>
          <div className="flex items-center space-x-4">
            <label className="flex items-center space-x-2 px-4 py-2 bg-gray-100 hover:bg-gray-200 rounded-md cursor-pointer">
              <Upload className="h-4 w-4" />
              <span>Upload Logo</span>
              <input
                type="file"
                accept="image/*"
                onChange={handleLogoUpload}
                className="hidden"
              />
            </label>
            {logoPreview && (
              <div className="flex items-center space-x-2">
                <img src={logoPreview} alt="Logo preview" className="h-12 w-auto" />
                <button
                  onClick={removeLogo}
                  className="p-1 text-red-500 hover:text-red-700"
                >
                  <X className="h-4 w-4" />
                </button>
              </div>
            )}
          </div>
        </div>

        {/* Images Upload */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Images
          </label>
          <div className="space-y-4">
            <label className="flex items-center space-x-2 px-4 py-2 bg-gray-100 hover:bg-gray-200 rounded-md cursor-pointer">
              <Image className="h-4 w-4" />
              <span>Upload Images</span>
              <input
                type="file"
                accept="image/*"
                multiple
                onChange={handleImageUpload}
                className="hidden"
              />
            </label>
            
            {imagePreviews.length > 0 && (
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {imagePreviews.map((preview, index) => (
                  <div key={index} className="relative">
                    <img src={preview} alt={`Preview ${index + 1}`} className="w-full h-24 object-cover rounded-md" />
                    <button
                      onClick={() => removeImage(index)}
                      className="absolute -top-2 -right-2 p-1 bg-red-500 text-white rounded-full hover:bg-red-600"
                    >
                      <X className="h-3 w-3" />
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Generate Button */}
        <div className="pt-4">
          <button
            onClick={generatePDF}
            disabled={isGenerating || (!title.trim() && !content.trim())}
            className="w-full flex items-center justify-center space-x-2 px-6 py-3 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isGenerating ? (
              <>
                <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                <span>Generating PDF...</span>
              </>
            ) : (
              <>
                <Download className="h-5 w-5" />
                <span>Generate & Download PDF</span>
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
}
