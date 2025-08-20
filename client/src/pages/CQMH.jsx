import { useState, useEffect } from 'react';
import { api } from '../lib/axios';
import { useAuth } from '../contexts/AuthContext';
import toast from 'react-hot-toast';
import Topbar from "../components/Topbar";
import { 
  Package, 
  Plus, 
  Edit, 
  Trash2, 
  TrendingUp, 
  TrendingDown,
  AlertTriangle,
  CheckCircle,
  Clock,
  Search,
  Filter,
  Download,
  Upload,
  BarChart3,
  Activity,
  Tag,
  Settings
} from 'lucide-react';

export default function CQMH() {
  const { user } = useAuth();
  const [inventory, setInventory] = useState([]);
  const [movements, setMovements] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showAddModal, setShowAddModal] = useState(false);
  const [showStockModal, setShowStockModal] = useState(false);
  const [showCategoryModal, setShowCategoryModal] = useState(false);
  const [editingItem, setEditingItem] = useState(null);
  const [editingCategory, setEditingCategory] = useState(null);
  const [stockAction, setStockAction] = useState('IN');
  const [searchTerm, setSearchTerm] = useState('');
  const [filterCategory, setFilterCategory] = useState('');
  const [activeTab, setActiveTab] = useState('inventory');
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    category: '',
    unit: '',
    currentStock: 0,
    minStock: 0,
    maxStock: '',
    location: '',
    supplier: '',
    cost: ''
  });
  const [categoryData, setCategoryData] = useState({
    name: '',
    description: '',
    color: '#3B82F6'
  });
  const [stockData, setStockData] = useState({
    itemId: '',
    quantity: '',
    reason: '',
    notes: ''
  });

  const units = ["Pieces", "Kgs", "Liters", "Meters", "Boxes", "Sets", "Pairs"];
  const categoryColors = [
    '#3B82F6', '#10B981', '#F59E0B', '#EF4444', '#8B5CF6', 
    '#06B6D4', '#84CC16', '#F97316', '#EC4899', '#6B7280'
  ];

  useEffect(() => {
    fetchInventory();
    fetchMovements();
    fetchCategories();
  }, []);

  const fetchInventory = async () => {
    try {
      const response = await api.get('/inventory/items');
      setInventory(response.data);
    } catch (error) {
      toast.error('Failed to fetch inventory');
    } finally {
      setLoading(false);
    }
  };

  const fetchMovements = async () => {
    try {
      const response = await api.get('/inventory/history');
      setMovements(response.data);
    } catch (error) {
      console.error('Error fetching movements:', error);
    }
  };

  const fetchCategories = async () => {
    try {
      // For now, we'll use a default set of categories
      // In a real app, you'd fetch from /inventory/categories
      const defaultCategories = [
        { _id: '1', name: 'Electronics', description: 'Electronic equipment and devices', color: '#3B82F6' },
        { _id: '2', name: 'Tools', description: 'Hand tools and equipment', color: '#10B981' },
        { _id: '3', name: 'Uniforms', description: 'Clothing and uniforms', color: '#F59E0B' },
        { _id: '4', name: 'Medical', description: 'Medical supplies and equipment', color: '#EF4444' },
        { _id: '5', name: 'Office', description: 'Office supplies and furniture', color: '#8B5CF6' },
        { _id: '6', name: 'Kitchen', description: 'Kitchen equipment and supplies', color: '#06B6D4' },
        { _id: '7', name: 'Maintenance', description: 'Maintenance tools and supplies', color: '#84CC16' },
        { _id: '8', name: 'Safety', description: 'Safety equipment and gear', color: '#F97316' },
        { _id: '9', name: 'Communication', description: 'Communication equipment', color: '#EC4899' },
        { _id: '10', name: 'Other', description: 'Miscellaneous items', color: '#6B7280' }
      ];
      setCategories(defaultCategories);
    } catch (error) {
      console.error('Error fetching categories:', error);
    }
  };

  const handleAddItem = async (e) => {
    e.preventDefault();
    try {
      await api.post('/inventory/items', formData);
      toast.success('Item added successfully');
      setShowAddModal(false);
      setFormData({
        name: '', description: '', category: '', unit: '', currentStock: 0,
        minStock: 0, maxStock: '', location: '', supplier: '', cost: ''
      });
      fetchInventory();
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to add item');
    }
  };

  const handleStockAction = async (e) => {
    e.preventDefault();
    try {
      const endpoint = stockAction === 'IN' ? '/inventory/stock-in' : '/inventory/stock-out';
      await api.post(endpoint, stockData);
      toast.success(`Stock ${stockAction === 'IN' ? 'added' : 'removed'} successfully`);
      setShowStockModal(false);
      setStockData({ itemId: '', quantity: '', reason: '', notes: '' });
      fetchInventory();
      fetchMovements();
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to process stock action');
    }
  };

  const handleDeleteItem = async (itemId) => {
    if (window.confirm('Are you sure you want to delete this item?')) {
      try {
        await api.delete(`/inventory/items/${itemId}`);
        toast.success('Item deleted successfully');
        fetchInventory();
      } catch (error) {
        toast.error('Failed to delete item');
      }
    }
  };

  const handleEditItem = async (e) => {
    e.preventDefault();
    try {
      await api.put(`/inventory/items/${editingItem._id}`, formData);
      toast.success('Item updated successfully');
      setShowAddModal(false);
      setEditingItem(null);
      setFormData({
        name: '', description: '', category: '', unit: '', currentStock: 0,
        minStock: 0, maxStock: '', location: '', supplier: '', cost: ''
      });
      fetchInventory();
    } catch (error) {
      toast.error('Failed to update item');
    }
  };

  const handleAddCategory = async (e) => {
    e.preventDefault();
    try {
      // In a real app, you'd call: await api.post('/inventory/categories', categoryData);
      const newCategory = {
        _id: Date.now().toString(),
        ...categoryData
      };
      setCategories(prev => [...prev, newCategory]);
      toast.success('Category added successfully');
      setShowCategoryModal(false);
      setCategoryData({ name: '', description: '', color: '#3B82F6' });
    } catch (error) {
      toast.error('Failed to add category');
    }
  };

  const handleEditCategory = async (e) => {
    e.preventDefault();
    try {
      // In a real app, you'd call: await api.put(`/inventory/categories/${editingCategory._id}`, categoryData);
      setCategories(prev => prev.map(cat => 
        cat._id === editingCategory._id ? { ...cat, ...categoryData } : cat
      ));
      toast.success('Category updated successfully');
      setShowCategoryModal(false);
      setEditingCategory(null);
      setCategoryData({ name: '', description: '', color: '#3B82F6' });
    } catch (error) {
      toast.error('Failed to update category');
    }
  };

  const handleDeleteCategory = async (categoryId) => {
    if (window.confirm('Are you sure you want to delete this category? Items in this category will be affected.')) {
      try {
        // In a real app, you'd call: await api.delete(`/inventory/categories/${categoryId}`);
        setCategories(prev => prev.filter(cat => cat._id !== categoryId));
        toast.success('Category deleted successfully');
      } catch (error) {
        toast.error('Failed to delete category');
      }
    }
  };

  const openEditModal = (item) => {
    setEditingItem(item);
    setFormData({
      name: item.name,
      description: item.description || '',
      category: item.category,
      unit: item.unit,
      currentStock: item.currentStock,
      minStock: item.minStock,
      maxStock: item.maxStock || '',
      location: item.location || '',
      supplier: item.supplier || '',
      cost: item.cost || ''
    });
    setShowAddModal(true);
  };

  const openEditCategoryModal = (category) => {
    setEditingCategory(category);
    setCategoryData({
      name: category.name,
      description: category.description || '',
      color: category.color
    });
    setShowCategoryModal(true);
  };

  const openStockModal = (action, itemId = '') => {
    setStockAction(action);
    setStockData({ ...stockData, itemId });
    setShowStockModal(true);
  };

  // Filter inventory based on search and category
  const filteredInventory = inventory.filter(item => 
    (item.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
     item.description?.toLowerCase().includes(searchTerm.toLowerCase()) ||
     item.category.toLowerCase().includes(searchTerm.toLowerCase())) &&
    (filterCategory === '' || item.category === filterCategory)
  );

  // Calculate statistics
  const totalItems = inventory.length;
  const lowStockItems = inventory.filter(item => item.currentStock <= item.minStock).length;
  const outOfStockItems = inventory.filter(item => item.currentStock === 0).length;
  const totalValue = inventory.reduce((sum, item) => sum + (item.cost * item.currentStock), 0);

  if (loading) {
    return (
      <div className="px-4 py-8">
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-cyan-600"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="px-4 py-6 bg-gray-50 min-h-screen">
      {/* Header */}
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-2xl font-semibold text-gray-900">Inventory Management</h1>
          <p className="text-gray-600 mt-1">Manage your organization's inventory efficiently</p>
        </div>
        <Topbar />
      </div>

      {/* Tabs */}
      <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-2 mb-8">
        <div className="flex space-x-1">
          <button
            onClick={() => setActiveTab('inventory')}
            className={`flex-1 px-4 py-3 rounded-xl font-medium transition-all duration-200 ${
              activeTab === 'inventory'
                ? 'bg-cyan-600 text-white shadow-md'
                : 'text-gray-600 hover:bg-gray-100'
            }`}
          >
            <Package className="w-5 h-5 inline mr-2" />
            Inventory
          </button>
          <button
            onClick={() => setActiveTab('categories')}
            className={`flex-1 px-4 py-3 rounded-xl font-medium transition-all duration-200 ${
              activeTab === 'categories'
                ? 'bg-cyan-600 text-white shadow-md'
                : 'text-gray-600 hover:bg-gray-100'
            }`}
          >
            <Tag className="w-5 h-5 inline mr-2" />
            Categories
          </button>
        </div>
      </div>

      {activeTab === 'inventory' ? (
        <>
          {/* Stats Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            <div className="bg-white border border-gray-200 p-6 rounded-xl shadow-sm">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-gray-500 text-sm">Total Items</p>
                  <p className="text-gray-900 text-3xl font-semibold mt-2">{totalItems}</p>
                </div>
                <Package className="w-6 h-6 text-gray-700" />
              </div>
            </div>
            
            <div className="bg-white border border-gray-200 p-6 rounded-xl shadow-sm">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-gray-500 text-sm">Total Value</p>
                  <p className="text-gray-900 text-3xl font-semibold mt-2">₹{totalValue.toLocaleString()}</p>
                </div>
                <TrendingUp className="w-6 h-6 text-gray-700" />
              </div>
            </div>
            
            <div className="bg-white border border-gray-200 p-6 rounded-xl shadow-sm">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-gray-500 text-sm">Low Stock</p>
                  <p className="text-gray-900 text-3xl font-semibold mt-2">{lowStockItems}</p>
                </div>
                <AlertTriangle className="w-6 h-6 text-gray-700" />
              </div>
            </div>
            
            <div className="bg-white border border-gray-200 p-6 rounded-xl shadow-sm">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-gray-500 text-sm">Out of Stock</p>
                  <p className="text-gray-900 text-3xl font-semibold mt-2">{outOfStockItems}</p>
                </div>
                <TrendingDown className="w-6 h-6 text-gray-700" />
              </div>
            </div>
          </div>

          {/* Controls */}
          <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-6 mb-8">
            <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between space-y-4 lg:space-y-0">
              <div className="flex flex-col sm:flex-row space-y-2 sm:space-y-0 sm:space-x-4">
                <div className="relative">
                  <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                  <input
                    type="text"
                    placeholder="Search items..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:border-cyan-500"
                  />
                </div>
                <select
                  value={filterCategory}
                  onChange={(e) => setFilterCategory(e.target.value)}
                  className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:border-cyan-500"
                >
                  <option value="">All Categories</option>
                  {categories.map(category => (
                    <option key={category._id} value={category.name}>{category.name}</option>
                  ))}
                </select>
              </div>
              
              <div className="flex space-x-3">
                <button
                  onClick={() => openStockModal('IN')}
                  className="bg-gray-900 text-white px-4 py-2 rounded-md flex items-center space-x-2 hover:bg-black/90 transition-colors"
                >
                  <TrendingUp size={16} />
                  <span>Stock In</span>
                </button>
                <button
                  onClick={() => openStockModal('OUT')}
                  className="bg-gray-800 text-white px-4 py-2 rounded-md flex items-center space-x-2 hover:bg-gray-900 transition-colors"
                >
                  <TrendingDown size={16} />
                  <span>Stock Out</span>
                </button>
                <button
                  onClick={() => setShowAddModal(true)}
                  className="bg-gray-700 text-white px-4 py-2 rounded-md flex items-center space-x-2 hover:bg-gray-800 transition-colors"
                >
                  <Plus size={16} />
                  <span>Add Item</span>
                </button>
              </div>
            </div>
          </div>

          {/* Inventory Table */}
          <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Item Details
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Stock
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Category
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Location
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {filteredInventory.map((item) => (
                    <tr key={item._id} className="hover:bg-gray-50">
                      <td className="px-6 py-4">
                        <div>
                          <div className="text-sm font-medium text-gray-900">{item.name}</div>
                          <div className="text-sm text-gray-500">{item.description}</div>
                          <div className="text-xs text-gray-400">Unit: {item.unit}</div>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center space-x-2">
                          <span className={`text-sm font-medium ${
                            item.currentStock === 0 ? 'text-red-600' :
                            item.currentStock <= item.minStock ? 'text-orange-600' : 'text-green-600'
                          }`}>
                            {item.currentStock}
                          </span>
                          <span className="text-gray-400">/</span>
                          <span className="text-sm text-gray-600">{item.maxStock || '∞'}</span>
                        </div>
                        {item.currentStock <= item.minStock && (
                          <div className="text-xs text-orange-600 mt-1">Low Stock Alert</div>
                        )}
                      </td>
                      <td className="px-6 py-4">
                        <span className="inline-flex px-2 py-1 text-xs font-medium bg-blue-100 text-blue-800 rounded-full">
                          {item.category}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-900">{item.location || 'N/A'}</td>
                      <td className="px-6 py-4 text-sm font-medium space-x-2">
                        <button
                          onClick={() => openStockModal('IN', item._id)}
                          className="text-green-600 hover:text-green-900"
                        >
                          <TrendingUp size={16} />
                        </button>
                        <button
                          onClick={() => openStockModal('OUT', item._id)}
                          className="text-red-600 hover:text-red-900"
                        >
                          <TrendingDown size={16} />
                        </button>
                        <button
                          onClick={() => openEditModal(item)}
                          className="text-blue-600 hover:text-blue-900"
                        >
                          <Edit size={16} />
                        </button>
                        <button
                          onClick={() => handleDeleteItem(item._id)}
                          className="text-red-600 hover:text-red-900"
                        >
                          <Trash2 size={16} />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </>
      ) : (
        <>
          {/* Categories Management */}
          <div className="bg-white rounded-2xl shadow-lg p-6 mb-8">
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-xl font-semibold text-gray-900">Category Management</h3>
              <button
                onClick={() => setShowCategoryModal(true)}
                className="bg-cyan-600 text-white px-4 py-2 rounded-lg flex items-center space-x-2 hover:bg-cyan-700 transition-colors"
              >
                <Plus size={16} />
                <span>Add Category</span>
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {categories.map((category) => (
                <div key={category._id} className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow">
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center space-x-2">
                      <div 
                        className="w-4 h-4 rounded-full"
                        style={{ backgroundColor: category.color }}
                      ></div>
                      <h4 className="font-medium text-gray-900">{category.name}</h4>
                    </div>
                    <div className="flex space-x-2">
                      <button
                        onClick={() => openEditCategoryModal(category)}
                        className="text-blue-600 hover:text-blue-800 p-1"
                      >
                        <Edit size={14} />
                      </button>
                      <button
                        onClick={() => handleDeleteCategory(category._id)}
                        className="text-red-600 hover:text-red-800 p-1"
                      >
                        <Trash2 size={14} />
                      </button>
                    </div>
                  </div>
                  <p className="text-sm text-gray-600">{category.description}</p>
                  <div className="mt-3 text-xs text-gray-500">
                    Items: {inventory.filter(item => item.category === category.name).length}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </>
      )}

      {/* Add/Edit Item Modal */}
      {showAddModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-2xl max-h-[90vh] overflow-y-auto">
            <h2 className="text-xl font-semibold mb-4">
              {editingItem ? 'Edit Item' : 'Add New Item'}
            </h2>
            <form onSubmit={editingItem ? handleEditItem : handleAddItem} className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700">Name *</label>
                  <input
                    type="text"
                    required
                    value={formData.name}
                    onChange={(e) => setFormData({...formData, name: e.target.value})}
                    className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-cyan-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">Category *</label>
                  <select
                    required
                    value={formData.category}
                    onChange={(e) => setFormData({...formData, category: e.target.value})}
                    className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-cyan-500"
                  >
                    <option value="">Select category</option>
                    {categories.map(category => (
                      <option key={category._id} value={category.name}>{category.name}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">Unit *</label>
                  <select
                    required
                    value={formData.unit}
                    onChange={(e) => setFormData({...formData, unit: e.target.value})}
                    className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-cyan-500"
                  >
                    <option value="">Select unit</option>
                    {units.map(unit => (
                      <option key={unit} value={unit}>{unit}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">Current Stock</label>
                  <input
                    type="number"
                    value={formData.currentStock}
                    onChange={(e) => setFormData({...formData, currentStock: parseInt(e.target.value) || 0})}
                    className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-cyan-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">Min Stock</label>
                  <input
                    type="number"
                    value={formData.minStock}
                    onChange={(e) => setFormData({...formData, minStock: parseInt(e.target.value) || 0})}
                    className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-cyan-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">Max Stock</label>
                  <input
                    type="number"
                    value={formData.maxStock}
                    onChange={(e) => setFormData({...formData, maxStock: e.target.value})}
                    className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-cyan-500"
                    placeholder="Optional"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">Location</label>
                  <input
                    type="text"
                    value={formData.location}
                    onChange={(e) => setFormData({...formData, location: e.target.value})}
                    className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-cyan-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">Supplier</label>
                  <input
                    type="text"
                    value={formData.supplier}
                    onChange={(e) => setFormData({...formData, supplier: e.target.value})}
                    className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-cyan-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">Cost (₹)</label>
                  <input
                    type="number"
                    step="0.01"
                    value={formData.cost}
                    onChange={(e) => setFormData({...formData, cost: e.target.value})}
                    className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-cyan-500"
                  />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Description</label>
                <textarea
                  value={formData.description}
                  onChange={(e) => setFormData({...formData, description: e.target.value})}
                  rows={3}
                  className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-cyan-500"
                />
              </div>
              <div className="flex space-x-3 pt-4">
                <button
                  type="submit"
                  className="flex-1 bg-cyan-600 text-white py-2 px-4 rounded-md hover:bg-cyan-700"
                >
                  {editingItem ? 'Update Item' : 'Add Item'}
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setShowAddModal(false);
                    setEditingItem(null);
                    setFormData({
                      name: '', description: '', category: '', unit: '', currentStock: 0,
                      minStock: 0, maxStock: '', location: '', supplier: '', cost: ''
                    });
                  }}
                  className="flex-1 bg-gray-300 text-gray-700 py-2 px-4 rounded-md hover:bg-gray-400"
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Category Modal */}
      {showCategoryModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-md">
            <h2 className="text-xl font-semibold mb-4">
              {editingCategory ? 'Edit Category' : 'Add New Category'}
            </h2>
            <form onSubmit={editingCategory ? handleEditCategory : handleAddCategory} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700">Name *</label>
                <input
                  type="text"
                  required
                  value={categoryData.name}
                  onChange={(e) => setCategoryData({...categoryData, name: e.target.value})}
                  className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-cyan-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Description</label>
                <textarea
                  value={categoryData.description}
                  onChange={(e) => setCategoryData({...categoryData, description: e.target.value})}
                  rows={3}
                  className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-cyan-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Color</label>
                <div className="grid grid-cols-5 gap-2 mt-2">
                  {categoryColors.map((color) => (
                    <button
                      key={color}
                      type="button"
                      onClick={() => setCategoryData({...categoryData, color})}
                      className={`w-8 h-8 rounded-full border-2 ${
                        categoryData.color === color ? 'border-gray-800' : 'border-gray-300'
                      }`}
                      style={{ backgroundColor: color }}
                    ></button>
                  ))}
                </div>
              </div>
              <div className="flex space-x-3 pt-4">
                <button
                  type="submit"
                  className="flex-1 bg-cyan-600 text-white py-2 px-4 rounded-md hover:bg-cyan-700"
                >
                  {editingCategory ? 'Update Category' : 'Add Category'}
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setShowCategoryModal(false);
                    setEditingCategory(null);
                    setCategoryData({ name: '', description: '', color: '#3B82F6' });
                  }}
                  className="flex-1 bg-gray-300 text-gray-700 py-2 px-4 rounded-md hover:bg-gray-400"
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Stock Action Modal */}
      {showStockModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-md">
            <h2 className="text-xl font-semibold mb-4">
              Stock {stockAction === 'IN' ? 'In' : 'Out'}
            </h2>
            <form onSubmit={handleStockAction} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700">Item</label>
                <select
                  required
                  value={stockData.itemId}
                  onChange={(e) => setStockData({...stockData, itemId: e.target.value})}
                  className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-cyan-500"
                >
                  <option value="">Select item</option>
                  {inventory.map(item => (
                    <option key={item._id} value={item._id}>
                      {item.name} (Current: {item.currentStock} {item.unit})
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Quantity *</label>
                <input
                  type="number"
                  required
                  value={stockData.quantity}
                  onChange={(e) => setStockData({...stockData, quantity: e.target.value})}
                  className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-cyan-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Reason *</label>
                <input
                  type="text"
                  required
                  value={stockData.reason}
                  onChange={(e) => setStockData({...stockData, reason: e.target.value})}
                  className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-cyan-500"
                  placeholder={stockAction === 'IN' ? 'e.g., New purchase, Return' : 'e.g., Issue, Damage, Transfer'}
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Notes</label>
                <textarea
                  value={stockData.notes}
                  onChange={(e) => setStockData({...stockData, notes: e.target.value})}
                  rows={2}
                  className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-cyan-500"
                />
              </div>
              <div className="flex space-x-3 pt-4">
                <button
                  type="submit"
                  className={`flex-1 text-white py-2 px-4 rounded-md ${
                    stockAction === 'IN' 
                      ? 'bg-green-600 hover:bg-green-700' 
                      : 'bg-red-600 hover:bg-red-700'
                  }`}
                >
                  {stockAction === 'IN' ? 'Add Stock' : 'Remove Stock'}
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setShowStockModal(false);
                    setStockData({ itemId: '', quantity: '', reason: '', notes: '' });
                  }}
                  className="flex-1 bg-gray-300 text-gray-700 py-2 px-4 rounded-md hover:bg-gray-400"
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
