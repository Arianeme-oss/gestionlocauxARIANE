"use client"

import { useEffect } from "react"
import { Button } from "@/components/ui/button"

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  useEffect(() => {
    // Loguer l'erreur sur la console
    console.error("Global error:", error)
  }, [error])

  return (
    <html>
      <body>
        <div className="container flex flex-col items-center justify-center min-h-screen text-center p-4">
          <h1 className="text-4xl font-bold mb-4">Erreur critique</h1>
          <p className="text-lg mb-8">
            Une erreur critique s'est produite dans l'application. Veuillez réessayer ou contacter l'administrateur.
          </p>
          <Button onClick={reset}>Réessayer</Button>
        </div>
      </body>
    </html>
  )
}

