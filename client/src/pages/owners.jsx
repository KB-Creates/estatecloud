import { useState, useEffect } from "react"
import api from "@/lib/api"
import { IconLoader2, IconUserCode, IconPlus, IconBuildings } from "@tabler/icons-react"
import { toast } from "sonner"
import { Empty, EmptyContent, EmptyDescription, EmptyHeader, EmptyMedia, EmptyTitle } from "@/components/ui/empty"
import { Button } from "@/components/ui/button"
import { AddOwnerModal } from "@/components/Owners/add-owner-modal"
import { OwnerTable } from "@/components/Owners/owner-table"
import {
  Card,
  CardAction,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { TrendingBadge } from "@/components/ui/trending-badge"

export default function OwnersPage() {
  const [owners, setOwners] = useState([])
  const [loading, setLoading] = useState(true)
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [selectedOwner, setSelectedOwner] = useState(null)

  useEffect(() => {
    fetchOwners()
  }, [])

  const fetchOwners = async () => {
    try {
      setLoading(true)
      const response = await api.get('/owners')
      setOwners(response.data)
    } catch (error) {
      toast.error(error.response?.data?.message || error.message)
    } finally {
      setLoading(false)
    }
  }

  const handleAdd = () => {
    setSelectedOwner(null)
    setIsModalOpen(true)
  }

  const handleEdit = (item) => {
    setSelectedOwner(item)
    setIsModalOpen(true)
  }

  return (
    <div className="flex flex-col gap-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold tracking-tight">Property Owners</h2>
          <p className="text-muted-foreground">Manage property owners and their business information.</p>
        </div>
        <Button onClick={handleAdd} className="gap-2 rounded-full shadow-lg">
          <IconPlus className="size-4" />
          Add New Owner
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 @xl/main:grid-cols-2 @5xl/main:grid-cols-4 *:data-[slot=card]:bg-gradient-to-t *:data-[slot=card]:from-primary/5 *:data-[slot=card]:to-card *:data-[slot=card]:shadow-xs">
        <Card className="@container/card">
          <CardHeader>
            <CardDescription>Total Owners</CardDescription>
            <CardTitle className="text-2xl font-semibold tabular-nums @[250px]/card:text-3xl">
              {owners.length}
            </CardTitle>
            <CardAction>
              <IconUserCode className="size-5 text-primary" />
            </CardAction>
          </CardHeader>
          <CardFooter className="flex-col items-start gap-1.5 text-sm">
            <div className="text-muted-foreground">Registered property owners</div>
          </CardFooter>
        </Card>

        <Card className="@container/card">
          <CardHeader>
            <CardDescription>Active Entities</CardDescription>
            <CardTitle className="text-2xl font-semibold tabular-nums @[250px]/card:text-3xl">
              {owners.filter(o => o.status === 'Active').length}
            </CardTitle>
            <CardAction>
              <IconBuildings className="size-5 text-emerald-500" />
            </CardAction>
          </CardHeader>
          <CardFooter className="flex-col items-start gap-1.5 text-sm">
            <div className="text-muted-foreground flex items-center gap-1">
                <TrendingBadge trend="up" label="Active" />
                <span>status owners</span>
            </div>
          </CardFooter>
        </Card>
      </div>

      {loading ? (
        <div className="flex h-64 items-center justify-center">
          <IconLoader2 className="size-8 animate-spin text-primary" />
        </div>
      ) : owners.length === 0 ? (
        <Empty className="rounded-2xl border-2 border-dashed bg-muted/50">
          <EmptyHeader>
            <EmptyMedia variant="icon">
              <IconUserCode className="size-6" />
            </EmptyMedia>
            <EmptyTitle>No owners yet.</EmptyTitle>
            <EmptyDescription>
              Start by adding your first property owner to the system.
            </EmptyDescription>
          </EmptyHeader>
          <EmptyContent>
            <Button variant="outline" className="rounded-full" onClick={handleAdd}>
              Add Your First Owner
            </Button>
          </EmptyContent>
        </Empty>
      ) : (
        <OwnerTable 
          owners={owners} 
          onUpdate={fetchOwners}
          onEdit={handleEdit}
        />
      )}

      <AddOwnerModal 
        open={isModalOpen} 
        onOpenChange={setIsModalOpen} 
        onSuccess={fetchOwners} 
        initialData={selectedOwner}
      />
    </div>
  )
}
