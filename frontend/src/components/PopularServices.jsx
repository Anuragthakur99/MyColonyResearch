import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import ServiceCard from './ServiceCard';
import { Button } from './ui/button';
import { ArrowRight } from 'lucide-react';
import { motion } from 'framer-motion';
import axios from 'axios';
import { SERVICE_API_END_POINT } from '../utils/constant';

const PopularServices = () => {
  const navigate = useNavigate();
  const [services, setServices] = useState([]);

  useEffect(() => {
    const fetchServices = async () => {
      try {
        const res = await axios.get(`${SERVICE_API_END_POINT}/get`);
        if (res.data.success) {
          // Show only first 6 services
          setServices(res.data.services.slice(0, 6));
        }
      } catch (error) {
        console.log('Error fetching services:', error);
      }
    };
    
    fetchServices();
  }, []);

  return (
    <div>
      {services.length === 0 ? (
        <div className="text-center py-12">
          <h3 className="text-xl font-semibold mb-2">No Services Available</h3>
          <p className="text-muted-foreground">Services will appear here once residents start offering them.</p>
        </div>
      ) : (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8"
          >
            {services.map((service, index) => (
              <motion.div
                key={service._id}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
              >
                <ServiceCard service={service} />
              </motion.div>
            ))}
          </motion.div>
          
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center"
          >
            <Button 
              onClick={() => navigate('/all-services')} 
              className="btn-primary"
              size="lg"
            >
              View All Services
              <ArrowRight className="h-4 w-4 ml-2" />
            </Button>
          </motion.div>
        </>
      )}
    </div>
  );
};

export default PopularServices;