"use client"

import type React from "react"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { useBookingStore, type Collaborator } from "@/lib/store"
import { Pencil, Trash2, Plus, Mail, Phone, UserCircle } from "lucide-react"
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

export function CollaboratorManager() {
  const { collaborators, addCollaborator, updateCollaborator, removeCollaborator, rooms } = useBookingStore()
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false)
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false)
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false)
  const [selectedCollaboratorId, setSelectedCollaboratorId] = useState<string | null>(null)

  const [formData, setFormData] = useState({
    name: "",
    role: "",
    email: "",
    phone: "",
  })

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const handleAddCollaborator = () => {
    if (formData.name.trim() && formData.role.trim()) {
      const newCollaborator: Collaborator = {
        id: Date.now().toString(),
        name: formData.name.trim(),
        role: formData.role.trim(),
        email: formData.email.trim() || undefined,
        phone: formData.phone.trim() || undefined,
      }

      addCollaborator(newCollaborator)
      setFormData({ name: "", role: "", email: "", phone: "" })
      setIsAddDialogOpen(false)
    }
  }

  const handleEditCollaborator = () => {
    if (selectedCollaboratorId && formData.name.trim() && formData.role.trim()) {
      updateCollaborator(selectedCollaboratorId, {
        name: formData.name.trim(),
        role: formData.role.trim(),
        email: formData.email.trim() || undefined,
        phone: formData.phone.trim() || undefined,
      })

      setFormData({ name: "", role: "", email: "", phone: "" })
      setSelectedCollaboratorId(null)
      setIsEditDialogOpen(false)
    }
  }

  const handleDeleteCollaborator = () => {
    if (selectedCollaboratorId) {
      removeCollaborator(selectedCollaboratorId)
      setSelectedCollaboratorId(null)
      setIsDeleteDialogOpen(false)
    }
  }

  const openEditDialog = (collaborator: Collaborator) => {
    setSelectedCollaboratorId(collaborator.id)
    setFormData({
      name: collaborator.name,
      role: collaborator.role,
      email: collaborator.email || "",
      phone: collaborator.phone || "",
    })
    setIsEditDialogOpen(true)
  }

  const openDeleteDialog = (collaboratorId: string) => {
    setSelectedCollaboratorId(collaboratorId)
    setIsDeleteDialogOpen(true)
  }

  // Vérifier si un collaborateur a un bureau associé
  const hasAssociatedOffice = (collaboratorId: string) => {
    return rooms.some((room) => room.collaboratorId === collaboratorId)
  }

  // Obtenir le nom du bureau associé
  const getAssociatedOfficeName = (collaboratorId: string) => {
    const room = rooms.find((room) => room.collaboratorId === collaboratorId)
    return room ? room.name : ""
  }

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle>Gestion des collaborateurs</CardTitle>
        <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
          <DialogTrigger asChild>
            <Button size="sm" className="flex items-center gap-1">
              <Plus className="h-4 w-4" />
              <span>Ajouter</span>
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Ajouter un collaborateur</DialogTitle>
              <DialogDescription>Créez un nouveau collaborateur.</DialogDescription>
            </DialogHeader>

            <div className="space-y-4 py-4">
              <div className="space-y-2">
                <Label htmlFor="name">Nom</Label>
                <Input
                  id="name"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  placeholder="Nom du collaborateur"
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="role">Fonction</Label>
                <Input
                  id="role"
                  name="role"
                  value={formData.role}
                  onChange={handleChange}
                  placeholder="Fonction du collaborateur"
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="email">Email (optionnel)</Label>
                <Input
                  id="email"
                  name="email"
                  type="email"
                  value={formData.email}
                  onChange={handleChange}
                  placeholder="Email du collaborateur"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="phone">Téléphone (optionnel)</Label>
                <Input
                  id="phone"
                  name="phone"
                  value={formData.phone}
                  onChange={handleChange}
                  placeholder="Téléphone du collaborateur"
                />
              </div>
            </div>

            <DialogFooter>
              <DialogClose asChild>
                <Button variant="outline">Annuler</Button>
              </DialogClose>
              <Button onClick={handleAddCollaborator}>Ajouter</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </CardHeader>
      <CardContent>
        {collaborators.length === 0 ? (
          <p className="text-center text-muted-foreground py-4">Aucun collaborateur</p>
        ) : (
          <div className="space-y-4">
            {collaborators.map((collaborator) => (
              <div key={collaborator.id} className="p-4 border rounded-md">
                <div className="flex justify-between items-start">
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <UserCircle className="h-5 w-5 text-primary" />
                      <h3 className="font-medium text-lg">{collaborator.name}</h3>
                    </div>
                    <p className="text-sm text-muted-foreground">{collaborator.role}</p>

                    {hasAssociatedOffice(collaborator.id) && (
                      <p className="text-sm">
                        <span className="font-medium">Bureau :</span> {getAssociatedOfficeName(collaborator.id)}
                      </p>
                    )}

                    {collaborator.email && (
                      <div className="flex items-center gap-1 text-sm">
                        <Mail className="h-3.5 w-3.5" />
                        <span>{collaborator.email}</span>
                      </div>
                    )}

                    {collaborator.phone && (
                      <div className="flex items-center gap-1 text-sm">
                        <Phone className="h-3.5 w-3.5" />
                        <span>{collaborator.phone}</span>
                      </div>
                    )}
                  </div>

                  <div className="flex items-center space-x-2">
                    <Button variant="ghost" size="icon" onClick={() => openEditDialog(collaborator)}>
                      <Pencil className="h-4 w-4" />
                    </Button>
                    <Button variant="ghost" size="icon" onClick={() => openDeleteDialog(collaborator.id)}>
                      <Trash2 className="h-4 w-4 text-destructive" />
                    </Button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Edit Dialog */}
        <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Modifier le collaborateur</DialogTitle>
              <DialogDescription>Modifiez les informations de ce collaborateur.</DialogDescription>
            </DialogHeader>

            <div className="space-y-4 py-4">
              <div className="space-y-2">
                <Label htmlFor="edit-name">Nom</Label>
                <Input
                  id="edit-name"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  placeholder="Nom du collaborateur"
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="edit-role">Fonction</Label>
                <Input
                  id="edit-role"
                  name="role"
                  value={formData.role}
                  onChange={handleChange}
                  placeholder="Fonction du collaborateur"
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="edit-email">Email (optionnel)</Label>
                <Input
                  id="edit-email"
                  name="email"
                  type="email"
                  value={formData.email}
                  onChange={handleChange}
                  placeholder="Email du collaborateur"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="edit-phone">Téléphone (optionnel)</Label>
                <Input
                  id="edit-phone"
                  name="phone"
                  value={formData.phone}
                  onChange={handleChange}
                  placeholder="Téléphone du collaborateur"
                />
              </div>
            </div>

            <DialogFooter>
              <DialogClose asChild>
                <Button variant="outline">Annuler</Button>
              </DialogClose>
              <Button onClick={handleEditCollaborator}>Enregistrer</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>

        {/* Delete Dialog */}
        <Dialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Supprimer le collaborateur</DialogTitle>
              <DialogDescription>
                Êtes-vous sûr de vouloir supprimer ce collaborateur ?
                {selectedCollaboratorId && hasAssociatedOffice(selectedCollaboratorId) && (
                  <span className="block mt-2 text-destructive">
                    Attention : Ce collaborateur est associé au bureau {getAssociatedOfficeName(selectedCollaboratorId)}
                    . La suppression ne supprimera pas le bureau, mais l'association sera perdue.
                  </span>
                )}
              </DialogDescription>
            </DialogHeader>

            <DialogFooter>
              <DialogClose asChild>
                <Button variant="outline">Annuler</Button>
              </DialogClose>
              <Button variant="destructive" onClick={handleDeleteCollaborator}>
                Supprimer
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </CardContent>
    </Card>
  )
}

