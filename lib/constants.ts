

import { Product } from './types';

export const PRODUCTS: Product[] = [
  {
    id: '1',
    name: 'The Latte Canvas Tote',
    price: 85,
    description: 'A spacious everyday tote made from durable beige canvas with rich espresso leather handles. Perfect for the market or the weekend getaway.',
    image: 'https://images.unsplash.com/photo-1591561954557-26941169b49e?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80',
    category: 'Unisex',
    isNew: true,
    soldOut: false,
  },
  {
    id: '2',
    name: 'Chestnut Crossbody',
    price: 65,
    description: 'Compact yet roomy enough for essentials. Crafted from soft vegan leather in a warm chestnut shade with brass hardware.',
    image: 'https://images.unsplash.com/photo-1548036328-c9fa89d128fa?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80',
    category: 'Women',
    soldOut: false,
  },
  {
    id: '3',
    name: 'Espresso Evening Clutch',
    price: 120,
    description: 'A bold statement piece. Deep dark brown velvet finish with a gold geometric clasp. Elegant and timeless.',
    image: 'https://images.unsplash.com/photo-1566150905458-1bf1fc113f0d?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80',
    category: 'Women',
    soldOut: false,
  },
  {
    id: '4',
    name: 'Sandstone Backpack',
    price: 95,
    description: 'Hands-free convenience meets rustic style. Durable canvas in a soft sand color with adjustable leather straps.',
    image: 'https://images.unsplash.com/photo-1553062407-98eeb64c6a62?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80',
    category: 'Men',
    isNew: true,
    soldOut: false,
  },
  {
    id: '5',
    name: 'Signature Caramel Mini',
    price: 55,
    description: 'Our best-seller. A tiny bag for big personalities. Comes in our signature rich caramel hue.',
    image: 'https://images.unsplash.com/photo-1594223274512-ad4803739b7c?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80',
    category: 'Women',
    soldOut: false,
  },
  {
    id: '6',
    name: 'Rustic Sienna Bucket',
    price: 78,
    description: 'Slouchy, comfortable, and chic. Made from reclaimed leather with a natural sienna dye finish.',
    image: 'https://images.unsplash.com/photo-1590874103328-eac38a683ce7?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80',
    category: 'Unisex',
    soldOut: true,
  },
];

export const DEFAULT_PAYMENT: any = {
  bankName: 'Earth Trust Bank',
  accountName: 'Fifi Bags Official',
  accountNumber: '123-456-7890',
  instructions: 'Please include your name in the transfer description.'
};