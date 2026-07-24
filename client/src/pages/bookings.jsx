import { useState, useEffect } from "react"
import { useNavigate } from "react-router-dom"
import api from "@/lib/api"
import { IconLoader2, IconCalendarCheck } from "@tabler/icons-react"
import { toast } from "sonner"
import { Empty, EmptyContent, EmptyDescription, EmptyHeader, EmptyMedia, EmptyTitle } from "@/components/ui/empty"
import { Button } from "@/components/ui/button"
import { BookingStats } from "@/components/Bookings/booking-stats"
import { BookingTable } from "@/components/Bookings/booking-table"

export default function BookingsPage() {
  const navigate = useNavigate()
  const [bookings, setBookings] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchBookings()
  }, [])

  const fetchBookings = async () => {
    try {
      setLoading(true)
      const response = await api.get('/bookings')
      setBookings(response.data)
    } catch (error) {
      toast.error(error.response?.data?.message || error.message)
    } finally {
      setLoading(false)
    }
  }

  const handleDelete = async (id) => {
    try {
      await api.delete(`/bookings/${id}`)
      toast.success("Booking cancelled and deleted")
      fetchBookings()
    } catch (error) {
      toast.error("Delete failed")
    }
  }

  const handleStatusUpdate = async (id, newStatus) => {
    try {
      await api.patch(`/bookings/${id}`, { status: newStatus })
      toast.success(`Booking status updated to ${newStatus}`)
      fetchBookings()
    } catch (error) {
      toast.error(error.response?.data?.message || error.message)
    }
  }

  return (
    <div className="flex flex-col gap-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold tracking-tight">Guest Bookings</h2>
          <p className="text-muted-foreground">Manage property reservations, check-ins and payments.</p>
        </div>
      </div>

      <BookingStats bookings={bookings} />

      {loading ? (
        <div className="flex h-64 items-center justify-center">
          <IconLoader2 className="size-8 animate-spin text-primary" />
        </div>
      ) : bookings.length === 0 ? (
        <Empty className="rounded-2xl border-2 border-dashed bg-muted/50">
          <EmptyHeader>
            <EmptyMedia variant="icon">
              <IconCalendarCheck className="size-6 text-primary" />
            </EmptyMedia>
            <EmptyTitle>No bookings yet.</EmptyTitle>
            <EmptyDescription>
              Guest reservations will appear here once you add them or they book a unit.
            </EmptyDescription>
          </EmptyHeader>
          <EmptyContent>
            <Button variant="outline" className="rounded-full" onClick={() => navigate('/bookings/new')}>
              Add Booking
            </Button>
          </EmptyContent>
        </Empty>
      ) : (
        <BookingTable 
          bookings={bookings} 
          onStatusUpdate={handleStatusUpdate} 
          onAddClick={() => navigate('/bookings/new')} 
          onEdit={(id) => navigate(`/bookings/edit/${id}`)}
          onDelete={handleDelete}
          onUpdate={fetchBookings}
        />
      )}
    </div>
  )
}
