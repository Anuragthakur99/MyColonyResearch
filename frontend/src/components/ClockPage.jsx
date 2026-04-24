"use client"

import Navbar from "./shared/Navbar"
import AnalogClock from "./AnalogClock"
import { motion } from "framer-motion"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { useEffect, useState } from "react"

const ClockPage = () => {
  const [currentTime, setCurrentTime] = useState("")
  const [currentDate, setCurrentDate] = useState("")

  useEffect(() => {
    const updateTime = () => {
      // Get current time in IST (UTC+5:30)
      const now = new Date()
      const utcTime = now.getTime() + now.getTimezoneOffset() * 60000
      const istTime = new Date(utcTime + 5.5 * 3600000)

      // Format time for display
      const hours = istTime.getHours()
      const minutes = istTime.getMinutes()
      const seconds = istTime.getSeconds()
      const ampm = hours >= 12 ? "PM" : "AM"
      const formattedHours = hours % 12 || 12
      const formattedMinutes = minutes < 10 ? `0${minutes}` : minutes
      const formattedSeconds = seconds < 10 ? `0${seconds}` : seconds

      setCurrentTime(`${formattedHours}:${formattedMinutes}:${formattedSeconds} ${ampm} IST`)

      // Format date
      const options = { weekday: "long", year: "numeric", month: "long", day: "numeric" }
      setCurrentDate(istTime.toLocaleDateString("en-US", options))
    }

    updateTime()
    const intervalId = setInterval(updateTime, 1000)

    return () => clearInterval(intervalId)
  }, [])

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <div className="max-w-7xl mx-auto pt-20 px-4 flex flex-col items-center justify-center min-h-[80vh]">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="w-full max-w-md"
        >
          <Card className="card-themed shadow-xl overflow-hidden">
            <CardHeader className="text-center bg-gradient-to-r from-gray-800 to-gray-900 text-white">
              <CardTitle className="text-3xl font-bold">Real-Time Clock</CardTitle>
              <p className="text-xl font-mono mt-2">{currentTime}</p>
              <p className="text-sm opacity-80 mt-1">{currentDate}</p>
            </CardHeader>
            <CardContent className="flex justify-center p-8 bg-gradient-to-b from-gray-50 to-white">
              <AnalogClock size={350} className="shadow-xl" />
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </div>
  )
}

export default ClockPage
