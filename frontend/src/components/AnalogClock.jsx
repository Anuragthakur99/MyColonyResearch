"use client"

import { useEffect, useRef } from "react"

const AnalogClock = ({ size = 200, className = "" }) => {
  const canvasRef = useRef(null)

  useEffect(() => {
    const canvas = canvasRef.current
    const ctx = canvas.getContext("2d")
    let animationFrameId

    const drawClock = () => {
      // Get current time in IST (UTC+5:30)
      const now = new Date()
      const utcTime = now.getTime() + now.getTimezoneOffset() * 60000
      const istTime = new Date(utcTime + 5.5 * 3600000)

      const hours = istTime.getHours() % 12 // Convert to 12-hour format
      const minutes = istTime.getMinutes()
      const seconds = istTime.getSeconds()
      const milliseconds = istTime.getMilliseconds()

      // Clear canvas
      ctx.clearRect(0, 0, canvas.width, canvas.height)

      // Set dimensions
      const centerX = canvas.width / 2
      const centerY = canvas.height / 2
      const radius = Math.min(centerX, centerY) - 5 // Reduced padding for larger clock face

      // Draw clock face with gradient
      const gradient = ctx.createRadialGradient(centerX, centerY, radius * 0.95, centerX, centerY, radius * 0.05)
      gradient.addColorStop(0, "#f8f9fa")
      gradient.addColorStop(1, "#e9ecef")

      ctx.beginPath()
      ctx.arc(centerX, centerY, radius, 0, 2 * Math.PI)
      ctx.fillStyle = gradient
      ctx.fill()
      ctx.lineWidth = 1.5 // Thinner border
      ctx.strokeStyle = "#adb5bd"
      ctx.stroke()

      // Draw minute markers
      for (let i = 0; i < 60; i++) {
        if (i % 5 !== 0) {
          // Skip hour positions
          const angle = (i / 60) * 2 * Math.PI - Math.PI / 2
          const innerRadius = radius * 0.95
          const outerRadius = radius * 0.98

          const startX = centerX + innerRadius * Math.cos(angle)
          const startY = centerY + innerRadius * Math.sin(angle)
          const endX = centerX + outerRadius * Math.cos(angle)
          const endY = centerY + outerRadius * Math.sin(angle)

          ctx.beginPath()
          ctx.moveTo(startX, startY)
          ctx.lineTo(endX, endY)
          ctx.lineWidth = 1
          ctx.strokeStyle = "#6c757d"
          ctx.stroke()
        }
      }

      // Draw hour markers and numbers
      for (let i = 1; i <= 12; i++) {
        const angle = (i / 12) * 2 * Math.PI - Math.PI / 2
        const isMainHour = i % 3 === 0

        // Draw hour markers
        const markerInnerRadius = isMainHour ? radius * 0.8 : radius * 0.85
        const markerOuterRadius = radius * 0.95

        const startX = centerX + markerInnerRadius * Math.cos(angle)
        const startY = centerY + markerInnerRadius * Math.sin(angle)
        const endX = centerX + markerOuterRadius * Math.cos(angle)
        const endY = centerY + markerOuterRadius * Math.sin(angle)

        ctx.beginPath()
        ctx.moveTo(startX, startY)
        ctx.lineTo(endX, endY)
        ctx.lineWidth = isMainHour ? 3 : 2
        ctx.strokeStyle = isMainHour ? "#212529" : "#495057"
        ctx.stroke()

        // Add hour numbers
        const textRadius = isMainHour ? radius * 0.68 : radius * 0.72
        const textX = centerX + textRadius * Math.cos(angle)
        const textY = centerY + textRadius * Math.sin(angle)

        ctx.font = `${isMainHour ? "bold" : "normal"} ${Math.floor(radius * (isMainHour ? 0.18 : 0.15))}px Arial`
        ctx.fillStyle = isMainHour ? "#212529" : "#495057"
        ctx.textAlign = "center"
        ctx.textBaseline = "middle"
        ctx.fillText(i.toString(), textX, textY)
      }

      // Draw decorative ring
      ctx.beginPath()
      ctx.arc(centerX, centerY, radius * 0.03, 0, 2 * Math.PI)
      ctx.fillStyle = "#212529"
      ctx.fill()

      ctx.beginPath()
      ctx.arc(centerX, centerY, radius * 0.02, 0, 2 * Math.PI)
      ctx.fillStyle = "#f44336"
      ctx.fill()

      // Calculate hand angles
      const hourAngle = ((hours % 12) / 12) * 2 * Math.PI + (minutes / 60 / 12) * 2 * Math.PI - Math.PI / 2
      const minuteAngle = (minutes / 60) * 2 * Math.PI + (seconds / 60 / 60) * 2 * Math.PI - Math.PI / 2
      const secondAngle = (seconds / 60) * 2 * Math.PI + (milliseconds / 1000 / 60) * 2 * Math.PI - Math.PI / 2

      // Draw hour hand with shadow
      ctx.save()
      ctx.shadowColor = "rgba(0, 0, 0, 0.2)"
      ctx.shadowBlur = 4
      ctx.shadowOffsetX = 1
      ctx.shadowOffsetY = 1

      ctx.beginPath()
      ctx.moveTo(centerX, centerY)
      ctx.lineTo(centerX + radius * 0.5 * Math.cos(hourAngle), centerY + radius * 0.5 * Math.sin(hourAngle))
      ctx.lineWidth = radius * 0.06
      ctx.strokeStyle = "#212529"
      ctx.lineCap = "round"
      ctx.stroke()
      ctx.restore()

      // Draw minute hand with shadow
      ctx.save()
      ctx.shadowColor = "rgba(0, 0, 0, 0.2)"
      ctx.shadowBlur = 3
      ctx.shadowOffsetX = 1
      ctx.shadowOffsetY = 1

      ctx.beginPath()
      ctx.moveTo(centerX, centerY)
      ctx.lineTo(centerX + radius * 0.75 * Math.cos(minuteAngle), centerY + radius * 0.75 * Math.sin(minuteAngle))
      ctx.lineWidth = radius * 0.04
      ctx.strokeStyle = "#343a40"
      ctx.lineCap = "round"
      ctx.stroke()
      ctx.restore()

      // Draw second hand
      ctx.beginPath()
      ctx.moveTo(centerX, centerY)
      ctx.lineTo(centerX + radius * 0.85 * Math.cos(secondAngle), centerY + radius * 0.85 * Math.sin(secondAngle))
      ctx.lineWidth = radius * 0.02
      ctx.strokeStyle = "#f44336"
      ctx.lineCap = "round"
      ctx.stroke()

      // Draw center cap over hands
      ctx.beginPath()
      ctx.arc(centerX, centerY, radius * 0.03, 0, 2 * Math.PI)
      ctx.fillStyle = "#f44336"
      ctx.fill()
      ctx.beginPath()
      ctx.arc(centerX, centerY, radius * 0.02, 0, 2 * Math.PI)
      ctx.fillStyle = "#212529"
      ctx.fill()

      // Request next frame
      animationFrameId = requestAnimationFrame(drawClock)
    }

    drawClock()

    return () => {
      cancelAnimationFrame(animationFrameId)
    }
  }, [])

  return <canvas ref={canvasRef} width={size} height={size} className={`rounded-full shadow-lg ${className}`} />
}

export default AnalogClock
