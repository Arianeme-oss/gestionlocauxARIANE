import { CollaboratorManager } from "@/components/collaborator-manager"

export default function CollaboratorsPage() {
  return (
    <main className="container mx-auto py-8 px-4">
      <h1 className="text-3xl font-bold mb-8 text-center">Gestion des Collaborateurs</h1>

      <div className="max-w-2xl mx-auto">
        <CollaboratorManager />
      </div>
    </main>
  )
}

