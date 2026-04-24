"use client"

import React, { useState, useEffect } from 'react'
import { useSelector } from 'react-redux'
import { useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import { Mail, Phone, Pen, Briefcase, MapPin, LinkIcon, Plus, Settings } from 'lucide-react'
import axios from 'axios'
import { SERVICE_API_END_POINT } from '../utils/constant'

import Navbar from './shared/Navbar'
import UpdateProfileDialog from './UpdateProfileDialog'

import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar"
import { Button } from "./ui/button"
import { Badge } from "./ui/badge"
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card"

const Profile = () => {
    const [open, setOpen] = useState(false);
    const [myServices, setMyServices] = useState([]);
    const { user } = useSelector(store => store.auth);
    const navigate = useNavigate();
    
    // Fetch user's services
    useEffect(() => {
        const fetchMyServices = async () => {
            try {
                const res = await axios.get(`${SERVICE_API_END_POINT}/my-services`, {
                    withCredentials: true
                });
                if (res.data.success) {
                    setMyServices(res.data.services);
                }
            } catch (error) {
                console.log('Error fetching services:', error);
            }
        };
        fetchMyServices();
    }, []);

    return (
        <div className="min-h-screen bg-gray-100">
            <Navbar />
            <div className='max-w-6xl mx-auto pt-20 px-4'>
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5 }}
                    className="grid grid-cols-1 md:grid-cols-3 gap-8"
                >
                    <Card className="md:col-span-1 h-fit">
                        <CardHeader className="text-center relative pb-24">
                            <Avatar className="h-32 w-32 absolute left-1/2 transform -translate-x-1/2 -bottom-16 border-4 border-white shadow-lg">
                                <AvatarImage src={user?.profile?.profilePhoto} alt={user?.fullname} />
                                <AvatarFallback>{user?.fullname?.charAt(0)}</AvatarFallback>
                            </Avatar>
                        </CardHeader>
                        <CardContent className="pt-20">
                            <div className="text-center mb-6">
                                <h2 className="text-2xl font-bold text-gray-800">{user?.fullname}</h2>
                                <p className="text-gray-500 mt-1">{user?.profile?.bio}</p>
                            </div>
                            <div className='space-y-4'>
                                <div className='flex items-center gap-3 text-gray-600'>
                                    <Mail className="h-5 w-5" />
                                    <span>{user?.email}</span>
                                </div>
                                <div className='flex items-center gap-3 text-gray-600'>
                                    <Phone className="h-5 w-5" />
                                    <span>{user?.phoneNumber}</span>
                                </div>
                                <div className='flex items-center gap-3 text-gray-600'>
                                    <MapPin className="h-5 w-5" />
                                    <span>{user?.profile?.address || 'Address not set'}</span>
                                </div>
                                {user?.profile?.flatNumber && (
                                    <div className='flex items-center gap-3 text-gray-600'>
                                        <LinkIcon className="h-5 w-5" />
                                        <span>Flat: {user.profile.flatNumber}</span>
                                    </div>
                                )}
                                {user?.colony && (
                                    <div className='flex items-center gap-3 text-gray-600'>
                                        <MapPin className="h-5 w-5" />
                                        <span>Colony: {user.colony.name}</span>
                                    </div>
                                )}
                            </div>
                            <div className="space-y-3 mt-6">
                                <Button onClick={() => setOpen(true)} variant="outline" className="w-full">
                                    <Pen className="h-4 w-4 mr-2" /> Edit Profile
                                </Button>
                                <Button onClick={() => navigate('/offer-service')} className="w-full btn-primary">
                                    <Plus className="h-4 w-4 mr-2" /> Offer Service
                                </Button>
                            </div>
                        </CardContent>
                    </Card>

                    <Card className="md:col-span-2">
                        <CardHeader>
                            <CardTitle className="text-xl font-bold text-gray-800">Professional Information</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className='space-y-6'>
                                <div>
                                    <h3 className='text-lg font-semibold mb-2 text-gray-700'>Skills</h3>
                                    <div className='flex flex-wrap gap-2'>
                                        {user?.profile?.skills?.length > 0 
                                            ? user?.profile?.skills.map((item, index) => 
                                                <Badge key={index} variant="secondary" className="bg-gray-200 text-gray-700">{item}</Badge>
                                              ) 
                                            : <span className="text-gray-500">No skills listed</span>
                                        }
                                    </div>
                                </div>

                                <div>
                                    <h3 className='text-lg font-semibold mb-2 text-gray-700'>About Me</h3>
                                    <p className="text-gray-600">{user?.profile?.bio || 'No information provided'}</p>
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                </motion.div>

                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, delay: 0.2 }}
                    className="mt-8"
                >
                    <Card>
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2 text-xl font-bold text-gray-800">
                                <Settings className="h-5 w-5 text-gray-600" />
                                My Services
                            </CardTitle>
                        </CardHeader>
                        <CardContent>
                            {myServices.length === 0 ? (
                                <div className="text-center py-8">
                                    <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-muted flex items-center justify-center">
                                        <Plus className="h-8 w-8 text-muted-foreground" />
                                    </div>
                                    <h3 className="text-lg font-semibold mb-2">No Services Yet</h3>
                                    <p className="text-muted-foreground mb-4">Start offering services to your colony neighbors</p>
                                    <Button onClick={() => navigate('/offer-service')} className="btn-primary">
                                        <Plus className="h-4 w-4 mr-2" />
                                        Offer Service
                                    </Button>
                                </div>
                            ) : (
                                <div className="space-y-4">
                                    {myServices.map((service) => (
                                        <div key={service._id} className="p-4 border border-border rounded-lg">
                                            <div className="flex justify-between items-start mb-2">
                                                <h4 className="font-semibold">{service.title}</h4>
                                                <Badge variant={service.isApproved ? 'default' : 'secondary'}>
                                                    {service.isApproved ? 'Approved' : 'Pending'}
                                                </Badge>
                                            </div>
                                            <p className="text-sm text-muted-foreground mb-2">{service.description}</p>
                                            <div className="flex justify-between items-center">
                                                <span className="text-primary font-medium">{service.price}</span>
                                                <Badge variant="outline">{service.category}</Badge>
                                            </div>
                                        </div>
                                    ))}
                                    <Button onClick={() => navigate('/offer-service')} variant="outline" className="w-full">
                                        <Plus className="h-4 w-4 mr-2" />
                                        Add Another Service
                                    </Button>
                                </div>
                            )}
                        </CardContent>
                    </Card>
                </motion.div>
            </div>
            <UpdateProfileDialog open={open} setOpen={setOpen} />
        </div>
    )
}

export default Profile

