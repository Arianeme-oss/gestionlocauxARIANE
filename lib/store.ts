"use client"

import { create } from "zustand"
import { persist } from "zustand/middleware"

export interface Booking {
  id: string
  roomId: string
  title: string
  date: string
  startTime: string
  endTime: string
  type: string
  description: string
  isRecurring?: boolean
  recurrenceEndDate?: string
  recurrencePattern?: "daily" | "weekly" | "monthly" | "yearly"
}

export interface TrainingType {
  id: string
  name: string
}

export interface Collaborator {
  id: string
  name: string
  role: string
  email?: string
  phone?: string
}

export interface Room {
  id: string
  name: string
  type: "training" | "office"
  collaboratorId?: string // Lien vers un collaborateur pour les bureaux
}

export interface Leave {
  id: string
  referentId: string // ID du référent associé au bureau
  startDate: string
  endDate: string
  reason: string
  title: string
}

interface BookingStore {
  bookings: Booking[]
  selectedRoom: string
  selectedRooms: string[]
  customTrainingTypes: TrainingType[]
  rooms: Room[]
  leaves: Leave[]
  collaborators: Collaborator[]
  addBooking: (booking: Booking) => void
  removeBooking: (id: string) => void
  setSelectedRoom: (roomId: string) => void
  setSelectedRooms: (roomIds: string[]) => void
  toggleSelectedRoom: (roomId: string) => void
  addTrainingType: (type: TrainingType) => void
  removeTrainingType: (id: string) => void
  addRoom: (room: Room) => void
  updateRoom: (id: string, updates: Partial<Room>) => void
  removeRoom: (id: string) => void
  addLeave: (leave: Leave) => void
  updateLeave: (id: string, updates: Partial<Leave>) => void
  removeLeave: (id: string) => void
  addCollaborator: (collaborator: Collaborator) => void
  updateCollaborator: (id: string, updates: Partial<Collaborator>) => void
  removeCollaborator: (id: string) => void
  isRoomAvailable: (
    roomId: string,
    date: string,
    startTime: string,
    endTime: string,
    excludeBookingId?: string,
  ) => boolean
}

// Default training types
const DEFAULT_TRAINING_TYPES: TrainingType[] = [
  { id: "1", name: "IDENTIFIER SES POTENTIELS" },
  { id: "2", name: "PREPARATION A L'EMPLOI" },
  { id: "3", name: "CONNAISSANCES DU MONDE DE L'ENTREPRISE" },
  { id: "4", name: "NUMERIQUE" },
  { id: "5", name: "SAVOIRS DE BASE" },
  { id: "6", name: "FAVORISER L'AGENTIVITE" },
  { id: "7", name: "AUTRE" },
]

// Default collaborators
const DEFAULT_COLLABORATORS: Collaborator[] = [
  { id: "collab1", name: "Kathy", role: "Formatrice" },
  { id: "collab2", name: "Yvan", role: "Formateur" },
  { id: "collab3", name: "Siham", role: "Formatrice" },
  { id: "collab4", name: "Kim", role: "Formatrice" },
  { id: "collab5", name: "Valérie", role: "Formatrice" },
  { id: "collab6", name: "Samira", role: "Formatrice" },
  { id: "collab7", name: "Laure", role: "Formatrice" },
]

// Default rooms
const DEFAULT_ROOMS: Room[] = [
  { id: "salle1", name: "Salle 1", type: "training" },
  { id: "salle2", name: "Salle 2", type: "training" },
  { id: "kathy", name: "Bureau Kathy", type: "office", collaboratorId: "collab1" },
  { id: "yvan", name: "Bureau Yvan", type: "office", collaboratorId: "collab2" },
  { id: "siham", name: "Bureau Siham", type: "office", collaboratorId: "collab3" },
  { id: "kim", name: "Bureau Kim", type: "office", collaboratorId: "collab4" },
  { id: "valerie", name: "Bureau Valérie", type: "office", collaboratorId: "collab5" },
  { id: "samira", name: "Bureau Samira", type: "office", collaboratorId: "collab6" },
  { id: "laure", name: "Bureau Laure", type: "office", collaboratorId: "collab7" },
]

export const useBookingStore = create<BookingStore>()(
  persist(
    (set, get) => ({
      bookings: [],
      selectedRoom: "salle1",
      selectedRooms: [],
      customTrainingTypes: DEFAULT_TRAINING_TYPES,
      rooms: DEFAULT_ROOMS,
      leaves: [],
      collaborators: DEFAULT_COLLABORATORS,

      addBooking: (booking) => {
        set((state) => {
          // Handle recurring bookings
          if (booking.isRecurring && booking.recurrenceEndDate) {
            const newBookings = [...state.bookings]
            const startDate = new Date(booking.date)
            const endDate = new Date(booking.recurrenceEndDate)

            // Create recurring instances
            const currentDate = new Date(startDate)
            while (currentDate <= endDate) {
              const bookingDate = currentDate.toISOString().split("T")[0]

              // Vérifier s'il n'y a pas déjà une réservation pour cette date et cette salle
              const hasConflict = state.bookings.some(
                (existingBooking) =>
                  existingBooking.roomId === booking.roomId &&
                  existingBooking.date === bookingDate &&
                  ((existingBooking.startTime <= booking.startTime && existingBooking.endTime > booking.startTime) ||
                    (existingBooking.startTime < booking.endTime && existingBooking.endTime >= booking.endTime) ||
                    (existingBooking.startTime >= booking.startTime && existingBooking.endTime <= booking.endTime)),
              )

              // Vérifier si le référent est en congé (pour les bureaux)
              const room = state.rooms.find((r) => r.id === booking.roomId)
              let isOnLeave = false

              if (room?.type === "office") {
                isOnLeave = state.leaves.some(
                  (leave) =>
                    leave.referentId === booking.roomId &&
                    new Date(leave.startDate) <= currentDate &&
                    new Date(leave.endDate) >= currentDate,
                )
              }

              // Ajouter la réservation seulement s'il n'y a pas de conflit et pas de congé
              if (!hasConflict && !isOnLeave) {
                newBookings.push({
                  ...booking,
                  id: `${booking.id}-${bookingDate}`,
                  date: bookingDate,
                })
              }

              // Increment date based on recurrence pattern
              if (booking.recurrencePattern === "daily") {
                currentDate.setDate(currentDate.getDate() + 1)
              } else if (booking.recurrencePattern === "weekly") {
                currentDate.setDate(currentDate.getDate() + 7)
              } else if (booking.recurrencePattern === "monthly") {
                currentDate.setMonth(currentDate.getMonth() + 1)
              } else if (booking.recurrencePattern === "yearly") {
                currentDate.setFullYear(currentDate.getFullYear() + 1)
              }
            }

            return { bookings: newBookings }
          }

          // Handle single booking
          return { bookings: [...state.bookings, booking] }
        })
      },

      removeBooking: (id) =>
        set((state) => ({
          bookings: state.bookings.filter((booking) => booking.id !== id && !booking.id.startsWith(`${id}-`)),
        })),

      setSelectedRoom: (roomId) => set({ selectedRoom: roomId }),

      setSelectedRooms: (roomIds) => set({ selectedRooms: roomIds }),

      toggleSelectedRoom: (roomId) =>
        set((state) => {
          if (state.selectedRooms.includes(roomId)) {
            return {
              selectedRooms: state.selectedRooms.filter((id) => id !== roomId),
            }
          } else {
            return {
              selectedRooms: [...state.selectedRooms, roomId],
            }
          }
        }),

      addTrainingType: (type) =>
        set((state) => ({
          customTrainingTypes: [...state.customTrainingTypes, type],
        })),

      removeTrainingType: (id) =>
        set((state) => ({
          customTrainingTypes: state.customTrainingTypes.filter((type) => type.id !== id),
        })),

      addRoom: (room) =>
        set((state) => ({
          rooms: [...state.rooms, room],
        })),

      updateRoom: (id, updates) =>
        set((state) => ({
          rooms: state.rooms.map((room) => (room.id === id ? { ...room, ...updates } : room)),
        })),

      removeRoom: (id) =>
        set((state) => ({
          rooms: state.rooms.filter((room) => room.id !== id),
          // If the deleted room was selected, select another room
          selectedRoom:
            state.selectedRoom === id ? state.rooms.find((r) => r.id !== id)?.id || "salle1" : state.selectedRoom,
          selectedRooms: state.selectedRooms.filter((roomId) => roomId !== id),
          // Supprimer également les réservations associées à cette salle
          bookings: state.bookings.filter((booking) => booking.roomId !== id),
          // Supprimer les congés associés si c'est un bureau
          leaves: state.leaves.filter((leave) => leave.referentId !== id),
        })),

      addLeave: (leave) =>
        set((state) => ({
          leaves: [...state.leaves, leave],
        })),

      updateLeave: (id, updates) =>
        set((state) => ({
          leaves: state.leaves.map((leave) => (leave.id === id ? { ...leave, ...updates } : leave)),
        })),

      removeLeave: (id) =>
        set((state) => ({
          leaves: state.leaves.filter((leave) => leave.id !== id),
        })),

      addCollaborator: (collaborator) =>
        set((state) => ({
          collaborators: [...state.collaborators, collaborator],
        })),

      updateCollaborator: (id, updates) =>
        set((state) => ({
          collaborators: state.collaborators.map((collab) => (collab.id === id ? { ...collab, ...updates } : collab)),
        })),

      removeCollaborator: (id) =>
        set((state) => {
          // Vérifier si le collaborateur est associé à un bureau
          const associatedRooms = state.rooms.filter((room) => room.collaboratorId === id)

          // Si oui, mettre à jour les bureaux pour supprimer l'association
          const updatedRooms = state.rooms.map((room) =>
            room.collaboratorId === id ? { ...room, collaboratorId: undefined } : room,
          )

          return {
            collaborators: state.collaborators.filter((collab) => collab.id !== id),
            rooms: updatedRooms,
          }
        }),

      isRoomAvailable: (roomId, date, startTime, endTime, excludeBookingId) => {
        const state = get()

        // Vérifier s'il y a des réservations existantes qui se chevauchent
        const hasConflict = state.bookings.some((booking) => {
          // Ignorer la réservation en cours de modification
          if (excludeBookingId && (booking.id === excludeBookingId || booking.id.startsWith(`${excludeBookingId}-`))) {
            return false
          }

          return (
            booking.roomId === roomId &&
            booking.date === date &&
            ((booking.startTime <= startTime && booking.endTime > startTime) ||
              (booking.startTime < endTime && booking.endTime >= endTime) ||
              (booking.startTime >= startTime && booking.endTime <= endTime))
          )
        })

        if (hasConflict) {
          return false
        }

        // Vérifier si c'est un bureau et si le référent est en congé
        const room = state.rooms.find((r) => r.id === roomId)
        if (room?.type === "office") {
          const bookingDate = new Date(date)

          const referentOnLeave = state.leaves.some((leave) => {
            if (leave.referentId === roomId) {
              const leaveStartDate = new Date(leave.startDate)
              const leaveEndDate = new Date(leave.endDate)
              return bookingDate >= leaveStartDate && bookingDate <= leaveEndDate
            }
            return false
          })

          if (referentOnLeave) {
            return false
          }
        }

        return true
      },
    }),
    {
      name: "booking-storage",
    },
  ),
)

