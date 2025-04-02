"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { ChevronLeft, ChevronRight } from "lucide-react"
import { cn } from "@/lib/utils"
import { useBookingStore } from "@/lib/store"
import { CalendarExport } from "./calendar-export"

// Helper function to get days in month
const getDaysInMonth = (year: number, month: number) => {
  return new Date(year, month + 1, 0).getDate()
}

// Helper function to get day of week of first day in month
const getFirstDayOfMonth = (year: number, month: number) => {
  return new Date(year, month, 1).getDay()
}

const WEEKDAYS = ["Dim", "Lun", "Mar", "Mer", "Jeu", "Ven", "Sam"]
const MONTHS = [
  "Janvier",
  "Février",
  "Mars",
  "Avril",
  "Mai",
  "Juin",
  "Juillet",
  "Août",
  "Septembre",
  "Octobre",
  "Novembre",
  "Décembre",
]

export function Calendar() {
  const [isClient, setIsClient] = useState(false)
  const [currentDate, setCurrentDate] = useState(new Date())
  const [storeData, setStoreData] = useState({
    bookings: [],
    selectedRoom: "",
    rooms: [],
    leaves: [],
  })

  // Utiliser useEffect pour éviter les erreurs d'hydratation
  useEffect(() => {
    setIsClient(true)
    const { bookings, selectedRoom, rooms, leaves } = useBookingStore.getState()
    setStoreData({ bookings, selectedRoom, rooms, leaves })

    // S'abonner aux changements du store
    const unsubscribe = useBookingStore.subscribe((state) => {
      setStoreData({
        bookings: state.bookings,
        selectedRoom: state.selectedRoom,
        rooms: state.rooms,
        leaves: state.leaves,
      })
    })

    return () => unsubscribe()
  }, [])

  const currentYear = currentDate.getFullYear()
  const currentMonth = currentDate.getMonth()

  const daysInMonth = getDaysInMonth(currentYear, currentMonth)
  const firstDayOfMonth = getFirstDayOfMonth(currentYear, currentMonth)

  const prevMonth = () => {
    setCurrentDate(new Date(currentYear, currentMonth - 1, 1))
  }

  const nextMonth = () => {
    setCurrentDate(new Date(currentYear, currentMonth + 1, 1))
  }

  // Filter bookings for the selected room and current month
  const filteredBookings = isClient
    ? storeData.bookings.filter((booking) => {
        const bookingDate = new Date(booking.date)
        return (
          booking.roomId === storeData.selectedRoom &&
          bookingDate.getMonth() === currentMonth &&
          bookingDate.getFullYear() === currentYear
        )
      })
    : []

  // Get leaves for the selected room if it's an office
  const selectedRoomObj = isClient ? storeData.rooms.find((room) => room.id === storeData.selectedRoom) : null
  const isOffice = selectedRoomObj?.type === "office"

  // Filter leaves for the current month and selected room
  const filteredLeaves =
    isClient && isOffice
      ? storeData.leaves.filter((leave) => {
          const leaveStartDate = new Date(leave.startDate)
          const leaveEndDate = new Date(leave.endDate)

          // Check if any part of the leave falls within the current month
          const monthStart = new Date(currentYear, currentMonth, 1)
          const monthEnd = new Date(currentYear, currentMonth + 1, 0)

          return (
            leave.referentId === storeData.selectedRoom &&
            ((leaveStartDate <= monthEnd && leaveEndDate >= monthStart) ||
              (leaveStartDate.getMonth() === currentMonth && leaveStartDate.getFullYear() === currentYear) ||
              (leaveEndDate.getMonth() === currentMonth && leaveEndDate.getFullYear() === currentYear))
          )
        })
      : []

  // Create calendar days array
  const calendarDays = []

  // Add empty cells for days before the first day of the month
  for (let i = 0; i < firstDayOfMonth; i++) {
    calendarDays.push(null)
  }

  // Add days of the month
  for (let day = 1; day <= daysInMonth; day++) {
    calendarDays.push(day)
  }

  // Get current room name
  const getRoomName = () => {
    if (!isClient || !storeData.selectedRoom) return ""
    const room = storeData.rooms.find((r) => r.id === storeData.selectedRoom)
    return room ? room.name : ""
  }

  // Check if a day is within a leave period
  const isDayInLeave = (day: number) => {
    if (!isClient || !isOffice || filteredLeaves.length === 0) return false

    const checkDate = new Date(currentYear, currentMonth, day)

    return filteredLeaves.some((leave) => {
      const leaveStartDate = new Date(leave.startDate)
      const leaveEndDate = new Date(leave.endDate)
      return checkDate >= leaveStartDate && checkDate <= leaveEndDate
    })
  }

  // Obtenir les informations de congé pour un jour spécifique
  const getLeaveInfoForDay = (day: number) => {
    if (!isClient || !isOffice || filteredLeaves.length === 0) return null

    const checkDate = new Date(currentYear, currentMonth, day)

    const leave = filteredLeaves.find((leave) => {
      const leaveStartDate = new Date(leave.startDate)
      const leaveEndDate = new Date(leave.endDate)
      return checkDate >= leaveStartDate && checkDate <= leaveEndDate
    })

    return leave
  }

  if (!isClient) {
    return (
      <Card className="w-full">
        <CardHeader>
          <CardTitle>Calendrier</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="h-96 flex items-center justify-center">Chargement du calendrier...</div>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card className="w-full print:shadow-none print:border-none">
      <CardHeader className="flex flex-row items-center justify-between pb-2">
        <div className="flex flex-col">
          <CardTitle>Calendrier</CardTitle>
          <p className="text-sm text-muted-foreground print:text-black">{getRoomName()}</p>
        </div>
        <div className="flex items-center space-x-2">
          <div className="flex items-center space-x-2 print:hidden">
            <Button variant="outline" size="icon" onClick={prevMonth}>
              <ChevronLeft className="h-4 w-4" />
            </Button>
            <span className="text-lg font-medium">
              {MONTHS[currentMonth]} {currentYear}
            </span>
            <Button variant="outline" size="icon" onClick={nextMonth}>
              <ChevronRight className="h-4 w-4" />
            </Button>
          </div>
          <span className="hidden print:block text-lg font-medium">
            {MONTHS[currentMonth]} {currentYear}
          </span>
          <CalendarExport currentMonth={currentMonth} currentYear={currentYear} />
        </div>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-7 gap-1 print:gap-0">
          {WEEKDAYS.map((day) => (
            <div key={day} className="text-center font-medium py-2 print:border print:border-gray-300">
              {day}
            </div>
          ))}

          {calendarDays.map((day, index) => {
            if (day === null) {
              return (
                <div
                  key={`empty-${index}`}
                  className="h-24 p-1 border border-gray-200 bg-gray-50 print:h-32 print:bg-white"
                ></div>
              )
            }

            const dateString = `${currentYear}-${String(currentMonth + 1).padStart(2, "0")}-${String(day).padStart(2, "0")}`
            const dayBookings = filteredBookings.filter((booking) => booking.date === dateString)
            const isLeaveDay = isDayInLeave(day)

            return (
              <div
                key={`day-${day}`}
                className={cn(
                  "h-24 p-1 border border-gray-200 overflow-y-auto",
                  "hover:bg-gray-50 transition-colors",
                  isLeaveDay && "bg-red-50 hover:bg-red-100",
                  "print:h-32 print:hover:bg-white print:border-gray-300",
                  isLeaveDay && "print:bg-red-50",
                )}
              >
                <div className="font-medium">{day}</div>
                {isLeaveDay && (
                  <div className="text-xs p-1 mt-1 bg-red-100 text-red-800 rounded border border-red-200 print:border-red-300">
                    {getLeaveInfoForDay(day)?.title || "Congé"}
                  </div>
                )}
                {dayBookings.map((booking, idx) => (
                  <div
                    key={idx}
                    className={`text-xs p-1 mt-1 rounded truncate ${
                      booking.isRecurring
                        ? "bg-primary/80 text-primary-foreground border-l-4 border-primary print:bg-white print:text-black print:border print:border-gray-500"
                        : "bg-primary text-primary-foreground print:bg-white print:text-black print:border print:border-gray-500"
                    }`}
                    title={`${booking.title} (${booking.startTime}-${booking.endTime})${
                      booking.isRecurring ? " - Événement récurrent" : ""
                    }`}
                  >
                    {booking.startTime}-{booking.endTime} {booking.title}
                  </div>
                ))}
              </div>
            )
          })}
        </div>
      </CardContent>
    </Card>
  )
}

