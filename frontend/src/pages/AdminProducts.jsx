import React, { useState, useEffect } from 'react';
import { Plus, Edit, Trash2, Search, X, Check, ArrowLeft } from 'lucide-react';
import API from '../services/api';
import { useCart } from '../context/CartContext';
import { Link } from 'react-router-dom';

const AdminProducts = () => {
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [keyword, setKeyword] = useState('');
  const { showToast } = useCart();

  // Modal State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState(null);
  const [formData, setFormData] = useState({
    name: '',
    price: '',
    originalPrice: '',
    description: '',
    imageUrl: '',
    categoryName: 'Electronics',
    countInStock: 10,
    isFeatured: false,
    brand: 'NexCart',
  });

  useEffect(() => {
    fetchProducts();
    fetchCategories();
  }, []);

  const fetchProducts = async () => {
    setLoading(true);
    try {
      const { data } = await API.get('/products?limit=50');
      setProducts(Array.isArray(data?.products) ? data.products : Array.isArray(data) ? data : []);
    } catch (err) {
      console.error('Failed to fetch products:', err);
      setProducts([]);
    } finally {
      setLoading(false);
    }
  };

  const fetchCategories = async () => {
    try {
      const { data } = await API.get('/categories');
      setCategories(Array.isArray(data) ? data : []);
    } catch (err) {
      console.error('Failed to fetch categories:', err);
      setCategories([]);
    }
  };

  const handleOpenAddModal = () => {
    setEditingProduct(null);
    setFormData({
      name: '',
      price: '',
      originalPrice: '',
      description: '',
      imageUrl: '',
      categoryName: categories[0]?.name || "Women's Fashion",
      countInStock: 10,
      isFeatured: false,
      brand: 'ALoraLuxe',
    });
    setIsModalOpen(true);
  };

  const handleOpenEditModal = (prod) => {
    setEditingProduct(prod);
    setFormData({
      name: prod.name,
      price: prod.price,
      originalPrice: prod.originalPrice || prod.price,
      description: prod.description,
      imageUrl: prod.imageUrl,
      categoryName: prod.categoryName,
      countInStock: prod.countInStock,
      isFeatured: prod.isFeatured || false,
      brand: prod.brand || 'ALoraLuxe',
    });
    setIsModalOpen(true);
  };

  const handleDeleteProduct = async (id, name) => {
    if (window.confirm(`Are you sure you want to delete "${name}"?`)) {
      try {
        await API.delete(`/products/${id}`);
        showToast(`Product "${name}" removed successfully`, 'info');
        fetchProducts();
      } catch (err) {
        showToast('Failed to delete product', 'error');
      }
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const payload = {
        ...formData,
        price: Number(formData.price),
        originalPrice: Number(formData.originalPrice || formData.price),
        countInStock: Number(formData.countInStock),
      };

      if (editingProduct) {
        await API.put(`/products/${editingProduct._id}`, payload);
        showToast(`Updated "${formData.name}" successfully`, 'success');
      } else {
        await API.post('/products', payload);
        showToast(`Created new product "${formData.name}"`, 'success');
      }

      setIsModalOpen(false);
      fetchProducts();
    } catch (err) {
      showToast(err.response?.data?.message || 'Failed to save product', 'error');
    }
  };

  const filteredProducts = (Array.isArray(products) ? products : []).filter((p) =>
    p?.name?.toLowerCase().includes(keyword.toLowerCase())
  );

  return (
    <div className="admin-products-page fade-in">
      <div className="page-header flex-between">
        <div>
          <Link to="/admin" className="back-link mb-1">
            <ArrowLeft size={14} /> Back to Dashboard
          </Link>
          <h1>Product Inventory Management</h1>
          <p>Add new products, edit pricing & specifications, update stock inventory.</p>
        </div>

        <button className="btn btn-primary" onClick={handleOpenAddModal}>
          <Plus size={18} /> Add New Product
        </button>
      </div>

      {/* Search Bar */}
      <div className="card p-3 flex-between gap-1">
        <div className="search-input-box">
          <Search size={18} className="search-icon" />
          <input
            type="text"
            className="search-input"
            placeholder="Search products in inventory..."
            value={keyword}
            onChange={(e) => setKeyword(e.target.value)}
          />
        </div>
        <span className="text-muted font-sm">Showing {filteredProducts.length} items</span>
      </div>

      {/* Products Table */}
      <div className="card p-0">
        {loading ? (
          <div className="p-4 text-center">Loading Inventory...</div>
        ) : Array.isArray(filteredProducts) && filteredProducts.length > 0 ? (
          <table className="admin-table">
            <thead>
              <tr>
                <th>Product</th>
                <th>Category</th>
                <th>Price</th>
                <th>Stock</th>
                <th>Featured</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {Array.isArray(filteredProducts) && filteredProducts?.map((p) => (
                <tr key={p._id}>
                  <td>
                    <div className="prod-cell">
                      <img src={p.imageUrl} alt={p.name} className="table-thumb" />
                      <div>
                        <strong className="d-block">{p.name}</strong>
                        <span className="text-muted font-xs">Brand: {p.brand}</span>
                      </div>
                    </div>
                  </td>
                  <td><span className="badge badge-primary">{p.categoryName}</span></td>
                  <td className="font-bold">${p.price.toFixed(2)}</td>
                  <td>
                    <span className={`badge ${p.countInStock <= 5 ? 'badge-danger' : 'badge-success'}`}>
                      {p.countInStock} units
                    </span>
                  </td>
                  <td>{p.isFeatured ? <Check size={16} className="text-success" /> : '-'}</td>
                  <td>
                    <div className="action-btns">
                      <button
                        className="btn btn-secondary btn-sm"
                        onClick={() => handleOpenEditModal(p)}
                        title="Edit Product"
                      >
                        <Edit size={14} /> Edit
                      </button>
                      <button
                        className="btn btn-danger btn-sm"
                        onClick={() => handleDeleteProduct(p._id, p.name)}
                        title="Delete Product"
                      >
                        <Trash2 size={14} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        ) : (
          <div className="p-4 text-center text-muted">No products found matching query.</div>
        )}
      </div>

      {/* Add / Edit Product Modal */}
      {isModalOpen && (
        <div className="modal-overlay fade-in">
          <div className="modal-content">
            <div className="modal-header flex-between mb-3">
              <h3>{editingProduct ? 'Edit Product' : 'Add New Product'}</h3>
              <button className="icon-btn" onClick={() => setIsModalOpen(false)}>
                <X size={20} />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="modal-form">
              <div className="form-group">
                <label className="form-label">Product Name</label>
                <input
                  type="text"
                  required
                  className="form-control"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                />
              </div>

              <div className="form-row">
                <div className="form-group">
                  <label className="form-label">Category</label>
                  <select
                    className="form-control"
                    value={formData.categoryName}
                    onChange={(e) => setFormData({ ...formData, categoryName: e.target.value })}
                  >
                    {Array.isArray(categories) && categories?.map((c) => (
                      <option key={c._id} value={c.name}>{c.name}</option>
                    ))}
                    <option value="Women's Fashion">Women's Fashion</option>
                    <option value="Men's Fashion">Men's Fashion</option>
                    <option value="Shoes & Sneakers">Shoes & Sneakers</option>
                    <option value="Bags & Accessories">Bags & Accessories</option>
                    <option value="Beauty & Skincare">Beauty & Skincare</option>
                    <option value="Jewelry & Watches">Jewelry & Watches</option>
                    <option value="Electronics">Electronics</option>
                    <option value="Home & Living">Home & Living</option>
                  </select>
                </div>

                <div className="form-group">
                  <label className="form-label">Brand</label>
                  <input
                    type="text"
                    className="form-control"
                    value={formData.brand}
                    onChange={(e) => setFormData({ ...formData, brand: e.target.value })}
                  />
                </div>
              </div>

              <div className="form-row">
                <div className="form-group">
                  <label className="form-label">Current Price ($)</label>
                  <input
                    type="number"
                    step="0.01"
                    required
                    className="form-control"
                    value={formData.price}
                    onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                  />
                </div>

                <div className="form-group">
                  <label className="form-label">Original MSRP Price ($)</label>
                  <input
                    type="number"
                    step="0.01"
                    className="form-control"
                    value={formData.originalPrice}
                    onChange={(e) => setFormData({ ...formData, originalPrice: e.target.value })}
                  />
                </div>
              </div>

              <div className="form-row">
                <div className="form-group">
                  <label className="form-label">Stock Quantity</label>
                  <input
                    type="number"
                    required
                    className="form-control"
                    value={formData.countInStock}
                    onChange={(e) => setFormData({ ...formData, countInStock: e.target.value })}
                  />
                </div>

                <div className="form-group flex-center pt-4">
                  <label className="flex-center gap-1 cursor-pointer font-sm">
                    <input
                      type="checkbox"
                      checked={formData.isFeatured}
                      onChange={(e) => setFormData({ ...formData, isFeatured: e.target.checked })}
                    />
                    <span>Highlight as Featured Product</span>
                  </label>
                </div>
              </div>

              <div className="form-group">
                <label className="form-label">Image URL</label>
                <input
                  type="url"
                  required
                  className="form-control"
                  placeholder="https://images.unsplash.com/..."
                  value={formData.imageUrl}
                  onChange={(e) => setFormData({ ...formData, imageUrl: e.target.value })}
                />
              </div>

              <div className="form-group">
                <label className="form-label">Product Description</label>
                <textarea
                  rows="3"
                  required
                  className="form-control"
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                ></textarea>
              </div>

              <div className="modal-actions flex-between mt-3">
                <button type="button" className="btn btn-secondary" onClick={() => setIsModalOpen(false)}>
                  Cancel
                </button>
                <button type="submit" className="btn btn-primary">
                  {editingProduct ? 'Save Changes' : 'Create Product'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      <style>{`
        .admin-products-page {
          display: flex;
          flex-direction: column;
          gap: 1.5rem;
        }

        .back-link {
          display: inline-flex;
          align-items: center;
          gap: 0.35rem;
          font-size: 0.85rem;
          color: var(--text-muted);
        }

        .search-input-box {
          position: relative;
          display: flex;
          align-items: center;
          width: 320px;
        }

        .search-input-box .search-icon {
          position: absolute;
          left: 0.85rem;
          color: var(--text-muted);
        }

        .search-input-box .search-input {
          padding-left: 2.75rem;
        }

        .prod-cell {
          display: flex;
          align-items: center;
          gap: 0.75rem;
        }

        .table-thumb {
          width: 44px;
          height: 44px;
          border-radius: var(--radius-sm);
          object-fit: cover;
        }

        .action-btns {
          display: flex;
          gap: 0.35rem;
        }

        .modal-form {
          display: flex;
          flex-direction: column;
          gap: 1rem;
        }

        .form-row {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 1rem;
        }

        .d-block { display: block; }
        .p-0 { padding: 0 !important; }
        .cursor-pointer { cursor: pointer; }
      `}</style>
    </div>
  );
};

export default AdminProducts;
