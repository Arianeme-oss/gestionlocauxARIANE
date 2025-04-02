"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { useBookingStore } from "@/lib/store"

export function RoomSelector() {
  const { setSelectedRoom, selectedRoom, rooms } = useBookingStore()

  const trainingRooms = rooms.filter((room) => room.type === "training")
  const officeRooms = rooms.filter((room) => room.type === "office")

  return (
    <Card className="mb-6">
      <CardHeader>
        <CardTitle>Sélection d'espace</CardTitle>
      </CardHeader>
      <CardContent>
        <Tabs defaultValue="training" className="w-full">
          <TabsList className="grid grid-cols-2 mb-4">
            <TabsTrigger value="training">Salles de formation</TabsTrigger>
            <TabsTrigger value="offices">Bureaux des référents</TabsTrigger>
          </TabsList>

          <TabsContent value="training" className="space-y-2">
            {trainingRooms.length === 0 ? (
              <p className="text-center text-muted-foreground py-4">Aucune salle de formation</p>
            ) : (
              trainingRooms.map((room) => (
                <div
                  key={room.id}
                  className={`p-3 rounded-md cursor-pointer transition-colors ${
                    selectedRoom === room.id
                      ? "bg-primary text-primary-foreground"
                      : "bg-secondary hover:bg-secondary/80"
                  }`}
                  onClick={() => setSelectedRoom(room.id)}
                >
                  {room.name}
                </div>
              ))
            )}
          </TabsContent>

          <TabsContent value="offices" className="space-y-2">
            {officeRooms.length === 0 ? (
              <p className="text-center text-muted-foreground py-4">Aucun bureau</p>
            ) : (
              officeRooms.map((room) => (
                <div
                  key={room.id}
                  className={`p-3 rounded-md cursor-pointer transition-colors ${
                    selectedRoom === room.id
                      ? "bg-primary text-primary-foreground"
                      : "bg-secondary hover:bg-secondary/80"
                  }`}
                  onClick={() => setSelectedRoom(room.id)}
                >
                  {room.name}
                </div>
              ))
            )}
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  )
}

