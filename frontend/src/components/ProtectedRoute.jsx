import React, { useEffect, useState } from 'react'
import { Navigate, Outlet } from 'react-router-dom'
import { useSelector } from 'react-redux'
import { toast } from 'sonner'
import { getCookie } from '../utils/cookies'

const ProtectedRoute = () => {
  const [isLoading, setIsLoading] = useState(true)
  const { user } = useSelector((state) => state.auth)

  useEffect(() => {
    const checkAuth = () => {
      const token = getCookie("token")
      // Check if user exists OR if token exists (for persistence)
      if (user || token) {
        setIsLoading(false)
        return
      }
      
      // Only show error and redirect if neither user nor token exists
      toast.error('You need to log in to access this page')
      setIsLoading(false)
    }

    // Add a small delay to allow Redux persist to rehydrate
    const timer = setTimeout(checkAuth, 100)
    return () => clearTimeout(timer)
  }, [user])

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-purple-500"></div>
      </div>
    )
  }

  const token = getCookie("token")
  const isAuthenticated = user || token
  
  return isAuthenticated ? <Outlet /> : <Navigate to="/login" replace />
}

export default ProtectedRoute