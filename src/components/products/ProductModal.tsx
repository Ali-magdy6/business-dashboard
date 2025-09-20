import { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import { Product } from '../../types';
import { X, Package, DollarSign, Hash, Image as ImageIcon, Upload } from 'lucide-react';
import { motion } from 'framer-motion';

type ProductFormData = {
  name: string;
  description: string;
  price: number;
  category: string;
  stock: number;
  status: 'active' | 'inactive';
};

const schema = yup.object({
  name: yup.string().min(2, 'Name must be at least 2 characters').required('Name is required'),
  description: yup.string().min(10, 'Description must be at least 10 characters').required('Description is required'),
  price: yup.number().min(0, 'Price must be positive').required('Price is required'),
  category: yup.string().required('Category is required'),
  stock: yup.number().min(0, 'Stock must be positive').required('Stock is required'),
  status: yup.string().oneOf(['active', 'inactive']).required('Status is required'),
});

interface ProductModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: Partial<Product>) => void;
  product?: Product | null;
  title: string;
}

const ProductModal: React.FC<ProductModalProps> = ({ isOpen, onClose, onSubmit, product, title }) => {
  const [imagePreview, setImagePreview] = useState<string | null>(product?.image || null);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    reset,
  } = useForm<ProductFormData>({
    resolver: yupResolver(schema),
    defaultValues: product ? {
      name: product.name,
      description: product.description,
      price: product.price,
      category: product.category,
      stock: product.stock,
      status: product.status,
    } : {
      name: '',
      description: '',
      price: 0,
      category: '',
      stock: 0,
      status: 'active',
    },
  });

  useEffect(() => {
    if (product) {
      reset({
        name: product.name,
        description: product.description,
        price: product.price,
        category: product.category,
        stock: product.stock,
        status: product.status,
      });
      setImagePreview(product.image || null);
    } else {
      reset({
        name: '',
        description: '',
        price: 0,
        category: '',
        stock: 0,
        status: 'active',
      });
      setImagePreview(null);
    }
  }, [product, reset]);

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        setImagePreview(e.target?.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleFormSubmit = async (data: ProductFormData) => {
    const formData: Partial<Product> = {
      ...data,
      image: imagePreview || undefined,
    };
    await onSubmit(formData);
    onClose();
    reset();
    setImagePreview(null);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-surface-0 bg-opacity-50 overflow-y-auto h-full w-full z-50">
      <div className="relative top-10 mx-auto p-5 border w-full max-w-2xl shadow-lg rounded-md bg-surface-2">
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.95 }}
          transition={{ duration: 0.2 }}
        >
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-lg font-semibold text-text-primary">{title}</h3>
            <button
              onClick={onClose}
              className="text-text-muted hover:text-text-secondary"
              title="Close modal"
              aria-label="Close modal"
            >
              <X className="w-6 h-6" />
            </button>
          </div>

          <form onSubmit={handleSubmit(handleFormSubmit)} className="space-y-6">
            {/* Image Upload */}
            <div>
              <label className="block text-sm font-medium text-text-secondary mb-2">
                Product Image
              </label>
              <div className="flex items-center space-x-4">
                <div className="w-24 h-24 bg-surface-3 rounded-lg flex items-center justify-center overflow-hidden">
                  {imagePreview ? (
                    <img
                      src={imagePreview}
                      alt="Product preview"
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <ImageIcon className="w-8 h-8 text-text-muted" />
                  )}
                </div>
                <div className="flex-1">
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleImageChange}
                    className="hidden"
                    id="image-upload"
                  />
                  <label
                    htmlFor="image-upload"
                    className="btn-secondary flex items-center cursor-pointer"
                  >
                    <Upload className="w-4 h-4 mr-2" />
                    Upload Image
                  </label>
                  <p className="text-xs text-text-muted mt-1">
                    JPG, PNG up to 2MB
                  </p>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-text-secondary mb-2">
                  Product Name
                </label>
                <div className="relative">
                  <Package className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                  <input
                    {...register('name')}
                    type="text"
                    className="input-field pl-10"
                    placeholder="Enter product name"
                  />
                </div>
                {errors.name && (
                  <p className="mt-1 text-sm text-red-600 dark:text-red-400">{errors.name.message}</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-text-secondary mb-2">
                  Category
                </label>
                <select
                  {...register('category')}
                  className="input-field"
                >
                  <option value="">Select category</option>
                  <option value="Electronics">Electronics</option>
                  <option value="Clothing">Clothing</option>
                  <option value="Books">Books</option>
                  <option value="Home">Home</option>
                  <option value="Sports">Sports</option>
                  <option value="Other">Other</option>
                </select>
                {errors.category && (
                  <p className="mt-1 text-sm text-red-600 dark:text-red-400">{errors.category.message}</p>
                )}
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-text-secondary mb-2">
                Description
              </label>
              <textarea
                {...register('description')}
                rows={3}
                className="input-field"
                placeholder="Enter product description"
              />
              {errors.description && (
                <p className="mt-1 text-sm text-red-600 dark:text-red-400">{errors.description.message}</p>
              )}
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div>
                <label className="block text-sm font-medium text-text-secondary mb-2">
                  Price
                </label>
                <div className="relative">
                  <DollarSign className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                  <input
                    {...register('price', { valueAsNumber: true })}
                    type="number"
                    step="0.01"
                    className="input-field pl-10"
                    placeholder="0.00"
                  />
                </div>
                {errors.price && (
                  <p className="mt-1 text-sm text-red-600 dark:text-red-400">{errors.price.message}</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-text-secondary mb-2">
                  Stock
                </label>
                <div className="relative">
                  <Hash className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                  <input
                    {...register('stock', { valueAsNumber: true })}
                    type="number"
                    className="input-field pl-10"
                    placeholder="0"
                  />
                </div>
                {errors.stock && (
                  <p className="mt-1 text-sm text-red-600 dark:text-red-400">{errors.stock.message}</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-text-secondary mb-2">
                  Status
                </label>
                <select
                  {...register('status')}
                  className="input-field"
                >
                  <option value="active">Active</option>
                  <option value="inactive">Inactive</option>
                </select>
                {errors.status && (
                  <p className="mt-1 text-sm text-red-600 dark:text-red-400">{errors.status.message}</p>
                )}
              </div>
            </div>

            <div className="flex justify-end space-x-3 pt-4">
              <button
                type="button"
                onClick={onClose}
                className="btn-secondary"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={isSubmitting}
                className="btn-primary disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isSubmitting ? 'Saving...' : 'Save'}
              </button>
            </div>
          </form>
        </motion.div>
      </div>
    </div>
  );
};

export default ProductModal;
