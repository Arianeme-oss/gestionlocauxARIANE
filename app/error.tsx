"use client"

import { useEffect } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  useEffect(() => {
    // Loguer l'erreur sur la console
    console.error("Application error:", error)
  }, [error])

  return (
    <div className="container flex flex-col items-center justify-center min-h-[70vh] text-center">
      <h1 className="text-4xl font-bold mb-4">Une erreur est survenue</h1>
      <p className="text-lg mb-8">Nous sommes désolés, une erreur s'est produite lors du chargement de cette page.</p>
      <div className="flex gap-4">
        <Button onClick={reset}>Réessayer</Button>
        <Link href="/">
          <Button variant="outline">Retour à l'accueil</Button>
        </Link>
      </div>
    </div>
  )
}

