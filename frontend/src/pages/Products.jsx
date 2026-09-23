import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { Search, SlidersHorizontal, X, ArrowUpDown, RefreshCw, Grid, LayoutGrid } from 'lucide-react';
import API from '../services/api';
import ProductCard from '../components/ProductCard';

const Products = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);

  // Filters State
  const [keyword, setKeyword] = useState(searchParams.get('keyword') || '');
  const [selectedCategory, setSelectedCategory] = useState(searchParams.get('category') || 'All');
  const [minPrice, setMinPrice] = useState('');
  const [maxPrice, setMaxPrice] = useState('');
  const [sort, setSort] = useState(searchParams.get('sort') || 'newest');
  const [totalProducts, setTotalProducts] = useState(0);
  const [gridCols, setGridCols] = useState(4); // 4 or 3 grid view toggle

  useEffect(() => {
    fetchCategories();
  }, []);

  useEffect(() => {
    fetchProducts();
  }, [selectedCategory, sort, searchParams]);

  const fetchCategories = async () => {
    try {
      const { data } = await API.get('/categories');
      setCategories(data);
    } catch (err) {
      console.error('Error fetching categories:', err);
    }
  };

  const fetchProducts = async () => {
    setLoading(true);
    try {
      const params = {};
      if (keyword) params.keyword = keyword;
      if (selectedCategory && selectedCategory !== 'All') params.category = selectedCategory;
      if (minPrice) params.minPrice = minPrice;
      if (maxPrice) params.maxPrice = maxPrice;
      if (sort) params.sort = sort;

      const { data } = await API.get('/products', { params });
      setProducts(data.products || []);
      setTotalProducts(data.totalProducts || 0);
    } catch (err) {
      console.error('Error fetching products:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    fetchProducts();
  };

  const handleCategorySelect = (catName) => {
    setSelectedCategory(catName);
    const newParams = new URLSearchParams(searchParams);
    if (catName === 'All') {
      newParams.delete('category');
    } else {
      newParams.set('category', catName);
    }
    setSearchParams(newParams);
  };

  const resetFilters = () => {
    setKeyword('');
    setSelectedCategory('All');
    setMinPrice('');
    setMaxPrice('');
    setSort('newest');
    setSearchParams({});
  };

  return (
    <div className="products-page fade-in">
      <div className="page-header">
        <h1>FASHION & EVERYTHING CATALOG</h1>
        <p>Explore 50+ trendy styles, high-fashion apparel, cosmetics, and accessories.</p>
      </div>

      {/* Category Pills Slider */}
      <div className="category-horizontal-pills">
        <button
          className={`pill-btn ${selectedCategory === 'All' ? 'active' : ''}`}
          onClick={() => handleCategorySelect('All')}
        >
          All Items
        </button>
        {categories.map((cat) => (
          <button
            key={cat._id}
            className={`pill-btn ${selectedCategory === cat.name ? 'active' : ''}`}
            onClick={() => handleCategorySelect(cat.name)}
          >
            {cat.name}
          </button>
        ))}
      </div>

      {/* Top Search & Filter Toolbar */}
      <div className="search-filter-bar card">
        <form onSubmit={handleSearchSubmit} className="search-form">
          <Search size={18} className="search-icon" />
          <input
            type="text"
            className="search-input"
            placeholder="Search dresses, heels, jackets, AirPods..."
            value={keyword}
            onChange={(e) => setKeyword(e.target.value)}
          />
          <button type="submit" className="btn btn-primary btn-sm">
            Search
          </button>
        </form>

        <div className="right-tools">
          {/* Grid View Mode Toggle */}
          <div className="grid-toggle desktop-only">
            <button
              className={`icon-btn ${gridCols === 4 ? 'active' : ''}`}
              onClick={() => setGridCols(4)}
              title="4 Columns"
            >
              <LayoutGrid size={16} />
            </button>
            <button
              className={`icon-btn ${gridCols === 3 ? 'active' : ''}`}
              onClick={() => setGridCols(3)}
              title="3 Columns"
            >
              <Grid size={16} />
            </button>
          </div>

          <div className="sort-box">
            <ArrowUpDown size={15} />
            <select
              className="sort-select"
              value={sort}
              onChange={(e) => setSort(e.target.value)}
            >
              <option value="newest">Newest Arrivals</option>
              <option value="price-asc">Price: Low to High</option>
              <option value="price-desc">Price: High to Low</option>
              <option value="rating">Top Rated</option>
            </select>
          </div>
        </div>
      </div>

      <div className="catalog-layout">
        {/* Sidebar Filters */}
        <aside className="filters-sidebar card">
          <div className="sidebar-header">
            <span className="sidebar-title"><SlidersHorizontal size={18} /> Filters</span>
            {(selectedCategory !== 'All' || keyword || minPrice || maxPrice) && (
              <button className="reset-btn" onClick={resetFilters}>
                <RefreshCw size={12} /> Clear All
              </button>
            )}
          </div>

          {/* Categories List */}
          <div className="filter-group">
            <h4>Categories</h4>
            <div className="category-list">
              <button
                className={`cat-pill ${selectedCategory === 'All' ? 'active' : ''}`}
                onClick={() => handleCategorySelect('All')}
              >
                All Departments
              </button>
              {categories.map((cat) => (
                <button
                  key={cat._id}
                  className={`cat-pill ${selectedCategory === cat.name ? 'active' : ''}`}
                  onClick={() => handleCategorySelect(cat.name)}
                >
                  {cat.name}
                </button>
              ))}
            </div>
          </div>

          {/* Price Range Filter */}
          <div className="filter-group">
            <h4>Price Range ($)</h4>
            <div className="price-inputs">
              <input
                type="number"
                placeholder="Min"
                className="form-control"
                value={minPrice}
                onChange={(e) => setMinPrice(e.target.value)}
              />
              <span>to</span>
              <input
                type="number"
                placeholder="Max"
                className="form-control"
                value={maxPrice}
                onChange={(e) => setMaxPrice(e.target.value)}
              />
            </div>
            <button
              className="btn btn-secondary btn-block btn-sm mt-2"
              onClick={fetchProducts}
            >
              Apply Filter
            </button>
          </div>
        </aside>

        {/* Main Product Grid */}
        <main className="products-main">
          <div className="results-meta">
            <span className="results-count">
              Showing <strong>{products.length}</strong> of <strong>{totalProducts}</strong> Items
            </span>
          </div>

          {loading ? (
            <div className={`grid-products cols-${gridCols}`}>
              {[...Array(8)].map((_, i) => (
                <div key={i} className="shein-card" style={{ height: '340px' }}>
                  <div className="skeleton" style={{ height: '240px' }} />
                </div>
              ))}
            </div>
          ) : products.length > 0 ? (
            <div className={`grid-products cols-${gridCols}`}>
              {products.map((product) => (
                <ProductCard key={product._id} product={product} />
              ))}
            </div>
          ) : (
            <div className="empty-products card">
              <X size={48} className="empty-icon" />
              <h3>No Items Match Your Filters</h3>
              <p>Try resetting filters or adjusting search terms to discover more styles.</p>
              <button className="btn btn-primary mt-3" onClick={resetFilters}>
                Clear All Filters
              </button>
            </div>
          )}
        </main>
      </div>

      <style>{`
        .products-page {
          display: flex;
          flex-direction: column;
          gap: 1.5rem;
        }

        .page-header h1 {
          font-size: 2.2rem;
          font-weight: 900;
          letter-spacing: -0.5px;
          margin-bottom: 0.25rem;
        }

        .page-header p {
          color: var(--text-muted);
        }

        .category-horizontal-pills {
          display: flex;
          gap: 0.5rem;
          overflow-x: auto;
          padding-bottom: 0.5rem;
          white-space: nowrap;
        }

        .pill-btn {
          padding: 0.5rem 1.25rem;
          border-radius: var(--radius-full);
          border: 1px solid var(--border-color);
          background: var(--bg-card);
          color: var(--text-secondary);
          font-weight: 700;
          font-size: 0.825rem;
          transition: all 0.2s ease;
        }

        .pill-btn:hover {
          border-color: var(--accent-primary);
          color: var(--accent-primary);
        }

        .pill-btn.active {
          background: var(--accent-primary);
          color: white;
          border-color: var(--accent-primary);
          box-shadow: 0 4px 12px var(--accent-glow);
        }

        .search-filter-bar {
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 1rem;
          padding: 0.85rem 1.25rem;
          flex-wrap: wrap;
        }

        .search-form {
          display: flex;
          align-items: center;
          gap: 0.5rem;
          flex: 1;
          min-width: 280px;
          position: relative;
        }

        .search-icon {
          position: absolute;
          left: 1rem;
          color: var(--text-muted);
        }

        .search-input {
          width: 100%;
          padding: 0.6rem 1rem 0.6rem 2.75rem;
          border-radius: var(--radius-full);
          border: 1px solid var(--border-color);
          background-color: var(--bg-primary);
          color: var(--text-primary);
          outline: none;
        }

        .right-tools {
          display: flex;
          align-items: center;
          gap: 1rem;
        }

        .grid-toggle {
          display: flex;
          gap: 0.35rem;
        }

        .grid-toggle .icon-btn.active {
          background: var(--accent-primary);
          color: white;
          border-color: var(--accent-primary);
        }

        .sort-box {
          display: flex;
          align-items: center;
          gap: 0.5rem;
          color: var(--text-secondary);
        }

        .sort-select {
          padding: 0.55rem 0.85rem;
          border-radius: var(--radius-md);
          border: 1px solid var(--border-color);
          background-color: var(--bg-primary);
          color: var(--text-primary);
          outline: none;
          font-size: 0.85rem;
          font-weight: 600;
        }

        .catalog-layout {
          display: grid;
          grid-template-columns: 260px 1fr;
          gap: 1.5rem;
          align-items: start;
        }

        .filters-sidebar {
          padding: 1.25rem;
          display: flex;
          flex-direction: column;
          gap: 1.5rem;
        }

        .sidebar-header {
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding-bottom: 0.75rem;
          border-bottom: 1px solid var(--border-color);
        }

        .sidebar-title {
          font-weight: 800;
          display: flex;
          align-items: center;
          gap: 0.5rem;
        }

        .reset-btn {
          font-size: 0.75rem;
          color: var(--accent-primary);
          font-weight: 700;
          display: flex;
          align-items: center;
          gap: 0.25rem;
        }

        .filter-group h4 {
          font-size: 0.85rem;
          font-weight: 800;
          margin-bottom: 0.75rem;
          color: var(--text-secondary);
          text-transform: uppercase;
        }

        .category-list {
          display: flex;
          flex-direction: column;
          gap: 0.25rem;
        }

        .cat-pill {
          text-align: left;
          padding: 0.5rem 0.75rem;
          border-radius: var(--radius-sm);
          font-size: 0.85rem;
          font-weight: 600;
          color: var(--text-secondary);
          transition: all var(--transition-fast);
        }

        .cat-pill:hover {
          background-color: var(--bg-hover);
          color: var(--accent-primary);
        }

        .cat-pill.active {
          background-color: var(--danger-bg);
          color: var(--accent-primary);
          font-weight: 800;
        }

        .price-inputs {
          display: flex;
          align-items: center;
          gap: 0.5rem;
          font-size: 0.8rem;
          color: var(--text-muted);
        }

        .price-inputs input {
          padding: 0.4rem 0.5rem;
        }

        .results-meta {
          margin-bottom: 1rem;
          font-size: 0.85rem;
          color: var(--text-muted);
        }

        .cols-4 {
          grid-template-columns: repeat(auto-fill, minmax(230px, 1fr));
        }

        .cols-3 {
          grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
        }

        .empty-products {
          text-align: center;
          padding: 4rem 2rem;
          display: flex;
          flex-direction: column;
          align-items: center;
        }

        .empty-icon {
          color: var(--text-muted);
          margin-bottom: 1rem;
        }

        @media (max-width: 850px) {
          .catalog-layout {
            grid-template-columns: 1fr;
          }
        }
      `}</style>
    </div>
  );
};

export default Products;
