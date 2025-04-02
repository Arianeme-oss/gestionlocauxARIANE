"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Checkbox } from "@/components/ui/checkbox"
import { Label } from "@/components/ui/label"
import { Button } from "@/components/ui/button"
import { useBookingStore } from "@/lib/store"

export function MultiRoomSelector() {
  const { rooms, selectedRooms, toggleSelectedRoom, setSelectedRooms } = useBookingStore()

  const trainingRooms = rooms.filter((room) => room.type === "training")
  const officeRooms = rooms.filter((room) => room.type === "office")

  const handleSelectAll = (type: "training" | "office") => {
    const roomsToSelect = rooms.filter((room) => room.type === type).map((room) => room.id)

    // Add these rooms to the selection, keeping existing selections of other type
    const otherTypeRooms = selectedRooms.filter((id) => {
      const room = rooms.find((r) => r.id === id)
      return room && room.type !== type
    })

    setSelectedRooms([...otherTypeRooms, ...roomsToSelect])
  }

  const handleDeselectAll = (type: "training" | "office") => {
    // Keep only rooms of other type
    const otherTypeRooms = selectedRooms.filter((id) => {
      const room = rooms.find((r) => r.id === id)
      return room && room.type !== type
    })

    setSelectedRooms(otherTypeRooms)
  }

  return (
    <Card className="mb-6">
      <CardHeader>
        <CardTitle>Sélection des espaces à imprimer</CardTitle>
      </CardHeader>
      <CardContent>
        <Tabs defaultValue="training" className="w-full">
          <TabsList className="grid grid-cols-2 mb-4">
            <TabsTrigger value="training">Salles de formation</TabsTrigger>
            <TabsTrigger value="offices">Bureaux des référents</TabsTrigger>
          </TabsList>

          <TabsContent value="training" className="space-y-4">
            <div className="flex justify-between">
              <Button variant="outline" size="sm" onClick={() => handleSelectAll("training")}>
                Tout sélectionner
              </Button>
              <Button variant="outline" size="sm" onClick={() => handleDeselectAll("training")}>
                Tout désélectionner
              </Button>
            </div>

            {trainingRooms.length === 0 ? (
              <p className="text-center text-muted-foreground py-4">Aucune salle de formation</p>
            ) : (
              <div className="space-y-2">
                {trainingRooms.map((room) => (
                  <div key={room.id} className="flex items-center space-x-2 p-2 border rounded-md">
                    <Checkbox
                      id={`room-${room.id}`}
                      checked={selectedRooms.includes(room.id)}
                      onCheckedChange={() => toggleSelectedRoom(room.id)}
                    />
                    <Label htmlFor={`room-${room.id}`} className="flex-grow cursor-pointer">
                      {room.name}
                    </Label>
                  </div>
                ))}
              </div>
            )}
          </TabsContent>

          <TabsContent value="offices" className="space-y-4">
            <div className="flex justify-between">
              <Button variant="outline" size="sm" onClick={() => handleSelectAll("office")}>
                Tout sélectionner
              </Button>
              <Button variant="outline" size="sm" onClick={() => handleDeselectAll("office")}>
                Tout désélectionner
              </Button>
            </div>

            {officeRooms.length === 0 ? (
              <p className="text-center text-muted-foreground py-4">Aucun bureau</p>
            ) : (
              <div className="space-y-2">
                {officeRooms.map((room) => (
                  <div key={room.id} className="flex items-center space-x-2 p-2 border rounded-md">
                    <Checkbox
                      id={`room-${room.id}`}
                      checked={selectedRooms.includes(room.id)}
                      onCheckedChange={() => toggleSelectedRoom(room.id)}
                    />
                    <Label htmlFor={`room-${room.id}`} className="flex-grow cursor-pointer">
                      {room.name}
                    </Label>
                  </div>
                ))}
              </div>
            )}
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  )
}

