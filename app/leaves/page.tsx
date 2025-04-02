import { LeaveManager } from "@/components/leave-manager"

export default function LeavesPage() {
  return (
    <main className="container mx-auto py-8 px-4">
      <h1 className="text-3xl font-bold mb-8 text-center">Gestion des Congés</h1>

      <div className="max-w-2xl mx-auto">
        <LeaveManager />
      </div>
    </main>
  )
}

