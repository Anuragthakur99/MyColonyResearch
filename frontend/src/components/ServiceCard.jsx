import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { Badge } from "./ui/badge";
import { Button } from "./ui/button";
import { Star, Phone, MapPin, Clock, User, Trash2 } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import { motion } from "framer-motion";
import { toast } from "sonner";
import axios from "axios";
import { SERVICE_API_END_POINT } from "../utils/constant";

const ServiceCard = ({ service, onDelete }) => {
  const navigate = useNavigate();
  const { user } = useSelector(store => store.auth);
  const isAdmin = user?.role === 'admin';

  const handleDelete = async (e) => {
    e.stopPropagation(); // Prevent card click
    if (window.confirm('Are you sure you want to delete this service permanently?')) {
      try {
        const res = await axios.delete(`${SERVICE_API_END_POINT}/delete/${service._id}`, {
          withCredentials: true
        });
        if (res.data.success) {
          toast.success('Service deleted successfully!');
          if (onDelete) onDelete(service._id);
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
    <motion.div
      whileHover={{ y: -4 }}
      transition={{ duration: 0.2 }}
      className="card-professional hover-lift cursor-pointer"
      onClick={() => navigate(`/service/${service._id}`)}
    >
      <CardHeader className="pb-4">
        <div className="flex justify-between items-start">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center text-2xl">
              {getCategoryIcon(service.category)}
            </div>
            <div>
              <CardTitle className="text-lg font-bold text-foreground">
                {service.title}
              </CardTitle>
              <div className="flex items-center gap-2 mt-1">
                <Badge variant="secondary" className="text-xs">
                  {service.category}
                </Badge>
                {service.rating > 0 && (
                  <div className="flex items-center gap-1">
                    <Star className="h-3 w-3 fill-yellow-400 text-yellow-400" />
                    <span className="text-xs text-muted-foreground">{service.rating}</span>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </CardHeader>
      
      <CardContent className="space-y-4">
        <p className="text-muted-foreground text-sm line-clamp-2">
          {service.description}
        </p>
        
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-sm font-medium">Price:</span>
            <span className="text-primary font-semibold">{service.price}</span>
          </div>
          
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <Clock className="h-4 w-4" />
            <span>{service.availability}</span>
          </div>
          
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <User className="h-4 w-4" />
            <span>{service.serviceProvider?.fullname}</span>
          </div>
          
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <MapPin className="h-4 w-4" />
            <span>{service.colony?.name}</span>
          </div>
        </div>
        
        <div className="flex gap-2">
          <Button className="flex-1 btn-primary" size="sm">
            View Details
          </Button>
          <Button variant="outline" size="sm" className="px-3">
            <Phone className="h-4 w-4" />
          </Button>
          {isAdmin && (
            <Button 
              variant="outline" 
              size="sm" 
              className="px-3 border-red-200 text-red-600 hover:bg-red-50"
              onClick={handleDelete}
            >
              <Trash2 className="h-4 w-4" />
            </Button>
          )}
        </div>
      </CardContent>
    </motion.div>
  );
};

export default ServiceCard;