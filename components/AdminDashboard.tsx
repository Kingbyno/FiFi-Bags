
import React, { useState, useRef } from 'react';
import { Product, PaymentDetails } from '@/lib/types';

interface AdminDashboardProps {
  products: Product[];
  onAddProduct: (product: Product) => void;
  onUpdateProduct: (product: Product) => void;
  onDeleteProduct: (id: string) => void;
  categories: string[];
  onAddCategory: (category: string) => void;
  onDeleteCategory: (category: string) => void;
  paymentDetails: PaymentDetails;
  onUpdatePayment: (details: PaymentDetails) => void;
  onExit: () => void;
  notify: (message: string, type: 'success' | 'error' | 'info') => void;
}

export const AdminDashboard: React.FC<AdminDashboardProps> = ({
  products,
  onAddProduct,
  onUpdateProduct,
  onDeleteProduct,
  categories,
  onAddCategory,
  onDeleteCategory,
  paymentDetails,
  onUpdatePayment,
  onExit,
  notify
}) => {
  const [activeTab, setActiveTab] = useState<'products' | 'categories' | 'settings'>('products');
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [isFormOpen, setIsFormOpen] = useState(false);
  
  // Payment Form State
  const [tempPayment, setTempPayment] = useState<PaymentDetails>(paymentDetails);

  // Category Form State
  const [newCategory, setNewCategory] = useState('');

  // Product Form State
  const emptyProduct: Product = {
    id: '',
    name: '',
    price: 0,
    description: '',
    image: '',
    category: categories[0] || 'Women',
    soldOut: false,
    isNew: false
  };
  const [formData, setFormData] = useState<Product>(emptyProduct);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleEditClick = (product: Product) => {
    setEditingProduct(product);
    setFormData(product);
    setIsFormOpen(true);
  };

  const handleAddNewClick = () => {
    setEditingProduct(null);
    setFormData({ ...emptyProduct, id: Date.now().toString(), category: categories[0] || 'Women' });
    setIsFormOpen(true);
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setFormData(prev => ({ ...prev, image: reader.result as string }));
        notify('Image uploaded', 'info');
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (editingProduct) {
      onUpdateProduct(formData);
    } else {
      onAddProduct(formData);
    }
    setIsFormOpen(false);
  };

  const handleCategorySubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (newCategory.trim()) {
      onAddCategory(newCategory.trim());
      setNewCategory('');
    }
  };

  const handlePaymentSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onUpdatePayment(tempPayment);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="flex justify-between items-center mb-8">
        <h2 className="text-3xl font-serif font-bold text-fifi-800">Admin Dashboard</h2>
        <button onClick={onExit} className="text-gray-500 hover:text-fifi-600 underline">
          Exit Dashboard
        </button>
      </div>

      {/* Tabs */}
      <div className="flex space-x-4 mb-6 border-b border-fifi-200">
        <button
          onClick={() => setActiveTab('products')}
          className={`pb-2 px-4 font-medium ${activeTab === 'products' ? 'text-fifi-600 border-b-2 border-fifi-500' : 'text-gray-500'}`}
        >
          Manage Bags
        </button>
        <button
          onClick={() => setActiveTab('categories')}
          className={`pb-2 px-4 font-medium ${activeTab === 'categories' ? 'text-fifi-600 border-b-2 border-fifi-500' : 'text-gray-500'}`}
        >
          Categories
        </button>
        <button
          onClick={() => setActiveTab('settings')}
          className={`pb-2 px-4 font-medium ${activeTab === 'settings' ? 'text-fifi-600 border-b-2 border-fifi-500' : 'text-gray-500'}`}
        >
          Payment Settings
        </button>
      </div>

      {activeTab === 'products' && (
        <>
          {!isFormOpen ? (
            <div>
              <button
                onClick={handleAddNewClick}
                className="mb-6 bg-fifi-500 text-white px-6 py-2 rounded-lg hover:bg-fifi-600 flex items-center shadow-sm"
              >
                <span className="mr-2 text-xl">+</span> Add New Bag
              </button>

              <div className="bg-white shadow overflow-hidden sm:rounded-md border border-fifi-100">
                <ul className="divide-y divide-fifi-100">
                  {products.map((product) => (
                    <li key={product.id} className="p-4 hover:bg-fifi-50 transition-colors">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center min-w-0 flex-1">
                          <img 
                            className="h-16 w-16 rounded-md object-cover border border-fifi-200" 
                            src={product.image} 
                            alt={product.name} 
                          />
                          <div className="ml-4">
                            <h4 className="text-lg font-bold text-gray-900">{product.name}</h4>
                            <p className="text-sm text-gray-500">{product.category} • ${product.price}</p>
                            {product.soldOut && (
                                <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-red-100 text-red-800">
                                Sold Out
                                </span>
                            )}
                          </div>
                        </div>
                        <div className="flex space-x-2 ml-4">
                          <button
                            onClick={() => handleEditClick(product)}
                            className="text-indigo-600 hover:text-indigo-900 bg-indigo-50 px-3 py-1 rounded-md text-sm font-medium"
                          >
                            Edit
                          </button>
                          <button
                            onClick={() => {
                                if(window.confirm('Are you sure you want to delete this bag?')) onDeleteProduct(product.id);
                            }}
                            className="text-red-600 hover:text-red-900 bg-red-50 px-3 py-1 rounded-md text-sm font-medium"
                          >
                            Delete
                          </button>
                        </div>
                      </div>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          ) : (
            <div className="bg-white p-6 rounded-xl shadow-lg border border-fifi-100 max-w-2xl">
              <h3 className="text-xl font-bold mb-4">{editingProduct ? 'Edit Bag' : 'New Bag'}</h3>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700">Name</label>
                  <input
                    required
                    type="text"
                    value={formData.name}
                    onChange={e => setFormData({...formData, name: e.target.value})}
                    className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-fifi-500 focus:border-fifi-500"
                  />
                </div>
                
                <div className="grid grid-cols-2 gap-4">
                    <div>
                        <label className="block text-sm font-medium text-gray-700">Price ($)</label>
                        <input
                            required
                            type="number"
                            value={formData.price}
                            onChange={e => setFormData({...formData, price: Number(e.target.value)})}
                            className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-fifi-500 focus:border-fifi-500"
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700">Category</label>
                        <select
                            value={formData.category}
                            onChange={e => setFormData({...formData, category: e.target.value})}
                            className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-fifi-500 focus:border-fifi-500"
                        >
                           {categories.map(cat => (
                             <option key={cat} value={cat}>{cat}</option>
                           ))}
                        </select>
                    </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700">Description</label>
                  <textarea
                    required
                    rows={3}
                    value={formData.description}
                    onChange={e => setFormData({...formData, description: e.target.value})}
                    className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-fifi-500 focus:border-fifi-500"
                  />
                </div>

                <div>
                    <label className="block text-sm font-medium text-gray-700">Image</label>
                    <div className="mt-1 flex items-center space-x-4">
                        {formData.image && (
                            <img src={formData.image} alt="Preview" className="h-20 w-20 object-cover rounded-md" />
                        )}
                        <button
                            type="button"
                            onClick={() => fileInputRef.current?.click()}
                            className="bg-white py-2 px-3 border border-gray-300 rounded-md shadow-sm text-sm leading-4 font-medium text-gray-700 hover:bg-gray-50 focus:outline-none"
                        >
                            Upload Photo
                        </button>
                        <input
                            type="file"
                            ref={fileInputRef}
                            className="hidden"
                            accept="image/*"
                            onChange={handleImageUpload}
                        />
                    </div>
                    <p className="mt-1 text-xs text-gray-500">Or paste a URL below:</p>
                    <input
                        type="text"
                        value={formData.image}
                        onChange={e => setFormData({...formData, image: e.target.value})}
                        placeholder="https://..."
                        className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-fifi-500 focus:border-fifi-500 text-sm"
                    />
                </div>

                <div className="flex space-x-6">
                    <label className="flex items-center">
                        <input
                            type="checkbox"
                            checked={formData.soldOut}
                            onChange={e => setFormData({...formData, soldOut: e.target.checked})}
                            className="rounded text-fifi-600 focus:ring-fifi-500 h-4 w-4"
                        />
                        <span className="ml-2 text-sm text-gray-700">Mark as Sold Out</span>
                    </label>
                    <label className="flex items-center">
                        <input
                            type="checkbox"
                            checked={formData.isNew}
                            onChange={e => setFormData({...formData, isNew: e.target.checked})}
                            className="rounded text-fifi-600 focus:ring-fifi-500 h-4 w-4"
                        />
                        <span className="ml-2 text-sm text-gray-700">Mark as New Arrival</span>
                    </label>
                </div>

                <div className="flex justify-end space-x-3 pt-4 border-t border-gray-100">
                    <button
                        type="button"
                        onClick={() => setIsFormOpen(false)}
                        className="bg-white py-2 px-4 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 hover:bg-gray-50"
                    >
                        Cancel
                    </button>
                    <button
                        type="submit"
                        className="bg-fifi-600 py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white hover:bg-fifi-700"
                    >
                        Save Bag
                    </button>
                </div>
              </form>
            </div>
          )}
        </>
      )}

      {activeTab === 'categories' && (
         <div className="max-w-2xl">
             <div className="bg-white p-6 rounded-xl shadow-lg border border-fifi-100 mb-6">
                 <h3 className="text-xl font-bold mb-4 text-gray-900">Add New Category</h3>
                 <form onSubmit={handleCategorySubmit} className="flex gap-4">
                     <input
                         type="text"
                         value={newCategory}
                         onChange={(e) => setNewCategory(e.target.value)}
                         placeholder="e.g. Travel Bags"
                         className="flex-1 border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-fifi-500 focus:border-fifi-500"
                     />
                     <button
                         type="submit"
                         className="bg-fifi-600 text-white px-6 py-2 rounded-md hover:bg-fifi-700 font-medium"
                     >
                         Add
                     </button>
                 </form>
             </div>

             <div className="bg-white shadow overflow-hidden sm:rounded-md border border-fifi-100">
                 <ul className="divide-y divide-fifi-100">
                     {categories.map(category => (
                         <li key={category} className="p-4 flex items-center justify-between hover:bg-fifi-50">
                             <span className="text-gray-900 font-medium">{category}</span>
                             <button
                                 onClick={() => {
                                     if(window.confirm(`Delete category "${category}"?`)) onDeleteCategory(category);
                                 }}
                                 className="text-red-500 hover:text-red-700"
                                 title="Delete Category"
                             >
                                 <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"></path></svg>
                             </button>
                         </li>
                     ))}
                 </ul>
             </div>
         </div>
      )}

      {activeTab === 'settings' && (
        <div className="max-w-xl bg-white p-6 rounded-xl shadow-lg border border-fifi-100">
            <h3 className="text-xl font-bold mb-4 text-gray-900">Local Bank Transfer Settings</h3>
            <p className="mb-4 text-sm text-gray-500">These details will be shown to customers at checkout.</p>
            <form onSubmit={handlePaymentSubmit} className="space-y-4">
                <div>
                    <label className="block text-sm font-medium text-gray-700">Bank Name</label>
                    <input
                        type="text"
                        value={tempPayment.bankName}
                        onChange={e => setTempPayment({...tempPayment, bankName: e.target.value})}
                        className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-fifi-500 focus:border-fifi-500"
                    />
                </div>
                <div>
                    <label className="block text-sm font-medium text-gray-700">Account Name</label>
                    <input
                        type="text"
                        value={tempPayment.accountName}
                        onChange={e => setTempPayment({...tempPayment, accountName: e.target.value})}
                        className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-fifi-500 focus:border-fifi-500"
                    />
                </div>
                <div>
                    <label className="block text-sm font-medium text-gray-700">Account Number</label>
                    <input
                        type="text"
                        value={tempPayment.accountNumber}
                        onChange={e => setTempPayment({...tempPayment, accountNumber: e.target.value})}
                        className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-fifi-500 focus:border-fifi-500 font-mono"
                    />
                </div>
                <div>
                    <label className="block text-sm font-medium text-gray-700">Special Instructions</label>
                    <textarea
                        rows={3}
                        value={tempPayment.instructions}
                        onChange={e => setTempPayment({...tempPayment, instructions: e.target.value})}
                        className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-fifi-500 focus:border-fifi-500"
                    />
                </div>
                <div className="pt-4">
                    <button
                        type="submit"
                        className="w-full bg-fifi-600 py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white hover:bg-fifi-700"
                    >
                        Save Payment Settings
                    </button>
                </div>
            </form>
        </div>
      )}
    </div>
  );
};
