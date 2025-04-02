import { GlobalCalendar } from "@/components/global-calendar"

export default function GlobalPage() {
  return (
    <main className="container mx-auto py-8 px-4">
      <h1 className="text-3xl font-bold mb-8 text-center">Planning Global</h1>
      <GlobalCalendar />
    </main>
  )
}

