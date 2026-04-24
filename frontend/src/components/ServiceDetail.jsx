import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import Navbar from './shared/Navbar';
import Footer from './shared/Footer';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { Star, Phone, MapPin, Clock, User, Mail, ArrowLeft } from 'lucide-react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { SERVICE_API_END_POINT } from '../utils/constant';

const ServiceDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [service, setService] = useState(null);

  useEffect(() => {
    const fetchService = async () => {
      try {
        const res = await axios.get(`${SERVICE_API_END_POINT}/get/${id}`);
        if (res.data.success) {
          setService(res.data.service);
        }
      } catch (error) {
        console.log('Error fetching service:', error);
      }
    };
    
    fetchService();
  }, [id]);

  if (!service) {
    return <div>Loading...</div>;
  }

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
          <Button 
            variant="ghost" 
            onClick={() => navigate(-1)}
            className="mb-6"
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back
          </Button>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Service Details */}
            <div className="lg:col-span-2 space-y-6">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="card-professional p-6"
              >
                <div className="flex items-start gap-4 mb-6">
                  <div className="w-16 h-16 bg-primary/10 rounded-lg flex items-center justify-center text-3xl">
                    {getCategoryIcon(service.category)}
                  </div>
                  <div className="flex-1">
                    <h1 className="text-3xl font-bold mb-2">{service.title}</h1>
                    <div className="flex items-center gap-4 mb-2">
                      <Badge variant="secondary">{service.category}</Badge>
                      {service.rating > 0 && (
                        <div className="flex items-center gap-1">
                          <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                          <span className="font-medium">{service.rating}</span>
                          <span className="text-muted-foreground">({service.reviews?.length || 0} reviews)</span>
                        </div>
                      )}
                    </div>
                    <div className="text-2xl font-bold text-primary">{service.price}</div>
                  </div>
                </div>

                {/* Service Images */}
                {service.images && service.images.length > 0 && (
                  <div className="mb-6">
                    <h3 className="font-semibold mb-3">Service Images</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {service.images.map((image, index) => (
                        <div key={index} className="aspect-video bg-muted rounded-lg overflow-hidden">
                          <img 
                            src={image} 
                            alt={`${service.title} - Image ${index + 1}`}
                            className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
                          />
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                <div className="space-y-4">
                  <div>
                    <h3 className="font-semibold mb-2">Description</h3>
                    <p className="text-muted-foreground leading-relaxed">{service.description}</p>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="flex items-center gap-2">
                      <Clock className="h-4 w-4 text-primary" />
                      <span className="text-sm">{service.availability}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <MapPin className="h-4 w-4 text-primary" />
                      <span className="text-sm">{service.colony?.name}</span>
                    </div>
                  </div>

                  {service.menu && service.menu.length > 0 && (
                    <div>
                      <h3 className="font-semibold mb-3">Menu</h3>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                        {service.menu.map((item, index) => (
                          <div key={index} className="flex justify-between items-center p-3 bg-muted/50 rounded-lg">
                            <span>{item.item}</span>
                            <span className="font-medium text-primary">{item.price}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              </motion.div>

              {/* Reviews */}
              {service.reviews && service.reviews.length > 0 && (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.1 }}
                  className="card-professional p-6"
                >
                  <h3 className="font-semibold mb-4">Reviews</h3>
                  <div className="space-y-4">
                    {service.reviews.map((review, index) => (
                      <div key={index} className="border-b border-border pb-4 last:border-0">
                        <div className="flex items-center gap-2 mb-2">
                          <span className="font-medium">{review.user.fullname}</span>
                          <div className="flex items-center">
                            {[...Array(5)].map((_, i) => (
                              <Star
                                key={i}
                                className={`h-3 w-3 ${
                                  i < review.rating ? 'fill-yellow-400 text-yellow-400' : 'text-gray-300'
                                }`}
                              />
                            ))}
                          </div>
                        </div>
                        <p className="text-muted-foreground text-sm">{review.comment}</p>
                      </div>
                    ))}
                  </div>
                </motion.div>
              )}
            </div>

            {/* Provider Info */}
            <div className="space-y-6">
              <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                className="card-professional p-6"
              >
                <h3 className="font-semibold mb-4">Service Provider</h3>
                <div className="space-y-4">
                  <div className="flex items-center gap-3">
                    <User className="h-5 w-5 text-primary" />
                    <div>
                      <div className="font-medium">{service.serviceProvider?.fullname}</div>
                      <div className="text-sm text-muted-foreground">
                        {service.serviceProvider?.profile?.address && service.serviceProvider?.profile?.flatNumber 
                          ? `${service.serviceProvider.profile.flatNumber}, ${service.serviceProvider.profile.address}`
                          : service.serviceProvider?.profile?.address || service.serviceProvider?.profile?.flatNumber || 'Address not provided'
                        }
                      </div>
                    </div>
                  </div>
                  
                  {service.serviceProvider.profile?.bio && (
                    <p className="text-sm text-muted-foreground">{service.serviceProvider.profile.bio}</p>
                  )}

                  <div className="space-y-2">
                    <Button className="w-full btn-primary">
                      <Phone className="h-4 w-4 mr-2" />
                      Call Now
                    </Button>
                    <Button variant="outline" className="w-full">
                      <Mail className="h-4 w-4 mr-2" />
                      Send Message
                    </Button>
                  </div>
                </div>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.1 }}
                className="card-professional p-6"
              >
                <h3 className="font-semibold mb-4">Location</h3>
                <div className="space-y-2">
                  <div className="flex items-center gap-2">
                    <MapPin className="h-4 w-4 text-primary" />
                    <span className="text-sm">{service.colony.name}</span>
                  </div>
                  <div className="text-sm text-muted-foreground">{service.colony?.address || 'Address not provided'}</div>
                </div>
              </motion.div>
            </div>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
};

export default ServiceDetail;