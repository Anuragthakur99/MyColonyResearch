"use client"

import { Search, Sparkles, TrendingUp, Users } from "lucide-react"
import { useState } from "react"
import { Button } from "./ui/button"
import { useDispatch } from "react-redux"
// Remove job slice import since we're not using jobs anymore
import { useNavigate } from "react-router-dom"
import { motion } from "framer-motion"

const HeroSection = () => {
  const [query, setQuery] = useState("")
  const dispatch = useDispatch()
  const navigate = useNavigate()

  const searchServiceHandler = () => {
    // Navigate to all services with search query
    navigate(`/all-services?search=${encodeURIComponent(query)}`);
  }

  const stats = [
    { icon: Users, label: "Active Colonies", value: "50+" },
    { icon: TrendingUp, label: "Service Providers", value: "500+" },
    { icon: Sparkles, label: "Happy Customers", value: "2K+" }
  ]

  return (
    <section className="relative min-h-screen pt-20 pb-16 overflow-hidden">
      {/* Background gradient */}
      <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-background to-secondary/5" />
      
      {/* Animated background elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-primary/10 rounded-full blur-3xl animate-pulse" />
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-secondary/10 rounded-full blur-3xl animate-pulse" />
      </div>

      <div className="relative container mx-auto px-6">
        <div className="text-center max-w-5xl mx-auto">
          {/* Badge */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 border border-primary/20 text-primary font-medium text-sm mb-8"
          >
            <Sparkles className="h-4 w-4" />
            #1 Job Portal Platform
          </motion.div>

          {/* Main heading */}
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="text-4xl md:text-6xl lg:text-7xl font-bold leading-tight mb-6"
          >
            Discover Local{" "}
            <span className="gradient-text">Services</span>
            <br />
            in Your Colony
          </motion.h1>

          {/* Subtitle */}
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="text-lg md:text-xl text-muted-foreground max-w-3xl mx-auto mb-12 leading-relaxed"
          >
            Connect with trusted service providers in your colony. From tiffin services to laundry, tutoring to maintenance - 
            find everything you need right in your neighborhood.
          </motion.p>

          {/* Search bar */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
            className="flex flex-col sm:flex-row gap-4 max-w-2xl mx-auto mb-16"
          >
            <div className="flex-1 relative">
              <input
                type="text"
                placeholder="Search services, providers, or categories..."
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                className="w-full px-6 py-4 text-lg rounded-xl border border-border bg-background/50 backdrop-blur-sm focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-all duration-300 shadow-sm"
              />
            </div>
            <Button
              onClick={searchServiceHandler}
              className="btn-primary px-8 py-4 text-lg h-auto whitespace-nowrap"
            >
              <Search className="h-5 w-5 mr-2" />
              Find Services
            </Button>
          </motion.div>

          {/* Stats */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.4 }}
            className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-3xl mx-auto mb-16"
          >
            {stats.map((stat, index) => {
              const Icon = stat.icon
              return (
                <div key={index} className="text-center">
                  <div className="inline-flex items-center justify-center w-12 h-12 rounded-lg bg-primary/10 text-primary mb-3">
                    <Icon className="h-6 w-6" />
                  </div>
                  <div className="text-2xl font-bold text-foreground mb-1">{stat.value}</div>
                  <div className="text-sm text-muted-foreground">{stat.label}</div>
                </div>
              )
            })}
          </motion.div>

          {/* Trusted companies */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.5 }}
            className="text-center"
          >
            <p className="text-sm text-muted-foreground mb-6">Trusted by residents across colonies</p>
            <div className="flex flex-wrap justify-center items-center gap-8 opacity-60">
              {["Green Valley", "Royal Heights", "Sunrise Apartments", "City Gardens", "Palm Residency", "Metro Homes"].map((colony) => (
                <div
                  key={colony}
                  className="text-lg font-semibold hover:opacity-100 transition-opacity duration-300 cursor-pointer"
                >
                  {colony}
                </div>
              ))}
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  )
}

export default HeroSection
