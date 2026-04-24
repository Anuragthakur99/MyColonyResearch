"use client"
import { Badge } from "./ui/badge"
import { useNavigate } from "react-router-dom"
import { MapPin, Briefcase, DollarSign, Users, ArrowRight } from "lucide-react"
import { motion } from "framer-motion"

const LatestJobCards = ({ job }) => {
  const navigate = useNavigate()
  
  return (
    <motion.div
      onClick={() => navigate(`/description/${job._id}`)}
      className="card-professional p-6 cursor-pointer hover-lift group relative overflow-hidden"
      whileHover={{ y: -4 }}
      transition={{ duration: 0.2 }}
    >
      {/* Background gradient on hover */}
      <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
      
      <div className="relative z-10">
        {/* Header */}
        <div className="flex justify-between items-start mb-4">
          <div className="flex-1">
            <div className="flex items-center gap-2 mb-1">
              <div className="w-10 h-10 bg-primary/10 rounded-lg flex items-center justify-center">
                <Briefcase className="h-5 w-5 text-primary" />
              </div>
              <div>
                <h3 className="font-bold text-lg text-foreground group-hover:text-primary transition-colors">
                  {job?.company?.name}
                </h3>
                <div className="flex items-center text-sm text-muted-foreground">
                  <MapPin className="h-3 w-3 mr-1" />
                  {job?.location || "India"}
                </div>
              </div>
            </div>
          </div>
          <ArrowRight className="h-5 w-5 text-muted-foreground group-hover:text-primary group-hover:translate-x-1 transition-all duration-300" />
        </div>

        {/* Job details */}
        <div className="mb-4">
          <h4 className="font-semibold text-xl text-foreground mb-2 group-hover:text-primary/90 transition-colors">
            {job?.title}
          </h4>
          <p className="text-muted-foreground text-sm line-clamp-2 leading-relaxed">
            {job?.description}
          </p>
        </div>

        {/* Badges */}
        <div className="flex flex-wrap gap-2 mb-4">
          <Badge variant="secondary" className="bg-primary/10 text-primary border-primary/20 hover:bg-primary/20">
            <Users className="h-3 w-3 mr-1" />
            {job?.position} Positions
          </Badge>
          <Badge variant="outline" className="border-muted-foreground/20">
            {job?.jobType}
          </Badge>
          <Badge variant="secondary" className="bg-green-50 text-green-700 border-green-200">
            <DollarSign className="h-3 w-3 mr-1" />
            {job?.salary} LPA
          </Badge>
        </div>

        {/* Footer */}
        <div className="flex items-center justify-between pt-4 border-t border-border/50">
          <span className="text-xs text-muted-foreground">
            {job?.experienceLevel ? `${job.experienceLevel}+ years exp` : "Experience varies"}
          </span>
          <span className="text-xs font-medium text-primary group-hover:text-primary/80">
            View Details
          </span>
        </div>
      </div>
    </motion.div>
  )
}

export default LatestJobCards
