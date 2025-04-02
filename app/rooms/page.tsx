import { RoomManager } from "@/components/room-manager"

export default function RoomsPage() {
  return (
    <main className="container mx-auto py-8 px-4">
      <h1 className="text-3xl font-bold mb-8 text-center">Gestion des Espaces</h1>

      <div className="max-w-2xl mx-auto">
        <RoomManager />
      </div>
    </main>
  )
}

