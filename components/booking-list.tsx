"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { useBookingStore } from "@/lib/store"
import { Trash2, RefreshCw } from "lucide-react"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter,
  DialogClose,
} from "@/components/ui/dialog"
import { Badge } from "@/components/ui/badge"

export function BookingList() {
  const { bookings, removeBooking, selectedRoom } = useBookingStore()
  const [selectedBooking, setSelectedBooking] = useState<string | null>(null)

  // Filter bookings for the selected room
  const filteredBookings = selectedRoom ? bookings.filter((booking) => booking.roomId === selectedRoom) : bookings

  // Sort bookings by date
  const sortedBookings = [...filteredBookings].sort((a, b) => {
    return new Date(a.date).getTime() - new Date(b.date).getTime()
  })

  const handleDelete = (id: string) => {
    removeBooking(id)
    setSelectedBooking(null)
  }

  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    return new Intl.DateTimeFormat("fr-FR", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
    }).format(date)
  }

  // Group bookings by date
  const bookingsByDate = sortedBookings.reduce(
    (acc, booking) => {
      const date = booking.date
      if (!acc[date]) {
        acc[date] = []
      }
      acc[date].push(booking)
      return acc
    },
    {} as Record<string, typeof sortedBookings>,
  )

  // Get dates sorted chronologically
  const sortedDates = Object.keys(bookingsByDate).sort((a, b) => {
    return new Date(a).getTime() - new Date(b).getTime()
  })

  return (
    <Card>
      <CardHeader>
        <CardTitle>Réservations</CardTitle>
      </CardHeader>
      <CardContent>
        {sortedBookings.length === 0 ? (
          <p className="text-center text-muted-foreground py-4">Aucune réservation pour cet espace</p>
        ) : (
          <div className="space-y-6">
            {sortedDates.map((date) => (
              <div key={date} className="space-y-2">
                <h3 className="font-medium text-lg border-b pb-1">{formatDate(date)}</h3>

                <div className="space-y-2">
                  {bookingsByDate[date].map((booking) => (
                    <div key={booking.id} className="p-4 border rounded-md hover:bg-accent transition-colors">
                      <div className="flex justify-between items-start">
                        <div>
                          <div className="flex items-center gap-2">
                            <h3 className="font-medium">{booking.title}</h3>
                            {booking.isRecurring && (
                              <Badge variant="outline" className="flex items-center gap-1">
                                <RefreshCw className="h-3 w-3" />
                                <span>Récurrent</span>
                              </Badge>
                            )}
                          </div>

                          <p className="text-sm text-muted-foreground">
                            {booking.startTime} - {booking.endTime}
                          </p>

                          {booking.type && (
                            <span className="inline-block mt-1 text-xs px-2 py-1 bg-secondary rounded-full">
                              {booking.type}
                            </span>
                          )}

                          {booking.isRecurring && booking.recurrenceEndDate && (
                            <p className="text-xs mt-1 text-muted-foreground">
                              Récurrence{" "}
                              {booking.recurrencePattern === "daily"
                                ? "quotidienne"
                                : booking.recurrencePattern === "weekly"
                                  ? "hebdomadaire"
                                  : "mensuelle"}
                              jusqu'au {formatDate(booking.recurrenceEndDate)}
                            </p>
                          )}

                          {booking.description && <p className="mt-2 text-sm">{booking.description}</p>}
                        </div>

                        <Dialog>
                          <DialogTrigger asChild>
                            <Button variant="ghost" size="icon" onClick={() => setSelectedBooking(booking.id)}>
                              <Trash2 className="h-4 w-4 text-destructive" />
                            </Button>
                          </DialogTrigger>
                          <DialogContent>
                            <DialogHeader>
                              <DialogTitle>Supprimer la réservation</DialogTitle>
                              <DialogDescription>
                                {booking.isRecurring
                                  ? "Attention : cette action supprimera toutes les occurrences de cet événement récurrent."
                                  : "Êtes-vous sûr de vouloir supprimer cette réservation ? Cette action est irréversible."}
                              </DialogDescription>
                            </DialogHeader>
                            <DialogFooter className="flex space-x-2 justify-end">
                              <DialogClose asChild>
                                <Button variant="outline">Annuler</Button>
                              </DialogClose>
                              <Button
                                variant="destructive"
                                onClick={() => selectedBooking && handleDelete(selectedBooking.split("-")[0])}
                              >
                                Supprimer
                              </Button>
                            </DialogFooter>
                          </DialogContent>
                        </Dialog>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  )
}

