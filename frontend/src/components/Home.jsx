import React, { useEffect, useState } from 'react'
import Navbar from './shared/Navbar'
import HeroSection from './HeroSection'
import Footer from './shared/Footer'
import ColonyCard from './ColonyCard'
import PopularServices from './PopularServices'
import { useSelector } from 'react-redux'
import { useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import { MapPin, Search, Briefcase } from 'lucide-react'
import axios from 'axios'
import { COLONY_API_END_POINT } from '../utils/constant'

const Home = () => {
  const { user } = useSelector(store => store.auth);
  const navigate = useNavigate();
  const [colonies, setColonies] = useState([]);

  useEffect(() => {
    // Fetch colonies from API
    const fetchColonies = async () => {
      try {
        const res = await axios.get(`${COLONY_API_END_POINT}/get`);
        if (res.data.success) {
          setColonies(res.data.colonies);
        }
      } catch (error) {
        console.log('Error fetching colonies:', error);
        setColonies([]);
      }
    };
    
    fetchColonies();
  }, [])

  return (
    <div>
      <Navbar />
      <HeroSection />
      
      {/* Colonies Section */}
      <section className="py-20 bg-background">
        <div className="container mx-auto px-6">
          <div className="text-center mb-16">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 border border-primary/20 text-primary font-medium text-sm mb-6"
            >
              <MapPin className="h-4 w-4" />
              Explore Colonies
            </motion.div>
            
            <motion.h2
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.1 }}
              className="text-3xl md:text-5xl font-bold mb-4"
            >
              Choose Your{" "}
              <span className="gradient-text">Colony</span>
            </motion.h2>
            
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.2 }}
              className="text-lg text-muted-foreground max-w-2xl mx-auto"
            >
              Select your residential colony to discover local services and connect with your neighbors.
            </motion.p>
          </div>

          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ delay: 0.3 }}
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
          >
            {colonies.map((colony, index) => (
              <motion.div
                key={colony._id}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
              >
                <ColonyCard colony={colony} />
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>
      
      {/* Popular Services Section */}
      <section className="py-20 bg-muted/30">
        <div className="container mx-auto px-6">
          <div className="text-center mb-16">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 border border-primary/20 text-primary font-medium text-sm mb-6"
            >
              <Briefcase className="h-4 w-4" />
              Featured Services
            </motion.div>
            
            <motion.h2
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="text-3xl md:text-5xl font-bold mb-4"
            >
              Popular{" "}
              <span className="gradient-text">Colony Services</span>
            </motion.h2>
            
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.1 }}
              className="text-lg text-muted-foreground max-w-2xl mx-auto"
            >
              Discover trusted local service providers in your colony. From daily needs to special requirements - we've got you covered.
            </motion.p>
          </div>

          <PopularServices />
        </div>
      </section>
      <Footer />
    </div>
  )
}

export default Home
