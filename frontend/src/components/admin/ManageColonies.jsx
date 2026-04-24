import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Navbar from '../shared/Navbar';
import Footer from '../shared/Footer';
import { Button } from '../ui/button';
import { Badge } from '../ui/badge';
import { Plus, Edit, Trash2, Users, Home } from 'lucide-react';
import { motion } from 'framer-motion';
import { toast } from 'sonner';
import axios from 'axios';
import { COLONY_API_END_POINT } from '../../utils/constant';

const ManageColonies = () => {
  const navigate = useNavigate();
  const [colonies, setColonies] = useState([]);
  
  // Fetch colonies from API
  const fetchColonies = async () => {
    try {
      const res = await axios.get(`${COLONY_API_END_POINT}/get`);
      if (res.data.success) {
        setColonies(res.data.colonies);
      }
    } catch (error) {
      console.log('Error fetching colonies:', error);
      // Fallback to mock data
      setColonies([
    {
      _id: '1',
      name: 'Green Valley Residency',
      description: 'A premium residential colony with modern amenities.',
      address: 'Sector 45, Gurgaon',
      city: 'Gurgaon',
      totalFlats: 120,
      amenities: ['Swimming Pool', 'Gym', 'Garden', 'Security']
    },
    {
      _id: '2',
      name: 'Sunrise Apartments',
      description: 'Affordable housing with all basic amenities.',
      address: 'Sector 62, Noida',
      city: 'Noida',
      totalFlats: 80,
      amenities: ['Parking', 'Security', 'Garden']
    }
      ]);
    }
  };
  
  useEffect(() => {
    fetchColonies();
  }, []);

  const handleAddColony = () => {
    navigate('/admin/add-colony');
  };

  const handleEditColony = (colonyId) => {
    toast.success(`Edit Colony ${colonyId} feature coming soon!`);
  };

  const handleDeleteColony = async (colonyId) => {
    if (window.confirm('Are you sure you want to delete this colony?')) {
      try {
        const res = await axios.delete(`${COLONY_API_END_POINT}/delete/${colonyId}`, {
          withCredentials: true
        });
        if (res.data.success) {
          setColonies(colonies.filter(colony => colony._id !== colonyId));
          toast.success('Colony deleted successfully!');
        }
      } catch (error) {
        toast.error('Failed to delete colony');
      }
    }
  };

  const handleViewDetails = (colonyId) => {
    navigate(`/colony/${colonyId}`);
  };

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      
      <div className="pt-20 pb-12">
        <div className="container mx-auto px-6">
          <div className="flex justify-between items-center mb-8">
            <div>
              <h1 className="text-3xl font-bold mb-2">Manage Colonies</h1>
              <p className="text-muted-foreground">Add, edit, and manage residential colonies</p>
            </div>
            <Button className="btn-primary" onClick={handleAddColony}>
              <Plus className="h-4 w-4 mr-2" />
              Add Colony
            </Button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {colonies.map((colony, index) => (
              <motion.div
                key={colony._id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                className="card-professional p-6"
              >
                <div className="flex justify-between items-start mb-4">
                  <h3 className="text-xl font-bold">{colony.name}</h3>
                  <div className="flex gap-2">
                    <Button variant="ghost" size="sm" onClick={() => handleEditColony(colony._id)}>
                      <Edit className="h-4 w-4" />
                    </Button>
                    <Button variant="ghost" size="sm" className="text-destructive" onClick={() => handleDeleteColony(colony._id)}>
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
                
                <p className="text-muted-foreground text-sm mb-4">{colony.description}</p>
                
                <div className="space-y-2 mb-4">
                  <div className="flex items-center gap-2 text-sm">
                    <Home className="h-4 w-4 text-primary" />
                    <span>{colony.totalFlats} Flats</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm">
                    <Users className="h-4 w-4 text-primary" />
                    <span>{colony.city}</span>
                  </div>
                </div>
                
                <div className="flex flex-wrap gap-1 mb-4">
                  {colony.amenities.slice(0, 3).map((amenity, i) => (
                    <Badge key={i} variant="secondary" className="text-xs">
                      {amenity}
                    </Badge>
                  ))}
                  {colony.amenities.length > 3 && (
                    <Badge variant="outline" className="text-xs">
                      +{colony.amenities.length - 3}
                    </Badge>
                  )}
                </div>
                
                <Button className="w-full btn-secondary" size="sm" onClick={() => handleViewDetails(colony._id)}>
                  View Details
                </Button>
              </motion.div>
            ))}
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
};

export default ManageColonies;