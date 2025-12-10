
export interface Product {
  id: string;
  name: string;
  price: number;
  description: string;
  image: string;
  category: string;
  isNew?: boolean;
  soldOut?: boolean;
}

export interface CartItem extends Product {
  cartId: string; // Unique ID for the item in the cart
}

export interface ChatMessage {
  id: string;
  role: 'user' | 'model';
  text: string;
  image?: string;
}

export interface PaymentDetails {
  bankName: string;
  accountName: string;
  accountNumber: string;
  instructions: string;
}

export interface GiftOptions {
  isGift: boolean;
  recipientName: string;
  senderName: string;
  message: string;
}

export interface ToastMessage {
  id: string;
  message: string;
  type: 'success' | 'error' | 'info';
}

export enum ViewState {
  HOME = 'HOME',
  SHOP = 'SHOP',
  ABOUT = 'ABOUT',
  ADMIN = 'ADMIN',
}
