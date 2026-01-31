'use client';

import { useState, useMemo } from 'react';
import { useDashboard } from '@/context/DashboardContext';
import { usePreferences } from '@/context/PreferencesContext';
import { manageProduct, Product } from '@/services/api';
import { ProductHeader } from '@/components/product/ProductHeader';
import { ProductGrid } from '@/components/product/ProductGrid';
import { ProductFormModal } from '@/components/product/ProductFormModal';
import { ProductDeleteModal } from '@/components/product/ProductDeleteModal';
import { LoadingSpinner } from '@/components/ui/LoadingSpinner';

export default function ProductPage() {
  const { data, loading: dataLoading, refreshData } = useDashboard();
  const { t } = usePreferences();
  const [searchQuery, setSearchQuery] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [productToDelete, setProductToDelete] = useState<Product | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  // Modal Form State
  const [formData, setFormData] = useState({
    name: '',
    price: '',
    costPrice: '',
    stock: '',
    image: '🧁'
  });

  const products = data?.products || [];

  // Filtered products based on search
  const filteredProducts = useMemo(() => {
    return products.filter(p => 
      p.name.toLowerCase().includes(searchQuery.toLowerCase())
    );
  }, [products, searchQuery]);

  // Handle Modal Open
  const openModal = (product: Product | null = null) => {
    if (product) {
      setEditingProduct(product);
      setFormData({
        name: product.name,
        price: product.price.toString(),
        costPrice: product.costPrice?.toString() || '',
        stock: product.stock.toString(),
        image: product.image
      });
    } else {
      setEditingProduct(null);
      setFormData({ name: '', price: '', costPrice: '', stock: '', image: '🧁' });
    }
    setIsModalOpen(true);
  };

  // Handle CRUD: Create/Update
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    const action = editingProduct ? 'update' : 'create';
    const id = editingProduct ? editingProduct.id : Date.now();
    
    const success = await manageProduct(action, {
      id: Number(id),
      name: formData.name,
      price: Number(formData.price),
      costPrice: Number(formData.costPrice),
      stock: Number(formData.stock),
      sold: editingProduct ? editingProduct.sold : 0,
      image: formData.image
    });

    if (success) {
      await refreshData();
      setIsModalOpen(false);
    } else {
      alert(t('product.error_save'));
    }
    setIsSubmitting(false);
  };

  // Handle CRUD: Delete Confirmation
  const confirmDelete = (product: Product) => {
    setProductToDelete(product);
    setIsDeleteModalOpen(true);
  };

  const handleDelete = async () => {
    if (productToDelete) {
      setIsSubmitting(true);
      const success = await manageProduct('delete', { id: productToDelete.id });
      
      if (success) {
        await refreshData();
        setIsDeleteModalOpen(false);
        setProductToDelete(null);
      } else {
        alert(t('product.error_delete'));
      }
      setIsSubmitting(false);
    }
  };

  if (dataLoading && !data) {
    return <LoadingSpinner message={t('product.loading')} />;
  }

  return (
    <div className="max-w-6xl mx-auto space-y-10 animate-in fade-in duration-700">
      <ProductHeader
        searchQuery={searchQuery}
        setSearchQuery={setSearchQuery}
        onAddClick={() => openModal()}
      />

      {/* Product List Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-8 px-4">
        <ProductGrid
          products={filteredProducts}
          isSubmitting={isSubmitting}
          onEdit={openModal}
          onDelete={confirmDelete}
        />
      </div>

      <ProductFormModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        formData={formData}
        setFormData={setFormData}
        onSubmit={handleSubmit}
        isSubmitting={isSubmitting}
        editingProduct={editingProduct}
      />

      <ProductDeleteModal
        isOpen={isDeleteModalOpen}
        onClose={() => setIsDeleteModalOpen(false)}
        onConfirm={handleDelete}
        isSubmitting={isSubmitting}
        product={productToDelete}
      />
    </div>
  );
}
