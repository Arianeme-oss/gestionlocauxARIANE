import Link from "next/link"
import { Button } from "@/components/ui/button"

export default function NotFound() {
  return (
    <div className="container flex flex-col items-center justify-center min-h-[70vh] text-center">
      <h1 className="text-4xl font-bold mb-4">404 - Page non trouvée</h1>
      <p className="text-lg mb-8">Désolé, la page que vous recherchez n'existe pas ou a été déplacée.</p>
      <Link href="/">
        <Button>Retour à l'accueil</Button>
      </Link>
    </div>
  )
}

