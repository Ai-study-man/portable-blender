"use client";
import { products } from '../../../products';

export default function DebugImages() {
  return (
    <div className="p-8">
      <h1 className="text-2xl font-bold mb-4">图片调试页面</h1>
      <div className="grid gap-4">
        {products.map(product => (
          <div key={product.slug} className="border p-4 rounded">
            <h3 className="font-semibold mb-2">{product.name}</h3>
            <p className="text-sm text-gray-600 mb-2">Slug: {product.slug}</p>
            <p className="text-sm text-gray-600 mb-4">Expected path: /picture/{product.slug}.jpg</p>
            
            {/* Direct image test */}
            <div className="mb-4">
              <p className="text-sm font-medium mb-2">直接 img 标签:</p>
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img 
                src={`/picture/${product.slug}.jpg`} 
                alt={product.name}
                className="w-48 h-32 object-contain border bg-white"
                onLoad={() => console.log(`✓ 加载成功: ${product.slug}`)}
                onError={(e) => {
                  console.log(`✗ 加载失败: ${product.slug}`);
                  const t = e.currentTarget;
                  if (!t.dataset.fallback){
                    t.dataset.fallback='1';
                    t.src='/picture/placeholder-blender.jpg';
                  }
                }}
              />
            </div>

            {/* Direct link test */}
            <div>
              <p className="text-sm font-medium mb-2">直接链接测试:</p>
              <a 
                href={`/picture/${product.slug}.jpg`} 
                target="_blank" 
                className="text-blue-500 underline text-sm"
              >
                打开 /picture/{product.slug}.jpg
              </a>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
