
import React from 'react';
import { Product } from '@/lib/types';

interface ProductCardProps {
  product: Product;
  onViewDetails: (product: Product) => void;
  onAddToCart: (product: Product) => void;
  notify?: (message: string, type: 'success' | 'error' | 'info') => void;
}

export const ProductCard: React.FC<ProductCardProps> = ({ product, onViewDetails, onAddToCart, notify }) => {
  return (
    <div className={`group relative bg-white rounded-xl shadow-sm hover:shadow-xl transition-all duration-300 border border-fifi-100 overflow-hidden flex flex-col ${product.soldOut ? 'opacity-80' : ''}`}>
      <div className="aspect-w-1 aspect-h-1 w-full overflow-hidden bg-gray-200 lg:aspect-none lg:h-80 relative">
        <img
          src={product.image}
          alt={product.name}
          className={`h-full w-full object-cover object-center lg:h-full lg:w-full transform group-hover:scale-105 transition-transform duration-500 ease-in-out ${product.soldOut ? 'grayscale' : ''}`}
        />
        {product.isNew && !product.soldOut && (
          <span className="absolute top-2 left-2 bg-fifi-500 text-white text-xs font-bold px-2 py-1 rounded-full shadow-md">
            NEW IN
          </span>
        )}
        {product.soldOut && (
          <div className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-40">
            <span className="bg-white text-gray-900 px-4 py-2 font-bold tracking-widest border-2 border-gray-900 transform -rotate-12">
              SOLD OUT
            </span>
          </div>
        )}
        <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-10 transition-opacity" />
      </div>

      <div className="mt-4 flex justify-between px-4 pb-2">
        <div>
          <h3 className="text-lg font-medium text-gray-900">
            <span aria-hidden="true" className="absolute inset-0 z-10 cursor-pointer" onClick={() => onViewDetails(product)} />
            {product.name}
          </h3>
          <p className="mt-1 text-sm text-gray-500">{product.category}</p>
        </div>
        <p className="text-lg font-bold text-fifi-600">${product.price}</p>
      </div>

      <div className="mt-auto px-4 pb-4 pt-2 z-20">
        <button
          disabled={product.soldOut}
          onClick={(e) => {
            e.stopPropagation();
            if (!product.soldOut) {
              onAddToCart(product);
              // notify is called in App.tsx, but having it here allows local handling if needed later
            }
          }}
          className={`w-full font-medium py-2 rounded-lg transition-colors border ${product.soldOut
              ? 'bg-gray-100 text-gray-400 border-gray-200 cursor-not-allowed'
              : 'bg-white text-fifi-600 border-fifi-200 hover:bg-fifi-50 hover:border-fifi-300'
            }`}
        >
          {product.soldOut ? 'Out of Stock' : 'Add to Cart'}
        </button>
      </div>
    </div>
  );
};
