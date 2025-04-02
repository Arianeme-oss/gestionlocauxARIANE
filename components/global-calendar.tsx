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

export function GlobalCalendar() {
  const [isClient, setIsClient] = useState(false)
  const [currentDate, setCurrentDate] = useState(new Date())
  const [storeData, setStoreData] = useState({
    bookings: [],
    rooms: [],
    leaves: [],
    collaborators: [],
  })

  useEffect(() => {
    setIsClient(true)
    const { bookings, rooms, leaves, collaborators } = useBookingStore.getState()
    setStoreData({ bookings, rooms, leaves, collaborators })

    // S'abonner aux changements du store
    const unsubscribe = useBookingStore.subscribe((state) => {
      setStoreData({
        bookings: state.bookings,
        rooms: state.rooms,
        leaves: state.leaves,
        collaborators: state.collaborators,
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

  // Filter bookings for the current month
  const filteredBookings = isClient
    ? storeData.bookings.filter((booking) => {
        const bookingDate = new Date(booking.date)
        return bookingDate.getMonth() === currentMonth && bookingDate.getFullYear() === currentYear
      })
    : []

  // Filter leaves for the current month
  const filteredLeaves = isClient
    ? storeData.leaves.filter((leave) => {
        const leaveStartDate = new Date(leave.startDate)
        const leaveEndDate = new Date(leave.endDate)

        // Check if any part of the leave falls within the current month
        const monthStart = new Date(currentYear, currentMonth, 1)
        const monthEnd = new Date(currentYear, currentMonth + 1, 0)

        return (
          (leaveStartDate <= monthEnd && leaveEndDate >= monthStart) ||
          (leaveStartDate.getMonth() === currentMonth && leaveStartDate.getFullYear() === currentYear) ||
          (leaveEndDate.getMonth() === currentMonth && leaveEndDate.getFullYear() === currentYear)
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

  // Get collaborator name by room
  const getCollaboratorName = (roomId: string) => {
    if (!isClient) return ""
    const room = storeData.rooms.find((r) => r.id === roomId)
    if (room?.collaboratorId) {
      const collaborator = storeData.collaborators.find((c) => c.id === room.collaboratorId)
      return collaborator ? collaborator.name : ""
    }
    return ""
  }

  // Get a color for each room (for visual distinction)
  const getRoomColor = (roomId: string) => {
    if (!isClient) return "bg-blue-100 border-blue-500 text-blue-800"
    const room = storeData.rooms.find((r) => r.id === roomId)
    if (room?.type === "training") {
      return "bg-blue-100 border-blue-500 text-blue-800"
    } else {
      return "bg-green-100 border-green-500 text-green-800"
    }
  }

  // Check if a day has leaves for any room
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
          <CardTitle>Planning Global</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="h-96 flex items-center justify-center">Chargement du planning...</div>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card className="w-full print:shadow-none print:border-none">
      <CardHeader className="flex flex-row items-center justify-between pb-2">
        <div className="flex flex-col">
          <CardTitle>Planning Global</CardTitle>
          <p className="text-sm text-muted-foreground print:text-black">Vue d'ensemble des réservations et congés</p>
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
                    {dayLeaves.map((leave, idx) => {
                      const roomName = getRoomName(leave.referentId)
                      const collaboratorName = getCollaboratorName(leave.referentId)

                      return (
                        <div
                          key={`leave-${idx}`}
                          className="text-xs p-1 bg-red-100 text-red-800 rounded border border-red-200 print:border-red-300"
                        >
                          <span className="font-semibold">{roomName}</span>
                          {collaboratorName && <span> ({collaboratorName})</span>}: {leave.title || "Congé"}
                        </div>
                      )
                    })}
                  </div>
                )}

                {dayBookings.map((booking, idx) => {
                  const roomName = getRoomName(booking.roomId)
                  const collaboratorName = getCollaboratorName(booking.roomId)
                  const room = storeData.rooms.find((r) => r.id === booking.roomId)
                  const isTraining = room?.type === "training"

                  return (
                    <div
                      key={`booking-${idx}`}
                      className={`text-xs p-1 mt-1 rounded truncate border-l-4 ${getRoomColor(
                        booking.roomId,
                      )} print:border print:bg-white print:text-black`}
                      title={`${booking.title} (${booking.startTime}-${booking.endTime}) - ${roomName}`}
                    >
                      <span className="font-semibold">{roomName}</span>
                      {collaboratorName && !isTraining && <span> ({collaboratorName})</span>}: {booking.startTime}-
                      {booking.endTime} {booking.title}
                    </div>
                  )
                })}
              </div>
            )
          })}
        </div>
      </CardContent>
    </Card>
  )
}

