import React, { useState, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import Navbar from './shared/Navbar';
import Footer from './shared/Footer';
import ServiceCard from './ServiceCard';
import { Button } from './ui/button';
import { ArrowLeft, Filter } from 'lucide-react';
import { motion } from 'framer-motion';
import axios from 'axios';
import { SERVICE_API_END_POINT } from '../utils/constant';

const AllServices = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const [services, setServices] = useState([]);
  const [filteredServices, setFilteredServices] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState('');
  const [searchQuery, setSearchQuery] = useState(searchParams.get('search') || '');

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

  useEffect(() => {
    const fetchServices = async () => {
      try {
        const res = await axios.get(`${SERVICE_API_END_POINT}/get`);
        if (res.data.success) {
          setServices(res.data.services);
          setFilteredServices(res.data.services);
        }
      } catch (error) {
        console.log('Error fetching services:', error);
      }
    };
    
    fetchServices();
  }, []);

  useEffect(() => {
    let filtered = services;
    
    // Filter by category
    if (selectedCategory && selectedCategory !== 'All') {
      filtered = filtered.filter(service => service.category === selectedCategory);
    }
    
    // Filter by search query
    if (searchQuery) {
      filtered = filtered.filter(service => 
        service.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        service.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
        service.category.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }
    
    setFilteredServices(filtered);
  }, [selectedCategory, services, searchQuery]);

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      
      <div className="pt-20 pb-12">
        <div className="container mx-auto px-6">
          <div className="mb-8">
            <Button 
              variant="ghost" 
              onClick={() => navigate('/')}
              className="mb-4"
            >
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Home
            </Button>
            <h1 className="text-3xl font-bold mb-2">All Services</h1>
            <p className="text-muted-foreground">Browse all services offered across colonies</p>
          </div>

          <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8">
            <div>
              <h2 className="text-xl font-semibold mb-2">Available Services ({filteredServices.length})</h2>
              {searchQuery && (
                <p className="text-muted-foreground">Showing results for "{searchQuery}"</p>
              )}
            </div>
            
            <div className="flex items-center gap-3 mt-4 md:mt-0">
              <input
                type="text"
                placeholder="Search services..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="px-3 py-2 border border-border rounded-lg bg-background"
              />
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
              <h3 className="text-2xl font-semibold mb-2">No Services Found</h3>
              <p className="text-muted-foreground">Try adjusting your filter or check back later.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredServices.map((service, index) => (
                <motion.div
                  key={service._id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.05 }}
                >
                  <ServiceCard 
                    service={service}
                    onDelete={(serviceId) => {
                      setServices(prev => prev.filter(s => s._id !== serviceId));
                      setFilteredServices(prev => prev.filter(s => s._id !== serviceId));
                    }}
                  />
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

export default AllServices;