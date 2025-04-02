import { Calendar } from "@/components/calendar"
import { RoomSelector } from "@/components/room-selector"
import { BookingForm } from "@/components/booking-form"

export default function Home() {
  return (
    <main className="container mx-auto py-8 px-4">
      <h1 className="text-3xl font-bold mb-8 text-center">Système de Gestion des Salles et Bureaux</h1>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-1">
          <RoomSelector />
          <BookingForm />
        </div>
        <div className="lg:col-span-2">
          <Calendar />
        </div>
      </div>
    </main>
  )
}

