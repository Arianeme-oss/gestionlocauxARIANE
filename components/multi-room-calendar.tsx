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

export function MultiRoomCalendar() {
  const [isClient, setIsClient] = useState(false)
  const [currentDate, setCurrentDate] = useState(new Date())
  const [storeData, setStoreData] = useState({
    bookings: [],
    selectedRooms: [],
    rooms: [],
    leaves: [],
  })

  useEffect(() => {
    setIsClient(true)
    const { bookings, selectedRooms, rooms, leaves } = useBookingStore.getState()
    setStoreData({ bookings, selectedRooms, rooms, leaves })

    // S'abonner aux changements du store
    const unsubscribe = useBookingStore.subscribe((state) => {
      setStoreData({
        bookings: state.bookings,
        selectedRooms: state.selectedRooms,
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

  // Filter bookings for the selected rooms and current month
  const filteredBookings = isClient
    ? storeData.bookings.filter((booking) => {
        const bookingDate = new Date(booking.date)
        return (
          storeData.selectedRooms.includes(booking.roomId) &&
          bookingDate.getMonth() === currentMonth &&
          bookingDate.getFullYear() === currentYear
        )
      })
    : []

  // Filter leaves for the current month and selected rooms
  const filteredLeaves = isClient
    ? storeData.leaves.filter((leave) => {
        const leaveStartDate = new Date(leave.startDate)
        const leaveEndDate = new Date(leave.endDate)

        // Check if any part of the leave falls within the current month
        const monthStart = new Date(currentYear, currentMonth, 1)
        const monthEnd = new Date(currentYear, currentMonth + 1, 0)

        return (
          storeData.selectedRooms.includes(leave.referentId) &&
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

  // Get room name by id
  const getRoomName = (roomId: string) => {
    if (!isClient) return roomId
    const room = storeData.rooms.find((r) => r.id === roomId)
    return room ? room.name : roomId
  }

  // Get a color for each room (for visual distinction)
  const getRoomColor = (roomId: string) => {
    const colors = [
      "bg-blue-100 border-blue-500 text-blue-800",
      "bg-green-100 border-green-500 text-green-800",
      "bg-yellow-100 border-yellow-500 text-yellow-800",
      "bg-purple-100 border-purple-500 text-purple-800",
      "bg-pink-100 border-pink-500 text-pink-800",
      "bg-indigo-100 border-indigo-500 text-indigo-800",
      "bg-red-100 border-red-500 text-red-800",
      "bg-orange-100 border-orange-500 text-orange-800",
      "bg-teal-100 border-teal-500 text-teal-800",
    ]

    // Use the index of the room in the rooms array to determine color
    if (!isClient) return colors[0]
    const index = storeData.rooms.findIndex((r) => r.id === roomId)
    return colors[index % colors.length]
  }

  // Check if a day has leaves for any of the selected rooms
  const getRoomLeavesForDay = (day: number) => {
    if (!isClient) return []
    const checkDate = new Date(currentYear, currentMonth, day)

    return filteredLeaves.filter((leave) => {
      const leaveStartDate = new Date(leave.startDate)
      const leaveEndDate = new Date(leave.endDate)
      return checkDate >= leaveStartDate && checkDate <= leaveEndDate
    })
  }

  if (!isClient) {
    return (
      <Card className="w-full">
        <CardHeader>
          <CardTitle>Calendrier multi-espaces</CardTitle>
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
          <CardTitle>Calendrier multi-espaces</CardTitle>
          <p className="text-sm text-muted-foreground print:text-black">
            {`${storeData.selectedRooms.length} espace(s) sélectionné(s)`}
          </p>
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
          <CalendarExport currentMonth={currentMonth} currentYear={currentYear} multiRoom={true} />
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
                  className="h-32 p-1 border border-gray-200 bg-gray-50 print:h-40 print:bg-white"
                ></div>
              )
            }

            const dateString = `${currentYear}-${String(currentMonth + 1).padStart(2, "0")}-${String(day).padStart(2, "0")}`
            const dayBookings = filteredBookings.filter((booking) => booking.date === dateString)
            const dayLeaves = getRoomLeavesForDay(day)

            return (
              <div
                key={`day-${day}`}
                className={cn(
                  "h-32 p-1 border border-gray-200 overflow-y-auto",
                  "hover:bg-gray-50 transition-colors",
                  "print:h-40 print:hover:bg-white print:border-gray-300",
                )}
              >
                <div className="font-medium">{day}</div>

                {dayLeaves.length > 0 && (
                  <div className="space-y-1 mt-1">
                    {dayLeaves.map((leave, idx) => (
                      <div
                        key={`leave-${idx}`}
                        className="text-xs p-1 bg-red-100 text-red-800 rounded border border-red-200 print:border-red-300"
                      >
                        <span className="font-semibold">{getRoomName(leave.referentId)}</span>: {leave.title || "Congé"}
                      </div>
                    ))}
                  </div>
                )}

                {dayBookings.map((booking, idx) => (
                  <div
                    key={`booking-${idx}`}
                    className={`text-xs p-1 mt-1 rounded truncate border-l-4 ${getRoomColor(
                      booking.roomId,
                    )} print:border print:bg-white print:text-black`}
                    title={`${booking.title} (${booking.startTime}-${booking.endTime}) - ${getRoomName(booking.roomId)}`}
                  >
                    <span className="font-semibold">{getRoomName(booking.roomId)}</span>: {booking.startTime}-
                    {booking.endTime} {booking.title}
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

