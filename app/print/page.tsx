"use client"

import { useEffect, useState } from "react"
import { Calendar } from "@/components/calendar"
import { MultiRoomCalendar } from "@/components/multi-room-calendar"
import { MultiRoomSelector } from "@/components/multi-room-selector"
import { useBookingStore } from "@/lib/store"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

export default function PrintPage() {
  const { selectedRoom, setSelectedRoom, selectedRooms, rooms } = useBookingStore()
  const [loaded, setLoaded] = useState(false)
  const [printMode, setPrintMode] = useState<"single" | "multiple">("single")
  const [isMounted, setIsMounted] = useState(false)

  // Set loaded state after initial render
  useEffect(() => {
    setIsMounted(true)
    setLoaded(true)

    // If no room is selected, default to the first room
    if (!selectedRoom && rooms.length > 0) {
      setSelectedRoom(rooms[0].id)
    }
  }, [selectedRoom, setSelectedRoom, rooms])

  if (!isMounted) {
    return null // Retourne null pendant le rendu côté serveur
  }

  if (!loaded) {
    return <div>Chargement...</div>
  }

  return (
    <main className="container mx-auto py-8 px-4">
      <div className="flex justify-between items-center mb-6 print:hidden">
        <h1 className="text-3xl font-bold">Imprimer le calendrier</h1>
        <button
          onClick={() => window.print()}
          className="px-4 py-2 bg-primary text-primary-foreground rounded-md hover:bg-primary/80"
        >
          Imprimer
        </button>
      </div>

      <div className="mb-6 print:hidden">
        <Tabs
          defaultValue="single"
          value={printMode}
          onValueChange={(value) => setPrintMode(value as "single" | "multiple")}
          className="w-full"
        >
          <TabsList className="grid grid-cols-2 mb-4 w-full max-w-md mx-auto">
            <TabsTrigger value="single">Un seul espace</TabsTrigger>
            <TabsTrigger value="multiple">Plusieurs espaces</TabsTrigger>
          </TabsList>

          <TabsContent value="single">
            <div className="mb-6">
              <label className="block text-sm font-medium mb-2">Sélectionner un espace</label>
              <Select value={selectedRoom || (rooms.length > 0 ? rooms[0].id : "")} onValueChange={setSelectedRoom}>
                <SelectTrigger className="w-full max-w-xs">
                  <SelectValue placeholder="Sélectionner un espace" />
                </SelectTrigger>
                <SelectContent>
                  {rooms.map((room) => (
                    <SelectItem key={room.id} value={room.id}>
                      {room.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </TabsContent>

          <TabsContent value="multiple">
            <MultiRoomSelector />
          </TabsContent>
        </Tabs>
      </div>

      <div className="hidden print:block text-center mb-4">
        <h1 className="text-2xl font-bold">
          {printMode === "single"
            ? `Calendrier - ${rooms.find((r) => r.id === selectedRoom)?.name || ""}`
            : "Calendrier multi-espaces"}
        </h1>
      </div>

      {printMode === "single" ? <Calendar /> : <MultiRoomCalendar />}
    </main>
  )
}

