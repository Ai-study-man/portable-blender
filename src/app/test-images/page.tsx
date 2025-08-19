"use client";

import Image from 'next/image';
import { useState } from 'react';

export default function TestImagesPage() {
  const [loadErrors, setLoadErrors] = useState<string[]>([]);
  const [loadSuccess, setLoadSuccess] = useState<string[]>([]);

  const testImages = [
    'portable-blender-360w.jpg',
    'hamilton-beach-51132.jpg',
    'hamilton-beach-51131.jpg',
    'oster-blend-active.jpg',
    'portable-personal-blender-17oz.jpg',
    'placeholder-blender.jpg',
    'placeholder-blender.svg'
  ];

  const handleImageLoad = (src: string) => {
    setLoadSuccess(prev => [...prev, src]);
    console.log('✅ Image loaded:', src);
  };

  const handleImageError = (src: string) => {
    setLoadErrors(prev => [...prev, src]);
    console.log('❌ Image failed:', src);
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold mb-6">Image Loading Test</h1>
      
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 mb-8">
        {testImages.map((src) => (
          <div key={src} className="border rounded-lg p-4">
            <h3 className="text-sm font-semibold mb-2 truncate">{src}</h3>
            <div className="aspect-square bg-gray-100 rounded flex items-center justify-center overflow-hidden">
              <Image
                src={`/picture/${src}`}
                alt={src}
                width={200}
                height={200}
                className="object-contain w-full h-full"
                onLoad={() => handleImageLoad(src)}
                onError={() => handleImageError(src)}
              />
            </div>
          </div>
        ))}
      </div>

      <div className="grid md:grid-cols-2 gap-6">
        <div>
          <h2 className="text-lg font-semibold text-green-600 mb-2">
            Successfully Loaded ({loadSuccess.length})
          </h2>
          <ul className="list-disc list-inside space-y-1">
            {loadSuccess.map((src) => (
              <li key={src} className="text-sm text-green-700">{src}</li>
            ))}
          </ul>
        </div>

        <div>
          <h2 className="text-lg font-semibold text-red-600 mb-2">
            Failed to Load ({loadErrors.length})
          </h2>
          <ul className="list-disc list-inside space-y-1">
            {loadErrors.map((src) => (
              <li key={src} className="text-sm text-red-700">{src}</li>
            ))}
          </ul>
        </div>
      </div>

      <div className="mt-8">
        <h2 className="text-lg font-semibold mb-4">Direct Access Test</h2>
        <div className="space-y-2">
          {testImages.map((src) => (
            <div key={src} className="flex items-center space-x-2">
              <a 
                href={`/picture/${src}`} 
                target="_blank" 
                className="text-blue-600 hover:underline text-sm"
              >
                /picture/{src}
              </a>
              <span className="text-xs text-gray-500">← Click to test direct access</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
