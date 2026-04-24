import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { Badge } from "./ui/badge";
import { Button } from "./ui/button";
import { MapPin, Users, Home, ArrowRight } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";

const ColonyCard = ({ colony }) => {
  const navigate = useNavigate();

  return (
    <motion.div
      whileHover={{ y: -4 }}
      transition={{ duration: 0.2 }}
      className="card-professional hover-lift cursor-pointer"
      onClick={() => navigate(`/colony/${colony._id}`)}
    >
      <CardHeader className="pb-4">
        <div className="flex justify-between items-start">
          <div className="flex-1">
            <CardTitle className="text-xl font-bold text-foreground group-hover:text-primary transition-colors">
              {colony.name}
            </CardTitle>
            <div className="flex items-center text-sm text-muted-foreground mt-1">
              <MapPin className="h-4 w-4 mr-1" />
              {colony.city}
            </div>
          </div>
          <ArrowRight className="h-5 w-5 text-muted-foreground group-hover:text-primary transition-colors" />
        </div>
      </CardHeader>
      
      <CardContent className="space-y-4">
        <p className="text-muted-foreground text-sm line-clamp-2">
          {colony.description}
        </p>
        
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4 text-sm">
            <div className="flex items-center gap-1">
              <Home className="h-4 w-4 text-primary" />
              <span>{colony.totalFlats || 0} Flats</span>
            </div>
            <div className="flex items-center gap-1">
              <Users className="h-4 w-4 text-primary" />
              <span>Active</span>
            </div>
          </div>
        </div>
        
        {colony.amenities && colony.amenities.length > 0 && (
          <div className="flex flex-wrap gap-1">
            {colony.amenities.slice(0, 3).map((amenity, index) => (
              <Badge key={index} variant="secondary" className="text-xs">
                {amenity}
              </Badge>
            ))}
            {colony.amenities.length > 3 && (
              <Badge variant="outline" className="text-xs">
                +{colony.amenities.length - 3} more
              </Badge>
            )}
          </div>
        )}
        
        <Button className="w-full btn-primary" size="sm">
          View Services
        </Button>
      </CardContent>
    </motion.div>
  );
};

export default ColonyCard;