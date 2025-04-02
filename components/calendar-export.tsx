"use client"

import { Button } from "@/components/ui/button"
import { Printer, Download, FileDown } from "lucide-react"
import { useBookingStore } from "@/lib/store"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"

interface CalendarExportProps {
  currentMonth: number
  currentYear: number
  multiRoom?: boolean
}

export function CalendarExport({ currentMonth, currentYear, multiRoom = false }: CalendarExportProps) {
  const { bookings, selectedRoom, selectedRooms, rooms } = useBookingStore()

  // Handle printing
  const handlePrint = () => {
    window.print()
  }

  // Get room name by id
  const getRoomName = (roomId: string) => {
    const room = rooms.find((r) => r.id === roomId)
    return room ? room.name : roomId
  }

  // Handle CSV export
  const handleExportCSV = () => {
    // Filter bookings for the selected room(s) and current month
    const filteredBookings = bookings.filter((booking) => {
      const bookingDate = new Date(booking.date)
      if (multiRoom) {
        return (
          selectedRooms.includes(booking.roomId) &&
          bookingDate.getMonth() === currentMonth &&
          bookingDate.getFullYear() === currentYear
        )
      } else {
        return (
          booking.roomId === selectedRoom &&
          bookingDate.getMonth() === currentMonth &&
          bookingDate.getFullYear() === currentYear
        )
      }
    })

    // Create CSV header
    let csvContent = "Espace,Titre,Date,Heure de début,Heure de fin,Type,Description,Récurrent\n"

    // Add booking data
    filteredBookings.forEach((booking) => {
      const date = new Date(booking.date)
      const formattedDate = `${date.getDate().toString().padStart(2, "0")}/${(date.getMonth() + 1).toString().padStart(2, "0")}/${date.getFullYear()}`

      // Escape commas and quotes in text fields
      const roomName = `"${getRoomName(booking.roomId).replace(/"/g, '""')}"`
      const title = `"${booking.title.replace(/"/g, '""')}"`
      const type = booking.type ? `"${booking.type.replace(/"/g, '""')}"` : ""
      const description = booking.description ? `"${booking.description.replace(/"/g, '""')}"` : ""

      csvContent += `${roomName},${title},${formattedDate},${booking.startTime},${booking.endTime},${type},${description},${booking.isRecurring ? "Oui" : "Non"}\n`
    })

    // Create download link
    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" })
    const url = URL.createObjectURL(blob)
    const link = document.createElement("a")
    const months = [
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

    link.href = url
    link.setAttribute("download", `calendrier_${months[currentMonth]}_${currentYear}${multiRoom ? "_multi" : ""}.csv`)
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
  }

  return (
    <div className="flex space-x-2">
      <Button variant="outline" size="sm" className="print:hidden flex gap-1 items-center" onClick={handlePrint}>
        <Printer className="h-4 w-4" />
        <span className="hidden sm:inline">Imprimer</span>
      </Button>

      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="outline" size="sm" className="print:hidden flex gap-1 items-center">
            <Download className="h-4 w-4" />
            <span className="hidden sm:inline">Exporter</span>
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end">
          <DropdownMenuItem onClick={handleExportCSV}>
            <FileDown className="h-4 w-4 mr-2" />
            <span>Exporter en CSV</span>
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  )
}

