import { TrainingTypesManager } from "@/components/training-types-manager"

export default function ActionsPage() {
  return (
    <main className="container mx-auto py-8 px-4">
      <h1 className="text-3xl font-bold mb-8 text-center">Gestion des Actions de Formation</h1>

      <div className="max-w-2xl mx-auto">
        <TrainingTypesManager />
      </div>
    </main>
  )
}

