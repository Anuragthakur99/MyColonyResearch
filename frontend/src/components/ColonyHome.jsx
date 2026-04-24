import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import Navbar from './shared/Navbar';
import Footer from './shared/Footer';
import ServiceCard from './ServiceCard';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { MapPin, Users, Home, Plus, Filter } from 'lucide-react';
import { motion } from 'framer-motion';
import axios from 'axios';
import { COLONY_API_END_POINT, SERVICE_API_END_POINT } from '../utils/constant';

const ColonyHome = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [colony, setColony] = useState(null);
  const [services, setServices] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState('');

  const categories = [
    'All',
    'Food & Tiffin',
    'Laundry', 
    'Cleaning',
    'Grocery',
    'Maintenance',
    'Tutoring',
    'Pet Care',
    'Other'
  ];

  // Fetch colony details and services from API
  useEffect(() => {
    const fetchColonyData = async () => {
      try {
        // Fetch colony details
        const colonyRes = await axios.get(`${COLONY_API_END_POINT}/get/${id}`);
        if (colonyRes.data.success) {
          setColony(colonyRes.data.colony);
        }
        
        // Fetch approved services for this colony
        console.log('Fetching services for colony ID:', id);
        const servicesRes = await axios.get(`${SERVICE_API_END_POINT}/get?colony=${id}`);
        if (servicesRes.data.success) {
          console.log('Fetched services for colony:', servicesRes.data.services);
          setServices(servicesRes.data.services);
        } else {
          console.log('Failed to fetch services:', servicesRes.data);
        }
      } catch (error) {
        console.log('Error fetching data:', error);
        // Fallback to mock data if API fails
        setColony({
          _id: id,
          name: 'Green Valley Residency',
          description: 'A premium residential colony with modern amenities.',
          address: 'Sector 45, Gurgaon',
          city: 'Gurgaon',
          totalFlats: 120,
          amenities: ['Swimming Pool', 'Gym', 'Garden', 'Security']
        });
        setServices([]);
      }
    };
    
    fetchColonyData();
  }, [id]);

  const filteredServices = selectedCategory === '' || selectedCategory === 'All' 
    ? services 
    : services.filter(service => service.category === selectedCategory);

  if (!colony) {
    return <div>Loading...</div>;
  }

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      
      {/* Colony Header */}
      <section className="pt-20 pb-12 bg-gradient-to-br from-primary/5 to-secondary/5">
        <div className="container mx-auto px-6">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="max-w-4xl mx-auto text-center"
          >
            <h1 className="text-4xl md:text-5xl font-bold mb-4">
              {colony.name}
            </h1>
            <p className="text-lg text-muted-foreground mb-6">
              {colony.description}
            </p>
            
            <div className="flex flex-wrap justify-center gap-6 mb-8">
              <div className="flex items-center gap-2">
                <MapPin className="h-5 w-5 text-primary" />
                <span>{colony.address}</span>
              </div>
              <div className="flex items-center gap-2">
                <Home className="h-5 w-5 text-primary" />
                <span>{colony.totalFlats} Flats</span>
              </div>
              <div className="flex items-center gap-2">
                <Users className="h-5 w-5 text-primary" />
                <span>Active Community</span>
              </div>
            </div>
            
            {colony.amenities && (
              <div className="flex flex-wrap justify-center gap-2 mb-8">
                {colony.amenities.map((amenity, index) => (
                  <Badge key={index} variant="secondary">
                    {amenity}
                  </Badge>
                ))}
              </div>
            )}
            
            <Button className="btn-primary" onClick={() => navigate('/offer-service')}>
              <Plus className="h-4 w-4 mr-2" />
              Offer Your Service
            </Button>
          </motion.div>
        </div>
      </section>

      {/* Services Section */}
      <section className="py-12">
        <div className="container mx-auto px-6">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8">
            <div>
              <h2 className="text-3xl font-bold mb-2">Available Services</h2>
              <p className="text-muted-foreground">
                Discover services offered by your neighbors
              </p>
            </div>
            
            {/* Category Filter */}
            <div className="flex items-center gap-2 mt-4 md:mt-0">
              <Filter className="h-4 w-4 text-muted-foreground" />
              <select
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
                className="px-3 py-2 border border-border rounded-lg bg-background"
              >
                {categories.map(category => (
                  <option key={category} value={category === 'All' ? '' : category}>
                    {category}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {filteredServices.length === 0 ? (
            <div className="text-center py-12">
              <div className="w-24 h-24 mx-auto mb-6 rounded-full bg-muted flex items-center justify-center">
                <Plus className="h-12 w-12 text-muted-foreground" />
              </div>
              <h3 className="text-2xl font-semibold mb-2">No Services Available</h3>
              <p className="text-muted-foreground mb-6">
                Be the first to offer services in this category!
              </p>
              <Button className="btn-primary" onClick={() => navigate('/offer-service')}>
                <Plus className="h-4 w-4 mr-2" />
                Add Your Service
              </Button>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredServices.map((service, index) => (
                <motion.div
                  key={service._id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                >
                  <ServiceCard 
                    service={service} 
                    onDelete={(serviceId) => setServices(prev => prev.filter(s => s._id !== serviceId))}
                  />
                </motion.div>
              ))}
            </div>
          )}
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default ColonyHome;