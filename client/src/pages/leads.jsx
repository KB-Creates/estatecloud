import { useState, useEffect } from "react"
import api from "@/lib/api"
import { IconLoader2, IconInbox } from "@tabler/icons-react"
import { toast } from "sonner"
import { Empty, EmptyContent, EmptyDescription, EmptyHeader, EmptyMedia, EmptyTitle } from "@/components/ui/empty"
import { Button } from "@/components/ui/button"
import { AddLeadModal } from "@/components/Leads/add-lead-modal"
import { ImportLeadsModal } from "@/components/Leads/import-leads-modal"
import { LeadStats } from "@/components/Leads/lead-stats"
import { LeadTable } from "@/components/Leads/lead-table"
import { useAuth } from "@/context/AuthContext"
import { socket } from "@/lib/socket"

import { DeleteConfirm } from "@/components/delete-confirm"

export default function LeadsPage() {
  const { hasPermission } = useAuth()
  const [leads, setLeads] = useState([])
  const [staff, setStaff] = useState([])
  const [loading, setLoading] = useState(true)
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [selectedLead, setSelectedLead] = useState(null)

  useEffect(() => {
    fetchLeads()
    fetchStaff()
  }, [])

  useEffect(() => {
    socket.on("inquiries_updated", () => {
      fetchLeads()
    })
    return () => {
      socket.off("inquiries_updated")
    }
  }, [])

  const fetchStaff = async () => {
    try {
      const response = await api.get('/agents')
      setStaff(response.data)
    } catch (error) {
      console.error("Failed to fetch agents", error)
    }
  }

  const fetchLeads = async () => {
    try {
      setLoading(true)
      const response = await api.get('/inquiries')
      setLeads(response.data)
    } catch (error) {
      toast.error(error.response?.data?.message || error.message)
    } finally {
      setLoading(false)
    }
  }

  const handleStatusUpdate = async (id, newStatus, extraData = {}) => {
    try {
      await api.patch(`/inquiries/${id}`, { 
        status: newStatus,
        remarks: extraData.remarks,
        nextFollowUp: extraData.nextFollowUp || undefined
      })
      toast.success(`Lead marked as ${newStatus}`)
      fetchLeads()
    } catch (error) {
      toast.error(error.response?.data?.message || error.message)
    }
  }

  const handleDelete = async (id) => {
    try {
      await api.delete(`/inquiries/${id}`)
      toast.success("Lead deleted")
      fetchLeads()
    } catch (error) {
      toast.error("Delete failed")
    }
  }

  const handleBulkStatusUpdate = async (ids, newStatus) => {
    try {
      const toastId = toast.loading(`Marking leads as ${newStatus}...`)
      await Promise.all(ids.map(id => api.patch(`/inquiries/${id}`, { status: newStatus })))
      toast.dismiss(toastId)
      toast.success(`Selected leads marked as ${newStatus}`)
      fetchLeads()
    } catch (error) {
      toast.error("Failed to update selected leads")
    }
  }

  const handleBulkAssign = async (ids, assignedTo) => {
    try {
      const toastId = toast.loading(`Assigning leads to agent...`)
      await Promise.all(ids.map(id => api.patch(`/inquiries/${id}`, { assignedTo })))
      toast.dismiss(toastId)
      toast.success(`Leads assigned successfully`)
      fetchLeads()
    } catch (error) {
      toast.error("Failed to assign leads")
    }
  }

  const handleBulkDelete = async (ids) => {
    try {
      const toastId = toast.loading("Deleting selected leads...")
      await Promise.all(ids.map(id => api.delete(`/inquiries/${id}`)))
      toast.dismiss(toastId)
      toast.success("Selected leads deleted successfully")
      fetchLeads()
    } catch (error) {
      toast.error("Failed to delete selected leads")
    }
  }

  const handleEdit = (lead) => {
    setSelectedLead(lead)
    setIsModalOpen(true)
  }

  const handleAdd = () => {
    setSelectedLead(null)
    setIsModalOpen(true)
  }

  return (
    <div className="flex flex-col gap-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold tracking-tight">Property Leads</h2>
          <p className="text-muted-foreground">Track and manage potential customer leads.</p>
        </div>
      </div>

      <LeadStats leads={leads} />

      {loading ? (
        <div className="flex h-64 items-center justify-center">
          <IconLoader2 className="size-8 animate-spin text-primary" />
        </div>
      ) : leads.length === 0 ? (
        <Empty className="rounded-2xl border-2 border-dashed bg-muted/50">
          <EmptyHeader>
            <EmptyMedia variant="icon">
              <IconInbox className="size-6 text-primary" />
            </EmptyMedia>
            <EmptyTitle>No leads yet.</EmptyTitle>
            <EmptyDescription>
              Start tracking potential customers by manually adding your first lead.
            </EmptyDescription>
          </EmptyHeader>
          <EmptyContent className="flex items-center gap-3">
            {hasPermission('inquiries', 'create') && (
              <Button variant="outline" className="rounded-full" onClick={handleAdd}>
                Manually Add Lead
              </Button>
            )}
            {hasPermission('inquiries', 'create') && <ImportLeadsModal onSuccess={fetchLeads} />}
          </EmptyContent>
        </Empty>
      ) : (
        <LeadTable
          leads={leads}
          onStatusUpdate={hasPermission('inquiries', 'edit') ? handleStatusUpdate : undefined}
          onAddClick={hasPermission('inquiries', 'create') ? handleAdd : undefined}
          onEdit={hasPermission('inquiries', 'edit') ? handleEdit : undefined}
          onDelete={hasPermission('inquiries', 'delete') ? handleDelete : undefined}
          onUpdate={fetchLeads}
          onBulkDelete={hasPermission('inquiries', 'delete') ? handleBulkDelete : undefined}
          onBulkStatusUpdate={hasPermission('inquiries', 'edit') ? handleBulkStatusUpdate : undefined}
          onBulkAssign={hasPermission('inquiries', 'edit') ? handleBulkAssign : undefined}
          staff={staff}
          actions={hasPermission('inquiries', 'create') ? <ImportLeadsModal onSuccess={fetchLeads} /> : undefined}
        />
      )}

      <AddLeadModal
        open={isModalOpen}
        onOpenChange={setIsModalOpen}
        initialData={selectedLead}
        onSuccess={fetchLeads}
      />
    </div>
  )
}

