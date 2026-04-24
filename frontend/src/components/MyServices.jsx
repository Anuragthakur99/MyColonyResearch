import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Navbar from './shared/Navbar';
import Footer from './shared/Footer';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { Plus, ArrowLeft, Settings, Trash2, Edit } from 'lucide-react';
import { motion } from 'framer-motion';
import axios from 'axios';
import { SERVICE_API_END_POINT } from '../utils/constant';

const MyServices = () => {
  const navigate = useNavigate();
  const [myServices, setMyServices] = useState([]);
  const [editingService, setEditingService] = useState(null);
  const [editForm, setEditForm] = useState({
    title: '',
    description: '',
    category: '',
    price: '',
    availability: ''
  });
  const [editImages, setEditImages] = useState([]);

  const categories = [
    'Food & Tiffin', 'Laundry', 'Cleaning', 'Grocery', 
    'Maintenance', 'Tutoring', 'Pet Care', 'Other'
  ];

  const handleEdit = (service) => {
    setEditingService(service._id);
    setEditForm({
      title: service.title,
      description: service.description,
      category: service.category,
      price: service.price,
      availability: service.availability || ''
    });
  };

  const handleUpdate = async (serviceId) => {
    try {
      const formData = new FormData();
      Object.keys(editForm).forEach(key => {
        formData.append(key, editForm[key]);
      });
      
      editImages.forEach(image => {
        formData.append('images', image);
      });
      
      const res = await axios.put(`${SERVICE_API_END_POINT}/update/${serviceId}`, formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
        withCredentials: true
      });
      if (res.data.success) {
        setMyServices(prev => prev.map(service => 
          service._id === serviceId ? { ...service, ...editForm, isApproved: false } : service
        ));
        setEditingService(null);
        setEditImages([]);
        toast.success('Service updated successfully!');
      }
    } catch (error) {
      toast.error('Failed to update service');
    }
  };

  const handleDelete = async (serviceId) => {
    if (window.confirm('Are you sure you want to delete this service?')) {
      try {
        const res = await axios.delete(`${SERVICE_API_END_POINT}/delete/${serviceId}`, {
          withCredentials: true
        });
        if (res.data.success) {
          setMyServices(prev => prev.filter(service => service._id !== serviceId));
          toast.success('Service deleted successfully!');
        }
      } catch (error) {
        toast.error('Failed to delete service');
      }
    }
  };

  useEffect(() => {
    const fetchMyServices = async () => {
      try {
        const res = await axios.get(`${SERVICE_API_END_POINT}/my-services`, {
          withCredentials: true
        });
        if (res.data.success) {
          setMyServices(res.data.services);
        }
      } catch (error) {
        console.log('Error fetching services:', error);
      }
    };
    fetchMyServices();
  }, []);

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      
      <div className="pt-20 pb-12">
        <div className="container mx-auto px-6">
          <div className="mb-8">
            <Button 
              variant="ghost" 
              onClick={() => navigate('/profile')}
              className="mb-4"
            >
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Profile
            </Button>
            <h1 className="text-3xl font-bold mb-2">My Services</h1>
            <p className="text-muted-foreground">Manage your offered services</p>
          </div>

          {myServices.length === 0 ? (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-center py-12"
            >
              <div className="w-24 h-24 mx-auto mb-6 rounded-full bg-muted flex items-center justify-center">
                <Settings className="h-12 w-12 text-muted-foreground" />
              </div>
              <h3 className="text-2xl font-semibold mb-2">No Services Yet</h3>
              <p className="text-muted-foreground mb-6">Start offering services to your colony neighbors</p>
              <Button onClick={() => navigate('/offer-service')} className="btn-primary">
                <Plus className="h-4 w-4 mr-2" />
                Offer Your First Service
              </Button>
            </motion.div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {myServices.map((service, index) => (
                <motion.div
                  key={service._id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                  className="card-professional p-6"
                >
                  <div className="flex justify-between items-start mb-4">
                    <h3 className="text-lg font-bold">{service.title}</h3>
                    <Badge variant={service.isApproved ? 'default' : 'secondary'}>
                      {service.isApproved ? 'Approved' : 'Pending'}
                    </Badge>
                  </div>
                  
                  <p className="text-muted-foreground text-sm mb-4 line-clamp-2">
                    {service.description}
                  </p>
                  
                  <div className="space-y-2 mb-4">
                    <div className="flex justify-between">
                      <span className="font-medium">Price:</span>
                      <span className="text-primary font-semibold">{service.price}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="font-medium">Category:</span>
                      <Badge variant="outline">{service.category}</Badge>
                    </div>
                  </div>
                  
                  {editingService === service._id ? (
                    <div className="space-y-3">
                      <input
                        type="text"
                        value={editForm.title}
                        onChange={(e) => setEditForm({...editForm, title: e.target.value})}
                        className="w-full p-2 border rounded text-foreground bg-background"
                        placeholder="Service title"
                      />
                      <textarea
                        value={editForm.description}
                        onChange={(e) => setEditForm({...editForm, description: e.target.value})}
                        className="w-full p-2 border rounded text-foreground bg-background"
                        rows={2}
                        placeholder="Description"
                      />
                      <div className="grid grid-cols-2 gap-2">
                        <select
                          value={editForm.category}
                          onChange={(e) => setEditForm({...editForm, category: e.target.value})}
                          className="p-2 border rounded text-foreground bg-background"
                        >
                          {categories.map(cat => (
                            <option key={cat} value={cat}>{cat}</option>
                          ))}
                        </select>
                        <input
                          type="text"
                          value={editForm.price}
                          onChange={(e) => setEditForm({...editForm, price: e.target.value})}
                          className="p-2 border rounded text-foreground bg-background"
                          placeholder="Price"
                        />
                      </div>
                      <input
                        type="file"
                        multiple
                        accept="image/*"
                        onChange={(e) => setEditImages(Array.from(e.target.files))}
                        className="w-full p-2 border rounded text-foreground bg-background"
                      />
                      <div className="flex gap-2">
                        <Button size="sm" onClick={() => handleUpdate(service._id)}>
                          Save
                        </Button>
                        <Button variant="outline" size="sm" onClick={() => setEditingService(null)}>
                          Cancel
                        </Button>
                      </div>
                    </div>
                  ) : (
                    <div className="flex gap-2">
                      <Button 
                        variant="outline" 
                        className="flex-1" 
                        size="sm"
                        onClick={() => handleEdit(service)}
                      >
                        <Edit className="h-4 w-4 mr-2" />
                        Edit Service
                      </Button>
                      <Button 
                        variant="outline" 
                        size="sm" 
                        className="px-3 border-red-200 text-red-600 hover:bg-red-50"
                        onClick={() => handleDelete(service._id)}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  )}
                </motion.div>
              ))}
              
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: myServices.length * 0.1 }}
                className="card-professional p-6 flex items-center justify-center border-dashed"
              >
                <div className="text-center">
                  <Plus className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
                  <Button onClick={() => navigate('/offer-service')} className="btn-primary">
                    Add New Service
                  </Button>
                </div>
              </motion.div>
            </div>
          )}
        </div>
      </div>

      <Footer />
    </div>
  );
};

export default MyServices;