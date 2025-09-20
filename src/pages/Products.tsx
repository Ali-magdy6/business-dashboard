import React, { useEffect, useState } from 'react';
import { Plus, Package, TrendingUp, AlertTriangle } from 'lucide-react';
import { motion } from 'framer-motion';
import ProductTable from '../components/products/ProductTable';
import ProductModal from '../components/products/ProductModal';
import { useStore } from '../store/useStore';
import { Product } from '../types';
import toast from 'react-hot-toast';

const Products: React.FC = () => {
  const { products, setProducts, addProduct, updateProduct, deleteProduct } = useStore();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);

  // Mock data for demonstration
  useEffect(() => {
    const mockProducts: Product[] = [
      {
        id: '1',
        name: 'Wireless Headphones',
        description: 'High-quality wireless headphones with noise cancellation',
        price: 199.99,
        category: 'Electronics',
        stock: 25,
        status: 'active',
        createdAt: '2024-01-15',
        updatedAt: '2024-01-20',
      },
      {
        id: '2',
        name: 'Laptop Stand',
        description: 'Adjustable aluminum laptop stand for better ergonomics',
        price: 49.99,
        category: 'Electronics',
        stock: 8,
        status: 'active',
        createdAt: '2024-01-10',
        updatedAt: '2024-01-18',
      },
      {
        id: '3',
        name: 'Coffee Mug',
        description: 'Ceramic coffee mug with company logo',
        price: 12.99,
        category: 'Home',
        stock: 0,
        status: 'inactive',
        createdAt: '2024-01-05',
        updatedAt: '2024-01-15',
      },
      {
        id: '4',
        name: 'Running Shoes',
        description: 'Comfortable running shoes for all terrains',
        price: 89.99,
        category: 'Sports',
        stock: 15,
        status: 'active',
        createdAt: '2024-01-12',
        updatedAt: '2024-01-19',
      },
      {
        id: '5',
        name: 'Programming Book',
        description: 'Complete guide to modern web development',
        price: 39.99,
        category: 'Books',
        stock: 3,
        status: 'active',
        createdAt: '2024-01-08',
        updatedAt: '2024-01-17',
      },
    ];

    setProducts(mockProducts);
  }, [setProducts]);

  const handleAddProduct = () => {
    setEditingProduct(null);
    setIsModalOpen(true);
  };

  const handleEditProduct = (product: Product) => {
    setEditingProduct(product);
    setIsModalOpen(true);
  };

  const handleViewProduct = (product: Product) => {
    // You could open a view-only modal here
    // eslint-disable-next-line no-console
    console.log('Viewing product:', product);
  };

  const handleDeleteProduct = (id: string) => {
    if (window.confirm('Are you sure you want to delete this product?')) {
      deleteProduct(id);
      toast.success('Product deleted successfully');
    }
  };

  const handleSubmitProduct = async (productData: Partial<Product>) => {
    try {
      if (editingProduct) {
        updateProduct(editingProduct.id, productData);
        toast.success('Product updated successfully');
      } else {
        const newProduct: Product = {
          id: Date.now().toString(),
          name: productData.name || '',
          description: productData.description || '',
          price: productData.price || 0,
          category: productData.category || '',
          stock: productData.stock || 0,
          status: productData.status || 'active',
          image: productData.image,
          createdAt: new Date().toISOString().split('T')[0] as string,
          updatedAt: new Date().toISOString().split('T')[0] as string,
        };
        addProduct(newProduct);
        toast.success('Product created successfully');
      }
    } catch (error) {
      toast.error('Failed to save product');
    }
  };

  const totalValue = products.reduce((sum, product) => sum + (product.price * product.stock), 0);
  const lowStockProducts = products.filter(product => product.stock < 10 && product.stock > 0);
  const outOfStockProducts = products.filter(product => product.stock === 0);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-text-primary flex items-center">
            <Package className="w-8 h-8 mr-3 text-brand-primary" />
            Product Management
          </h1>
          <p className="text-text-secondary mt-1">
            Manage your products and inventory
          </p>
        </div>
        <motion.button
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          onClick={handleAddProduct}
          className="btn-primary flex items-center mt-4 sm:mt-0"
        >
          <Plus className="w-5 h-5 mr-2" />
          Add Product
        </motion.button>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="card p-6"
        >
          <div className="flex items-center">
            <div className="p-3 bg-info-100 dark:bg-info-900 rounded-full">
              <Package className="w-6 h-6 text-info-600 dark:text-info-400" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-text-secondary">Total Products</p>
              <p className="text-2xl font-bold text-text-primary">{products.length}</p>
            </div>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="card p-6"
        >
          <div className="flex items-center">
            <div className="p-3 bg-success-100 dark:bg-success-900 rounded-full">
              <TrendingUp className="w-6 h-6 text-success-600 dark:text-success-400" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-text-secondary">Total Value</p>
              <p className="text-2xl font-bold text-text-primary">
                ${totalValue.toLocaleString()}
              </p>
            </div>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="card p-6"
        >
          <div className="flex items-center">
            <div className="p-3 bg-warning-100 dark:bg-warning-900 rounded-full">
              <AlertTriangle className="w-6 h-6 text-warning-600 dark:text-warning-400" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-text-secondary">Low Stock</p>
              <p className="text-2xl font-bold text-text-primary">{lowStockProducts.length}</p>
            </div>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="card p-6"
        >
          <div className="flex items-center">
            <div className="p-3 bg-danger-100 dark:bg-danger-900 rounded-full">
              <AlertTriangle className="w-6 h-6 text-danger-600 dark:text-danger-400" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-text-secondary">Out of Stock</p>
              <p className="text-2xl font-bold text-text-primary">{outOfStockProducts.length}</p>
            </div>
          </div>
        </motion.div>
      </div>

      {/* Product Table */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5 }}
      >
        <ProductTable
          products={products}
          onEdit={handleEditProduct}
          onDelete={handleDeleteProduct}
          onView={handleViewProduct}
        />
      </motion.div>

      {/* Product Modal */}
      <ProductModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSubmit={handleSubmitProduct}
        product={editingProduct}
        title={editingProduct ? 'Edit Product' : 'Add New Product'}
      />
    </div>
  );
};

export default Products;
