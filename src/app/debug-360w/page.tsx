"use client";

import Image from 'next/image';
import { useState } from 'react';

export default function ImageDebugPage() {
  const [errors, setErrors] = useState<string[]>([]);
  const [successes, setSuccesses] = useState<string[]>([]);

  const testImage = '/picture/portable-blender-360w.jpg';

  const handleImageLoad = () => {
    setSuccesses(prev => [...prev, `✅ Image loaded successfully: ${testImage}`]);
    console.log('✅ Image loaded:', testImage);
  };

  const handleImageError = (e: any) => {
    const errorMsg = `❌ Image failed to load: ${testImage}`;
    setErrors(prev => [...prev, errorMsg]);
    console.error('❌ Image error:', e);
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold mb-6">Portable Blender 360W Image Debug</h1>
      
      <div className="grid md:grid-cols-2 gap-8">
        <div>
          <h2 className="text-lg font-semibold mb-4">Next.js Image Component</h2>
          <div className="border rounded-lg p-4 bg-gradient-to-br from-white via-slate-50 to-slate-100 aspect-[4/3] flex items-center justify-center">
            <Image
              src={testImage}
              alt="Portable Blender 360W"
              width={640}
              height={480}
              className="object-contain w-full h-full rounded-lg transition-transform hover:scale-105"
              priority={true}
              onLoad={handleImageLoad}
              onError={handleImageError}
            />
          </div>
        </div>

        <div>
          <h2 className="text-lg font-semibold mb-4">Regular IMG Element</h2>
          <div className="border rounded-lg p-4 bg-gradient-to-br from-white via-slate-50 to-slate-100 aspect-[4/3] flex items-center justify-center">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={testImage}
              alt="Portable Blender 360W"
              className="object-contain w-full h-full rounded-lg"
              onLoad={() => {
                setSuccesses(prev => [...prev, `✅ Regular img loaded: ${testImage}`]);
                console.log('✅ Regular img loaded:', testImage);
              }}
              onError={(e) => {
                const errorMsg = `❌ Regular img failed: ${testImage}`;
                setErrors(prev => [...prev, errorMsg]);
                console.error('❌ Regular img error:', e);
              }}
            />
          </div>
        </div>
      </div>

      <div className="mt-8 grid md:grid-cols-2 gap-6">
        <div>
          <h3 className="text-lg font-semibold text-green-600 mb-2">
            Successes ({successes.length})
          </h3>
          <ul className="list-disc list-inside space-y-1 bg-green-50 p-4 rounded">
            {successes.map((msg, i) => (
              <li key={i} className="text-sm text-green-700">{msg}</li>
            ))}
          </ul>
        </div>

        <div>
          <h3 className="text-lg font-semibold text-red-600 mb-2">
            Errors ({errors.length})
          </h3>
          <ul className="list-disc list-inside space-y-1 bg-red-50 p-4 rounded">
            {errors.map((msg, i) => (
              <li key={i} className="text-sm text-red-700">{msg}</li>
            ))}
          </ul>
        </div>
      </div>

      <div className="mt-8">
        <h3 className="text-lg font-semibold mb-4">Direct Link Test</h3>
        <div className="flex flex-col space-y-2">
          <a 
            href={testImage} 
            target="_blank" 
            className="text-blue-600 hover:underline"
          >
            {testImage} ← Click to open directly
          </a>
          <a 
            href="/products/portable-blender-360w" 
            className="text-purple-600 hover:underline"
          >
            /products/portable-blender-360w ← Back to product page
          </a>
        </div>
      </div>

      <div className="mt-8">
        <h3 className="text-lg font-semibold mb-4">Debug Info</h3>
        <div className="bg-slate-100 p-4 rounded text-sm font-mono">
          <p>Image Path: {testImage}</p>
          <p>Window Location: {typeof window !== 'undefined' ? window.location.href : 'SSR'}</p>
          <p>Timestamp: {new Date().toISOString()}</p>
        </div>
      </div>
    </div>
  );
}
