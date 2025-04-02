"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Checkbox } from "@/components/ui/checkbox"
import { useBookingStore } from "@/lib/store"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { AlertCircle } from "lucide-react"

export function BookingForm() {
  const { addBooking, selectedRoom, customTrainingTypes, rooms, leaves, bookings } = useBookingStore()
  const [showLeaveWarning, setShowLeaveWarning] = useState(false)
  const [leaveWarningMessage, setLeaveWarningMessage] = useState("")

  const [formData, setFormData] = useState({
    title: "",
    date: "",
    startTime: "",
    endTime: "",
    type: "",
    description: "",
    isRecurring: false,
    recurrenceEndDate: "",
    recurrencePattern: "weekly" as "daily" | "weekly" | "monthly" | "yearly",
  })

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const handleSelectChange = (value: string) => {
    setFormData((prev) => ({ ...prev, type: value }))
  }

  const handleRecurrencePatternChange = (value: string) => {
    setFormData((prev) => ({
      ...prev,
      recurrencePattern: value as "daily" | "weekly" | "monthly" | "yearly",
    }))
  }

  const handleCheckboxChange = (checked: boolean) => {
    setFormData((prev) => ({ ...prev, isRecurring: checked }))
  }

  // Vérifier si la date sélectionnée est pendant un congé
  useEffect(() => {
    if (formData.date && selectedRoom) {
      // Vérifier si la salle sélectionnée est un bureau
      const selectedRoomObj = rooms.find((room) => room.id === selectedRoom)

      if (selectedRoomObj?.type === "office") {
        // Vérifier si le référent est en congé à cette date
        const bookingDate = new Date(formData.date)

        const referentLeave = leaves.find((leave) => {
          if (leave.referentId === selectedRoom) {
            const leaveStartDate = new Date(leave.startDate)
            const leaveEndDate = new Date(leave.endDate)
            return bookingDate >= leaveStartDate && bookingDate <= leaveEndDate
          }
          return false
        })

        if (referentLeave) {
          setShowLeaveWarning(true)
          setLeaveWarningMessage(
            `Attention : ${selectedRoomObj.name} est en congé du ${formatDate(referentLeave.startDate)} au ${formatDate(referentLeave.endDate)} (${referentLeave.title}).`,
          )
          return
        }
      }

      // Si on arrive ici, pas de congé trouvé
      setShowLeaveWarning(false)
    }
  }, [formData.date, selectedRoom, rooms, leaves])

  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    return new Intl.DateTimeFormat("fr-FR", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
    }).format(date)
  }

  const isRoomAvailable = (roomId: string, date: string, startTime: string, endTime: string): boolean => {
    if (!bookings || !Array.isArray(bookings)) return true

    return !bookings.some(
      (booking) =>
        booking.roomId === roomId &&
        booking.date === date &&
        ((booking.startTime <= startTime && booking.endTime > startTime) ||
          (booking.startTime < endTime && booking.endTime >= endTime) ||
          (booking.startTime >= startTime && booking.endTime <= endTime)),
    )
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()

    if (!selectedRoom) {
      alert("Veuillez sélectionner une salle ou un bureau")
      return
    }

    if (!formData.title || !formData.date || !formData.startTime || !formData.endTime) {
      alert("Veuillez remplir tous les champs obligatoires")
      return
    }

    if (formData.isRecurring && !formData.recurrenceEndDate) {
      alert("Veuillez spécifier une date de fin pour la récurrence")
      return
    }

    // Vérifier si l'espace est disponible
    if (!isRoomAvailable(selectedRoom, formData.date, formData.startTime, formData.endTime)) {
      alert("Cet espace n'est pas disponible pour la période sélectionnée")
      return
    }

    addBooking({
      id: Date.now().toString(),
      roomId: selectedRoom,
      title: formData.title,
      date: formData.date,
      startTime: formData.startTime,
      endTime: formData.endTime,
      type: formData.type,
      description: formData.description,
      isRecurring: formData.isRecurring,
      recurrenceEndDate: formData.recurrenceEndDate,
      recurrencePattern: formData.recurrencePattern,
    })

    // Reset form
    setFormData({
      title: "",
      date: "",
      startTime: "",
      endTime: "",
      type: "",
      description: "",
      isRecurring: false,
      recurrenceEndDate: "",
      recurrencePattern: "weekly",
    })
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Nouvelle réservation</CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="title">Titre</Label>
            <Input
              id="title"
              name="title"
              value={formData.title}
              onChange={handleChange}
              placeholder="Titre de la réservation"
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="date">Date</Label>
            <Input id="date" name="date" type="date" value={formData.date} onChange={handleChange} required />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="startTime">Heure de début</Label>
              <Input
                id="startTime"
                name="startTime"
                type="time"
                value={formData.startTime}
                onChange={handleChange}
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="endTime">Heure de fin</Label>
              <Input
                id="endTime"
                name="endTime"
                type="time"
                value={formData.endTime}
                onChange={handleChange}
                required
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="type">Type de formation</Label>
            <Select value={formData.type} onValueChange={handleSelectChange}>
              <SelectTrigger>
                <SelectValue placeholder="Sélectionner un type" />
              </SelectTrigger>
              <SelectContent>
                {customTrainingTypes.map((type) => (
                  <SelectItem key={type.id} value={type.name}>
                    {type.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="description">Description (optionnel)</Label>
            <Input
              id="description"
              name="description"
              value={formData.description}
              onChange={handleChange}
              placeholder="Détails supplémentaires"
            />
          </div>

          {showLeaveWarning && (
            <Alert variant="destructive">
              <AlertCircle className="h-4 w-4" />
              <AlertTitle>Attention</AlertTitle>
              <AlertDescription>{leaveWarningMessage}</AlertDescription>
            </Alert>
          )}

          <div className="flex items-center space-x-2">
            <Checkbox id="isRecurring" checked={formData.isRecurring} onCheckedChange={handleCheckboxChange} />
            <Label htmlFor="isRecurring">Événement récurrent</Label>
          </div>

          {formData.isRecurring && (
            <div className="space-y-4 p-4 border rounded-md bg-secondary/20">
              <div className="space-y-2">
                <Label htmlFor="recurrenceEndDate">Date de fin de récurrence</Label>
                <Input
                  id="recurrenceEndDate"
                  name="recurrenceEndDate"
                  type="date"
                  value={formData.recurrenceEndDate}
                  onChange={handleChange}
                  required={formData.isRecurring}
                />
              </div>

              <div className="space-y-2">
                <Label>Fréquence</Label>
                <RadioGroup
                  value={formData.recurrencePattern}
                  onValueChange={handleRecurrencePatternChange}
                  className="flex flex-col space-y-1"
                >
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="daily" id="daily" />
                    <Label htmlFor="daily">Quotidienne</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="weekly" id="weekly" />
                    <Label htmlFor="weekly">Hebdomadaire</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="monthly" id="monthly" />
                    <Label htmlFor="monthly">Mensuelle</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="yearly" id="yearly" />
                    <Label htmlFor="yearly">Annuelle</Label>
                  </div>
                </RadioGroup>
              </div>
            </div>
          )}

          <Button type="submit" className="w-full">
            Réserver
          </Button>
        </form>
      </CardContent>
    </Card>
  )
}

