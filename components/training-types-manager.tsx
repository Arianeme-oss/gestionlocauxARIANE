"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Trash2, Plus } from "lucide-react"
import { useBookingStore, type TrainingType } from "@/lib/store"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter,
  DialogClose,
} from "@/components/ui/dialog"

export function TrainingTypesManager() {
  const { customTrainingTypes, addTrainingType, removeTrainingType } = useBookingStore()
  const [newTypeName, setNewTypeName] = useState("")
  const [selectedTypeId, setSelectedTypeId] = useState<string | null>(null)

  const handleAddType = () => {
    if (newTypeName.trim()) {
      const newType: TrainingType = {
        id: Date.now().toString(),
        name: newTypeName.trim(),
      }

      addTrainingType(newType)
      setNewTypeName("")
    }
  }

  const handleDeleteType = (id: string) => {
    removeTrainingType(id)
    setSelectedTypeId(null)
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Gestion des types de formation</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div className="flex gap-2">
            <Input
              value={newTypeName}
              onChange={(e) => setNewTypeName(e.target.value)}
              placeholder="Nouveau type de formation"
            />
            <Button onClick={handleAddType} size="icon">
              <Plus className="h-4 w-4" />
            </Button>
          </div>

          <div className="space-y-2 mt-4">
            <Label>Types de formation existants</Label>
            {customTrainingTypes.map((type) => (
              <div key={type.id} className="flex items-center justify-between p-2 border rounded-md">
                <span>{type.name}</span>
                <Dialog>
                  <DialogTrigger asChild>
                    <Button variant="ghost" size="icon" onClick={() => setSelectedTypeId(type.id)}>
                      <Trash2 className="h-4 w-4 text-destructive" />
                    </Button>
                  </DialogTrigger>
                  <DialogContent>
                    <DialogHeader>
                      <DialogTitle>Supprimer le type de formation</DialogTitle>
                      <DialogDescription>
                        Êtes-vous sûr de vouloir supprimer ce type de formation ? Cette action est irréversible.
                      </DialogDescription>
                    </DialogHeader>
                    <DialogFooter className="flex space-x-2 justify-end">
                      <DialogClose asChild>
                        <Button variant="outline">Annuler</Button>
                      </DialogClose>
                      <Button variant="destructive" onClick={() => selectedTypeId && handleDeleteType(selectedTypeId)}>
                        Supprimer
                      </Button>
                    </DialogFooter>
                  </DialogContent>
                </Dialog>
              </div>
            ))}
          </div>
        </div>
      </CardContent>
    </Card>
  )
}

