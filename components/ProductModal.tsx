
import React from 'react';
import { Product } from '@/lib/types';

interface ProductModalProps {
    product: Product | null;
    isOpen: boolean;
    onClose: () => void;
    onAddToCart: (product: Product) => void;
}

export const ProductModal: React.FC<ProductModalProps> = ({ product, isOpen, onClose, onAddToCart }) => {
    if (!isOpen || !product) return null;

    return (
        <div className="fixed z-[100] inset-0 overflow-y-auto" aria-labelledby="modal-title" role="dialog" aria-modal="true">
            <div className="flex items-end justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">

                {/* Background overlay */}
                <div
                    className="fixed inset-0 bg-fifi-900 bg-opacity-25 transition-opacity backdrop-blur-sm"
                    aria-hidden="true"
                    onClick={onClose}
                ></div>

                <span className="hidden sm:inline-block sm:align-middle sm:h-screen" aria-hidden="true">&#8203;</span>

                <div className="inline-block align-bottom bg-white rounded-2xl text-left overflow-hidden shadow-2xl transform transition-all sm:my-8 sm:align-middle sm:max-w-3xl sm:w-full">
                    <div className="bg-white px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
                        <div className="sm:flex sm:items-start">
                            <div className="mt-3 text-center sm:mt-0 sm:text-left w-full">
                                <div className="flex flex-col md:flex-row gap-8">
                                    {/* Image Section */}
                                    <div className="w-full md:w-1/2 rounded-lg overflow-hidden relative shadow-md">
                                        <img
                                            src={product.image}
                                            alt={product.name}
                                            className={`w-full h-64 md:h-96 object-cover ${product.soldOut ? 'grayscale' : ''}`}
                                        />
                                        {product.soldOut && (
                                            <div className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-40">
                                                <span className="bg-white text-gray-900 px-4 py-2 font-bold tracking-widest border-2 border-gray-900 transform -rotate-12">
                                                    SOLD OUT
                                                </span>
                                            </div>
                                        )}
                                    </div>

                                    {/* Details Section */}
                                    <div className="w-full md:w-1/2 flex flex-col">
                                        <div className="flex justify-between items-start">
                                            <div>
                                                <h3 className="text-3xl leading-8 font-serif font-bold text-gray-900" id="modal-title">
                                                    {product.name}
                                                </h3>
                                                <p className="text-sm text-fifi-500 uppercase tracking-wide font-semibold mt-1">{product.category}</p>
                                            </div>
                                            <p className="text-3xl font-bold text-fifi-700">${product.price}</p>
                                        </div>

                                        <div className="mt-6">
                                            <h4 className="font-bold text-gray-900 text-sm mb-2">Description</h4>
                                            <p className="text-gray-600 leading-relaxed">
                                                {product.description}
                                            </p>
                                        </div>

                                        <div className="mt-4 bg-fifi-50 p-3 rounded-lg border border-fifi-100">
                                            <div className="flex items-center text-yellow-500 text-sm mb-1">
                                                ★★★★★ <span className="text-gray-400 ml-2">(4.9/5 based on customer love)</span>
                                            </div>
                                            <p className="text-xs text-gray-500 italic">"The craftsmanship is amazing. Smells like real leather and earth!" - Sarah J.</p>
                                        </div>

                                        <div className="mt-auto pt-6 flex flex-col gap-3">
                                            <button
                                                type="button"
                                                disabled={product.soldOut}
                                                className={`w-full inline-flex justify-center items-center rounded-lg border border-transparent shadow-sm px-4 py-4 text-lg font-medium text-white focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-fifi-500 ${product.soldOut
                                                        ? 'bg-gray-400 cursor-not-allowed'
                                                        : 'bg-fifi-600 hover:bg-fifi-700 transform hover:-translate-y-1 transition-all'
                                                    }`}
                                                onClick={() => {
                                                    if (!product.soldOut) {
                                                        onAddToCart(product);
                                                        onClose();
                                                    }
                                                }}
                                            >
                                                {product.soldOut ? 'Out of Stock' : `Add to Bag - $${product.price}`}
                                            </button>
                                            <button
                                                type="button"
                                                className="w-full inline-flex justify-center rounded-lg border border-gray-300 shadow-sm px-4 py-2 bg-white text-base font-medium text-gray-700 hover:bg-gray-50 focus:outline-none"
                                                onClick={onClose}
                                            >
                                                Continue Shopping
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};
