import React, { useState } from 'react';
import Navbar from '../shared/Navbar';
import Footer from '../shared/Footer';
import { Button } from '../ui/button';
import { Badge } from '../ui/badge';
import { Check, X, Clock, User, MapPin, Trash2 } from 'lucide-react';
import { motion } from 'framer-motion';
import { toast } from 'sonner';
import axios from 'axios';
import { SERVICE_API_END_POINT } from '../../utils/constant';

const ApproveServices = () => {
  const [pendingServices, setPendingServices] = useState([]);
  
  // Fetch pending services from API
  const fetchPendingServices = async () => {
    try {
      const res = await axios.get(`${SERVICE_API_END_POINT}/pending`, {
        withCredentials: true
      });
      if (res.data.success) {
        setPendingServices(res.data.services);
      }
    } catch (error) {
      console.log('Error fetching services:', error);
    }
  };
  
  React.useEffect(() => {
    fetchPendingServices();
  }, []);
  


  const handleApprove = async (serviceId) => {
    try {
      const res = await axios.put(`${SERVICE_API_END_POINT}/approve/${serviceId}`, {}, {
        withCredentials: true
      });
      if (res.data.success) {
        setPendingServices(prev => prev.filter(service => service._id !== serviceId));
        toast.success('Service approved successfully!');
      }
    } catch (error) {
      toast.error('Failed to approve service');
    }
  };

  const handleReject = async (serviceId) => {
    if (window.confirm('Are you sure you want to reject this service?')) {
      try {
        const res = await axios.delete(`${SERVICE_API_END_POINT}/reject/${serviceId}`, {
          withCredentials: true
        });
        if (res.data.success) {
          setPendingServices(prev => prev.filter(service => service._id !== serviceId));
          toast.success('Service rejected and removed');
        }
      } catch (error) {
        toast.error('Failed to reject service');
      }
    }
  };

  const handleDelete = async (serviceId) => {
    if (window.confirm('Are you sure you want to delete this service permanently?')) {
      try {
        const res = await axios.delete(`${SERVICE_API_END_POINT}/delete/${serviceId}`, {
          withCredentials: true
        });
        if (res.data.success) {
          setPendingServices(prev => prev.filter(service => service._id !== serviceId));
          toast.success('Service deleted successfully!');
        }
      } catch (error) {
        toast.error('Failed to delete service');
      }
    }
  };

  const getCategoryIcon = (category) => {
    const icons = {
      'Food & Tiffin': '🍽️',
      'Laundry': '👕',
      'Cleaning': '🧹',
      'Grocery': '🛒',
      'Maintenance': '🔧',
      'Tutoring': '📚',
      'Pet Care': '🐕',
      'Other': '⚡'
    };
    return icons[category] || '⚡';
  };

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      
      <div className="pt-20 pb-12">
        <div className="container mx-auto px-6">
          <div className="mb-8">
            <h1 className="text-3xl font-bold mb-2">Approve Services</h1>
            <p className="text-muted-foreground">Review and approve pending service requests</p>
          </div>

          {pendingServices.length === 0 ? (
            <div className="text-center py-12">
              <div className="w-24 h-24 mx-auto mb-6 rounded-full bg-muted flex items-center justify-center">
                <Check className="h-12 w-12 text-muted-foreground" />
              </div>
              <h3 className="text-2xl font-semibold mb-2">All Caught Up!</h3>
              <p className="text-muted-foreground">No pending services to approve</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {pendingServices.map((service, index) => (
                <motion.div
                  key={service._id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                  className="card-professional p-6"
                >
                  <div className="flex items-start gap-4 mb-4">
                    <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center text-2xl">
                      {getCategoryIcon(service.category)}
                    </div>
                    <div className="flex-1">
                      <h3 className="text-lg font-bold mb-1">{service.title}</h3>
                      <Badge variant="secondary" className="mb-2">
                        {service.category}
                      </Badge>
                      <div className="flex items-center gap-2 text-sm text-muted-foreground">
                        <Clock className="h-3 w-3" />
                        <span>Pending Approval</span>
                      </div>
                    </div>
                  </div>

                  <p className="text-muted-foreground text-sm mb-4 line-clamp-2">
                    {service.description}
                  </p>

                  <div className="space-y-2 mb-4">
                    <div className="flex justify-between text-sm">
                      <span className="font-medium">Price:</span>
                      <span className="text-primary font-semibold">{service.price}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="font-medium">Availability:</span>
                      <span>{service.availability}</span>
                    </div>
                  </div>

                  {/* Service Images */}
                  {service.images && service.images.length > 0 && (
                    <div className="mb-4">
                      <p className="text-sm font-medium mb-2">Service Images:</p>
                      <div className="grid grid-cols-2 gap-2">
                        {service.images.slice(0, 4).map((image, index) => (
                          <div key={index} className="aspect-square bg-muted rounded overflow-hidden">
                            <img 
                              src={image} 
                              alt={`Service ${index + 1}`}
                              className="w-full h-full object-cover"
                            />
                          </div>
                        ))}
                      </div>
                      {service.images.length > 4 && (
                        <p className="text-xs text-muted-foreground mt-1">+{service.images.length - 4} more images</p>
                      )}
                    </div>
                  )}

                  <div className="border-t border-border pt-4 mb-4">
                    <div className="flex items-center gap-2 mb-2">
                      <User className="h-4 w-4 text-primary" />
                      <span className="font-medium">{service.serviceProvider?.fullname || 'Unknown Provider'}</span>
                    </div>
                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                      <MapPin className="h-4 w-4" />
                      <span>{service.colony?.name || 'Unknown Colony'} - {service.serviceProvider?.profile?.flatNumber || 'N/A'}</span>
                    </div>
                  </div>

                  <div className="flex gap-2">
                    <Button 
                      className="flex-1 bg-green-600 hover:bg-green-700 text-white"
                      onClick={() => handleApprove(service._id)}
                    >
                      <Check className="h-4 w-4 mr-2" />
                      Approve
                    </Button>
                    <Button 
                      variant="outline" 
                      className="flex-1 border-red-200 text-red-600 hover:bg-red-50"
                      onClick={() => handleReject(service._id)}
                    >
                      <X className="h-4 w-4 mr-2" />
                      Reject
                    </Button>
                    <Button 
                      variant="outline" 
                      size="sm"
                      className="border-red-200 text-red-600 hover:bg-red-50"
                      onClick={() => handleDelete(service._id)}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </motion.div>
              ))}
            </div>
          )}
        </div>
      </div>

      <Footer />
    </div>
  );
};

export default ApproveServices;