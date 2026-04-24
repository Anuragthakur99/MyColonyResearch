import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Navbar from './shared/Navbar';
import Footer from './shared/Footer';
import { Button } from './ui/button';
import { ArrowLeft, Plus, Trash2 } from 'lucide-react';
import { motion } from 'framer-motion';
import { toast } from 'sonner';
import axios from 'axios';
import { SERVICE_API_END_POINT, COLONY_API_END_POINT } from '../utils/constant';

const OfferService = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    category: '',
    price: '',
    availability: '',
    colony: ''
  });
  const [images, setImages] = useState([]);
  const [colonies, setColonies] = useState([]);
  const [menuItems, setMenuItems] = useState([{ item: '', price: '' }]);

  // Fetch colonies on component mount
  useEffect(() => {
    const fetchColonies = async () => {
      try {
        const res = await axios.get(`${COLONY_API_END_POINT}/get`);
        if (res.data.success) {
          setColonies(res.data.colonies);
        }
      } catch (error) {
        console.log('Error fetching colonies:', error);
      }
    };
    fetchColonies();
  }, []);

  const categories = [
    'Food & Tiffin',
    'Laundry',
    'Cleaning',
    'Grocery',
    'Maintenance',
    'Tutoring',
    'Pet Care',
    'Other'
  ];

  const handleInputChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.title || !formData.description || !formData.category || !formData.price || !formData.colony) {
      toast.error('Please fill all required fields including colony');
      return;
    }
    
    try {
      const submitData = new FormData();
      Object.keys(formData).forEach(key => {
        submitData.append(key, formData[key]);
      });

      // Append valid menu items as JSON string
      const validMenu = menuItems.filter(m => m.item.trim() && m.price.trim());
      if (validMenu.length > 0) {
        submitData.append('menu', JSON.stringify(validMenu));
      }
      
      images.forEach(image => {
        submitData.append('images', image);
      });
      
      const res = await axios.post(`${SERVICE_API_END_POINT}/create`, submitData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });
      
      if (res.data.success) {
        toast.success(res.data.message);
        navigate(`/colony/${formData.colony}`);
      }
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to submit service');
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      
      <div className="pt-20 pb-12">
        <div className="container mx-auto px-6 max-w-2xl">
          <div className="mb-8">
            <Button 
              variant="ghost" 
              onClick={() => navigate('/profile')}
              className="mb-4"
            >
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Profile
            </Button>
            <h1 className="text-3xl font-bold mb-2">Offer a Service</h1>
            <p className="text-muted-foreground">Share your skills with your colony neighbors</p>
          </div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <form onSubmit={handleSubmit} className="card-professional p-8 space-y-6">
              <div>
                <label className="block text-sm font-medium mb-2 text-foreground">Service Title *</label>
                <input
                  type="text"
                  name="title"
                  value={formData.title}
                  onChange={handleInputChange}
                  placeholder="e.g., Home Cooked Tiffin Service"
                  className="w-full p-3 border border-border rounded-md focus:outline-none focus:ring-2 focus:ring-primary bg-background text-foreground"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-2 text-foreground">Category *</label>
                <select
                  name="category"
                  value={formData.category}
                  onChange={handleInputChange}
                  className="w-full p-3 border border-border rounded-md focus:outline-none focus:ring-2 focus:ring-primary bg-background text-foreground"
                  required
                >
                  <option value="">Select a category</option>
                  {categories.map(category => (
                    <option key={category} value={category}>{category}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium mb-2 text-foreground">Colony *</label>
                <select
                  name="colony"
                  value={formData.colony}
                  onChange={handleInputChange}
                  className="w-full p-3 border border-border rounded-md focus:outline-none focus:ring-2 focus:ring-primary bg-background text-foreground"
                  required
                >
                  <option value="">Select a colony</option>
                  {colonies.map(colony => (
                    <option key={colony._id} value={colony._id}>{colony.name}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium mb-2 text-foreground">Description *</label>
                <textarea
                  name="description"
                  value={formData.description}
                  onChange={handleInputChange}
                  placeholder="Describe your service in detail..."
                  rows={4}
                  className="w-full p-3 border border-border rounded-md focus:outline-none focus:ring-2 focus:ring-primary bg-background text-foreground"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-2 text-foreground">Base Price *</label>
                <input
                  type="text"
                  name="price"
                  value={formData.price}
                  onChange={handleInputChange}
                  placeholder="e.g., ₹150/day or ₹50/kg"
                  className="w-full p-3 border border-border rounded-md focus:outline-none focus:ring-2 focus:ring-primary bg-background text-foreground"
                  required
                />
              </div>

              {/* Menu / Price List */}
              <div>
                <div className="flex items-center justify-between mb-2">
                  <label className="block text-sm font-medium text-foreground">Menu / Price List (Optional)</label>
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={() => setMenuItems([...menuItems, { item: '', price: '' }])}
                  >
                    <Plus className="h-3 w-3 mr-1" /> Add Item
                  </Button>
                </div>
                <div className="space-y-2">
                  {menuItems.map((m, i) => (
                    <div key={i} className="flex gap-2 items-center">
                      <input
                        type="text"
                        value={m.item}
                        onChange={e => {
                          const updated = [...menuItems];
                          updated[i].item = e.target.value;
                          setMenuItems(updated);
                        }}
                        placeholder="Item name (e.g. Dal Rice)"
                        className="flex-1 p-2.5 border border-border rounded-md focus:outline-none focus:ring-2 focus:ring-primary bg-background text-foreground text-sm"
                      />
                      <input
                        type="text"
                        value={m.price}
                        onChange={e => {
                          const updated = [...menuItems];
                          updated[i].price = e.target.value;
                          setMenuItems(updated);
                        }}
                        placeholder="Price (e.g. ₹80)"
                        className="w-32 p-2.5 border border-border rounded-md focus:outline-none focus:ring-2 focus:ring-primary bg-background text-foreground text-sm"
                      />
                      {menuItems.length > 1 && (
                        <button
                          type="button"
                          onClick={() => setMenuItems(menuItems.filter((_, idx) => idx !== i))}
                          className="text-red-500 hover:text-red-700 p-1"
                        >
                          <Trash2 className="h-4 w-4" />
                        </button>
                      )}
                    </div>
                  ))}
                </div>
                <p className="text-xs text-muted-foreground mt-1">Add individual items with their prices (e.g. for food menus, cleaning packages)</p>
              </div>

              <div>
                <label className="block text-sm font-medium mb-2 text-foreground">Availability</label>
                <input
                  type="text"
                  name="availability"
                  value={formData.availability}
                  onChange={handleInputChange}
                  placeholder="e.g., Mon-Sat, 12PM-2PM"
                  className="w-full p-3 border border-border rounded-md focus:outline-none focus:ring-2 focus:ring-primary bg-background text-foreground"
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-2 text-foreground">Service Images (Optional)</label>
                <input
                  type="file"
                  multiple
                  accept="image/*"
                  onChange={(e) => setImages(Array.from(e.target.files))}
                  className="w-full p-3 border border-border rounded-md focus:outline-none focus:ring-2 focus:ring-primary bg-background text-foreground"
                />
                <p className="text-xs text-muted-foreground mt-1">Upload up to 5 service images</p>
              </div>

              <div className="flex gap-4 pt-4">
                <Button 
                  type="button" 
                  variant="outline" 
                  onClick={() => navigate('/colony/1')}
                  className="flex-1"
                >
                  Cancel
                </Button>
                <Button 
                  type="submit" 
                  className="flex-1 btn-primary"
                >
                  <Plus className="h-4 w-4 mr-2" />
                  Submit for Approval
                </Button>
              </div>
            </form>
          </motion.div>
        </div>
      </div>

      <Footer />
    </div>
  );
};

export default OfferService;