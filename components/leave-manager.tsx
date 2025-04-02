"use client"

import type React from "react"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { useBookingStore, type Leave } from "@/lib/store"
import { Pencil, Trash2, Plus, Calendar } from "lucide-react"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
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

export function LeaveManager() {
  const { leaves, addLeave, updateLeave, removeLeave, rooms, collaborators } = useBookingStore()
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false)
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false)
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false)
  const [selectedLeaveId, setSelectedLeaveId] = useState<string | null>(null)

  const [formData, setFormData] = useState({
    referentId: "",
    startDate: "",
    endDate: "",
    reason: "",
    title: "",
  })

  // Filtrer uniquement les bureaux (référents)
  const referentRooms = rooms.filter((room) => room.type === "office")

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const handleReferentChange = (value: string) => {
    setFormData((prev) => ({ ...prev, referentId: value }))
  }

  const handleAddLeave = () => {
    if (formData.referentId && formData.startDate && formData.endDate && formData.title) {
      const newLeave: Leave = {
        id: Date.now().toString(),
        referentId: formData.referentId,
        startDate: formData.startDate,
        endDate: formData.endDate,
        reason: formData.reason,
        title: formData.title,
      }

      addLeave(newLeave)
      resetForm()
      setIsAddDialogOpen(false)
    }
  }

  const handleEditLeave = () => {
    if (selectedLeaveId && formData.referentId && formData.startDate && formData.endDate && formData.title) {
      updateLeave(selectedLeaveId, {
        referentId: formData.referentId,
        startDate: formData.startDate,
        endDate: formData.endDate,
        reason: formData.reason,
        title: formData.title,
      })

      resetForm()
      setSelectedLeaveId(null)
      setIsEditDialogOpen(false)
    }
  }

  const handleDeleteLeave = () => {
    if (selectedLeaveId) {
      removeLeave(selectedLeaveId)
      setSelectedLeaveId(null)
      setIsDeleteDialogOpen(false)
    }
  }

  const openEditDialog = (leave: Leave) => {
    setSelectedLeaveId(leave.id)
    setFormData({
      referentId: leave.referentId,
      startDate: leave.startDate,
      endDate: leave.endDate,
      reason: leave.reason,
      title: leave.title,
    })
    setIsEditDialogOpen(true)
  }

  const resetForm = () => {
    setFormData({
      referentId: "",
      startDate: "",
      endDate: "",
      reason: "",
      title: "",
    })
  }

  const getReferentName = (referentId: string) => {
    const room = rooms.find((r) => r.id === referentId)
    if (room) {
      if (room.collaboratorId) {
        const collaborator = collaborators.find((c) => c.id === room.collaboratorId)
        return collaborator ? collaborator.name : room.name
      }
      return room.name
    }
    return referentId
  }

  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    return new Intl.DateTimeFormat("fr-FR", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
    }).format(date)
  }

  // Trier les congés par date de début (les plus récents en premier)
  const sortedLeaves = [...leaves].sort((a, b) => {
    return new Date(b.startDate).getTime() - new Date(a.startDate).getTime()
  })

  const openDeleteDialog = (leaveId: string) => {
    setSelectedLeaveId(leaveId)
    setIsDeleteDialogOpen(true)
  }

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle>Gestion des congés</CardTitle>
        <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
          <DialogTrigger asChild>
            <Button size="sm" className="flex items-center gap-1">
              <Plus className="h-4 w-4" />
              <span>Ajouter</span>
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Ajouter un congé</DialogTitle>
              <DialogDescription>Enregistrez une période de congé pour un référent.</DialogDescription>
            </DialogHeader>

            <div className="space-y-4 py-4">
              <div className="space-y-2">
                <Label htmlFor="referentId">Référent</Label>
                <Select value={formData.referentId} onValueChange={handleReferentChange}>
                  <SelectTrigger>
                    <SelectValue placeholder="Sélectionner un référent" />
                  </SelectTrigger>
                  <SelectContent>
                    {referentRooms.map((room) => (
                      <SelectItem key={room.id} value={room.id}>
                        {getReferentName(room.id)}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="startDate">Date de début</Label>
                  <Input
                    id="startDate"
                    name="startDate"
                    type="date"
                    value={formData.startDate}
                    onChange={handleChange}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="endDate">Date de fin</Label>
                  <Input
                    id="endDate"
                    name="endDate"
                    type="date"
                    value={formData.endDate}
                    onChange={handleChange}
                    required
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="reason">Motif (optionnel)</Label>
                <Textarea
                  id="reason"
                  name="reason"
                  value={formData.reason}
                  onChange={handleChange}
                  placeholder="Motif du congé"
                  rows={3}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="title">Titre</Label>
                <Input
                  id="title"
                  name="title"
                  value={formData.title}
                  onChange={handleChange}
                  placeholder="Titre du congé"
                  required
                />
              </div>
            </div>

            <DialogFooter>
              <DialogClose asChild>
                <Button variant="outline">Annuler</Button>
              </DialogClose>
              <Button onClick={handleAddLeave}>Ajouter</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </CardHeader>
      <CardContent>
        {sortedLeaves.length === 0 ? (
          <p className="text-center text-muted-foreground py-4">Aucun congé enregistré</p>
        ) : (
          <div className="space-y-4">
            {sortedLeaves.map((leave) => (
              <div key={leave.id} className="flex items-center justify-between p-4 border rounded-md">
                <div className="space-y-1">
                  <div className="font-medium">{getReferentName(leave.referentId)}</div>
                  <div className="flex items-center text-sm text-muted-foreground">
                    <Calendar className="h-3.5 w-3.5 mr-1" />
                    <span>
                      Du {formatDate(leave.startDate)} au {formatDate(leave.endDate)}
                    </span>
                  </div>
                  {leave.reason && <div className="text-sm mt-1">{leave.reason}</div>}
                  {leave.title && <div className="text-sm mt-1">{leave.title}</div>}
                </div>
                <div className="flex items-center space-x-2">
                  <Button variant="ghost" size="icon" onClick={() => openEditDialog(leave)}>
                    <Pencil className="h-4 w-4" />
                  </Button>
                  <Button variant="ghost" size="icon" onClick={() => openDeleteDialog(leave.id)}>
                    <Trash2 className="h-4 w-4 text-destructive" />
                  </Button>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Edit Dialog */}
        <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Modifier le congé</DialogTitle>
              <DialogDescription>Modifiez les informations de ce congé.</DialogDescription>
            </DialogHeader>

            <div className="space-y-4 py-4">
              <div className="space-y-2">
                <Label htmlFor="edit-referentId">Référent</Label>
                <Select value={formData.referentId} onValueChange={handleReferentChange}>
                  <SelectTrigger>
                    <SelectValue placeholder="Sélectionner un référent" />
                  </SelectTrigger>
                  <SelectContent>
                    {referentRooms.map((room) => (
                      <SelectItem key={room.id} value={room.id}>
                        {getReferentName(room.id)}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="edit-startDate">Date de début</Label>
                  <Input
                    id="edit-startDate"
                    name="startDate"
                    type="date"
                    value={formData.startDate}
                    onChange={handleChange}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="edit-endDate">Date de fin</Label>
                  <Input
                    id="edit-endDate"
                    name="endDate"
                    type="date"
                    value={formData.endDate}
                    onChange={handleChange}
                    required
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="edit-reason">Motif (optionnel)</Label>
                <Textarea
                  id="edit-reason"
                  name="reason"
                  value={formData.reason}
                  onChange={handleChange}
                  placeholder="Motif du congé"
                  rows={3}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="edit-title">Titre</Label>
                <Input
                  id="edit-title"
                  name="title"
                  value={formData.title}
                  onChange={handleChange}
                  placeholder="Titre du congé"
                  required
                />
              </div>
            </div>

            <DialogFooter>
              <DialogClose asChild>
                <Button variant="outline">Annuler</Button>
              </DialogClose>
              <Button onClick={handleEditLeave}>Enregistrer</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>

        {/* Delete Dialog */}
        <Dialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Supprimer le congé</DialogTitle>
              <DialogDescription>Êtes-vous sûr de vouloir supprimer ce congé ?</DialogDescription>
            </DialogHeader>

            <DialogFooter>
              <DialogClose asChild>
                <Button variant="outline">Annuler</Button>
              </DialogClose>
              <Button variant="destructive" onClick={handleDeleteLeave}>
                Supprimer
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </CardContent>
    </Card>
  )
}

