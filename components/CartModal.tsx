
import React, { useState } from 'react';
import { CartItem, PaymentDetails, GiftOptions } from '../lib/types';

interface CartModalProps {
  isOpen: boolean;
  onClose: () => void;
  cartItems: CartItem[];
  onRemoveItem: (cartId: string) => void;
  paymentDetails: PaymentDetails;
  onClearCart: () => void;
  notify: (message: string, type: 'success' | 'error' | 'info') => void;
}

type CheckoutStep = 'CART' | 'GIFT' | 'PAYMENT';

export const CartModal: React.FC<CartModalProps> = ({
  isOpen,
  onClose,
  cartItems,
  onRemoveItem,
  paymentDetails,
  onClearCart,
  notify
}) => {
  const [step, setStep] = useState<CheckoutStep>('CART');
  const [giftOptions, setGiftOptions] = useState<GiftOptions>({
    isGift: false,
    recipientName: '',
    senderName: '',
    message: ''
  });

  if (!isOpen) return null;

  const total = cartItems.reduce((sum, item) => sum + item.price, 0);

  const resetAndClose = () => {
    setStep('CART');
    setGiftOptions({ isGift: false, recipientName: '', senderName: '', message: '' });
    onClose();
  };

  const handleFinish = () => {
    onClearCart();

    let successMsg = 'Order placed successfully! 🤎';
    if (giftOptions.isGift) {
      successMsg = 'Order & Gift Note placed successfully! 🎁';
    }
    notify(successMsg, 'success');
    resetAndClose();
  };

  const renderCartStep = () => (
    <>
      <div className="flex justify-between items-center mb-5 border-b border-fifi-100 pb-3">
        <h3 className="text-2xl font-serif font-bold text-gray-900">Your Shopping Bag</h3>
        <button onClick={resetAndClose} className="text-gray-400 hover:text-gray-600">
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path></svg>
        </button>
      </div>

      {cartItems.length === 0 ? (
        <div className="text-center py-10">
          <p className="text-gray-500">Your bag is empty! 🛍️</p>
        </div>
      ) : (
        <div className="space-y-4 max-h-80 overflow-y-auto pr-2">
          {cartItems.map((item) => (
            <div key={item.cartId} className="flex items-center justify-between bg-fifi-50 p-3 rounded-lg">
              <div className="flex items-center space-x-3">
                <img src={item.image} alt={item.name} className="h-12 w-12 rounded object-cover" />
                <div>
                  <h4 className="font-medium text-gray-900">{item.name}</h4>
                  <p className="text-sm text-gray-500">${item.price}</p>
                </div>
              </div>
              <button
                onClick={() => onRemoveItem(item.cartId)}
                className="text-red-400 hover:text-red-600 p-1"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"></path></svg>
              </button>
            </div>
          ))}
        </div>
      )}

      <div className="mt-6 border-t border-gray-100 pt-4">
        <div className="flex justify-between items-center mb-4">
          <span className="text-lg font-medium text-gray-900">Total</span>
          <span className="text-2xl font-bold text-fifi-600">${total}</span>
        </div>
        <button
          onClick={() => setStep('GIFT')}
          disabled={cartItems.length === 0}
          className="w-full flex justify-center py-3 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-fifi-600 hover:bg-fifi-700 focus:outline-none disabled:opacity-50 disabled:cursor-not-allowed"
        >
          Proceed to Checkout
        </button>
      </div>
    </>
  );

  const renderGiftStep = () => (
    <>
      <div className="flex justify-between items-center mb-5 border-b border-fifi-100 pb-3">
        <h3 className="text-2xl font-serif font-bold text-gray-900">Is this a gift? 🎁</h3>
        <button onClick={resetAndClose} className="text-gray-400 hover:text-gray-600">
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path></svg>
        </button>
      </div>

      <div className="space-y-6">
        <div className="flex space-x-4 justify-center">
          <button
            onClick={() => setGiftOptions({ ...giftOptions, isGift: false })}
            className={`flex-1 py-3 px-4 rounded-xl border-2 font-medium transition-all ${!giftOptions.isGift
                ? 'border-fifi-600 bg-fifi-50 text-fifi-800'
                : 'border-gray-200 text-gray-500 hover:border-fifi-300'
              }`}
          >
            No, it's for me
          </button>
          <button
            onClick={() => setGiftOptions({ ...giftOptions, isGift: true })}
            className={`flex-1 py-3 px-4 rounded-xl border-2 font-medium transition-all ${giftOptions.isGift
                ? 'border-fifi-600 bg-fifi-50 text-fifi-800'
                : 'border-gray-200 text-gray-500 hover:border-fifi-300'
              }`}
          >
            Yes, add a note!
          </button>
        </div>

        {giftOptions.isGift && (
          <div className="bg-fifi-50 p-6 rounded-lg border border-fifi-200 shadow-inner">
            <p className="text-sm text-fifi-600 mb-4 italic">
              "I will personally handwrite this note on a beautiful card for you." - Fifi
            </p>

            <div className="space-y-3">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-gray-500 uppercase tracking-wide mb-1">From</label>
                  <input
                    type="text"
                    placeholder="Your Name"
                    value={giftOptions.senderName}
                    onChange={(e) => setGiftOptions({ ...giftOptions, senderName: e.target.value })}
                    className="w-full bg-white border border-fifi-200 rounded p-2 text-sm focus:outline-none focus:border-fifi-500"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-gray-500 uppercase tracking-wide mb-1">To</label>
                  <input
                    type="text"
                    placeholder="Recipient"
                    value={giftOptions.recipientName}
                    onChange={(e) => setGiftOptions({ ...giftOptions, recipientName: e.target.value })}
                    className="w-full bg-white border border-fifi-200 rounded p-2 text-sm focus:outline-none focus:border-fifi-500"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-500 uppercase tracking-wide mb-1">Message</label>
                <textarea
                  rows={4}
                  placeholder="Write your heartfelt message here..."
                  value={giftOptions.message}
                  onChange={(e) => setGiftOptions({ ...giftOptions, message: e.target.value })}
                  className="w-full bg-white border border-fifi-200 rounded p-3 text-sm font-serif text-gray-800 focus:outline-none focus:border-fifi-500"
                  style={{ backgroundImage: 'linear-gradient(#fff 95%, #f0f0f0 100%)', backgroundSize: '100% 2rem', lineHeight: '2rem' }}
                />
              </div>
            </div>
          </div>
        )}

        <div className="flex space-x-3 pt-4 border-t border-gray-100">
          <button
            onClick={() => setStep('CART')}
            className="flex-1 py-3 px-4 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none"
          >
            Back to Cart
          </button>
          <button
            onClick={() => setStep('PAYMENT')}
            disabled={giftOptions.isGift && (!giftOptions.message || !giftOptions.recipientName)}
            className="flex-1 py-3 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-fifi-600 hover:bg-fifi-700 focus:outline-none disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Continue to Payment
          </button>
        </div>
      </div>
    </>
  );

  const renderPaymentStep = () => (
    <>
      <div className="flex justify-between items-center mb-5 border-b border-fifi-100 pb-3">
        <h3 className="text-2xl font-serif font-bold text-gray-900">Payment Details</h3>
        <button onClick={resetAndClose} className="text-gray-400 hover:text-gray-600">
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path></svg>
        </button>
      </div>

      <div className="space-y-6">
        <div className="bg-yellow-50 border border-yellow-200 p-4 rounded-lg">
          <h4 className="font-bold text-yellow-800 mb-2">Instructions</h4>
          <p className="text-sm text-yellow-700">
            To complete your order, please transfer the total amount to the account below. Your order will be shipped once payment is confirmed.
          </p>
        </div>

        <div className="bg-fifi-50 p-5 rounded-xl border border-fifi-100 relative overflow-hidden">
          {giftOptions.isGift && (
            <div className="absolute top-0 right-0 bg-fifi-500 text-white text-xs px-3 py-1 rounded-bl-lg font-bold shadow-sm">
              GIFT NOTE ADDED 🎁
            </div>
          )}
          <div className="space-y-3">
            <div className="flex justify-between">
              <span className="text-gray-500">Bank:</span>
              <span className="font-bold text-gray-900">{paymentDetails.bankName}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-500">Account Name:</span>
              <span className="font-bold text-gray-900">{paymentDetails.accountName}</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-gray-500">Account No:</span>
              <span className="font-mono font-bold text-xl text-fifi-700">{paymentDetails.accountNumber}</span>
            </div>
            <div className="flex justify-between items-center border-t border-fifi-200 pt-2 mt-2">
              <span className="text-gray-500 font-medium">Total Amount:</span>
              <span className="font-bold text-xl text-fifi-800">${total}</span>
            </div>
          </div>
        </div>

        <div className="flex space-x-3 pt-4 border-t border-gray-100">
          <button
            onClick={() => setStep('GIFT')}
            className="flex-1 py-3 px-4 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none"
          >
            Back
          </button>
          <button
            onClick={handleFinish}
            className="flex-1 py-3 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-green-600 hover:bg-green-700 focus:outline-none"
          >
            I Have Paid
          </button>
        </div>
      </div>
    </>
  );

  return (
    <div className="fixed z-[100] inset-0 overflow-y-auto" aria-labelledby="modal-title" role="dialog" aria-modal="true">
      <div className="flex items-end justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">

        <div
          className="fixed inset-0 bg-fifi-900 bg-opacity-25 transition-opacity backdrop-blur-sm"
          aria-hidden="true"
          onClick={resetAndClose}
        ></div>

        <span className="hidden sm:inline-block sm:align-middle sm:h-screen" aria-hidden="true">&#8203;</span>

        <div className="inline-block align-bottom bg-white rounded-2xl text-left overflow-hidden shadow-2xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg sm:w-full">
          <div className="bg-white px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
            {step === 'CART' && renderCartStep()}
            {step === 'GIFT' && renderGiftStep()}
            {step === 'PAYMENT' && renderPaymentStep()}
          </div>
        </div>
      </div>
    </div>
  );
};
