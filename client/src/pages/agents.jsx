import { useState, useEffect } from "react"
import api from "@/lib/api"
import { IconLoader2, IconUsers, IconPlus } from "@tabler/icons-react"
import { toast } from "sonner"
import { Empty, EmptyContent, EmptyDescription, EmptyHeader, EmptyMedia, EmptyTitle } from "@/components/ui/empty"
import { Button } from "@/components/ui/button"
import { AddAgentModal } from "@/components/Agents/add-agent-modal"
import { AgentTable } from "@/components/Agents/agent-table"
import {
  Card,
  CardAction,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { TrendingBadge } from "@/components/ui/trending-badge"

export default function AgentsPage() {
  const [agents, setAgents] = useState([])
  const [loading, setLoading] = useState(true)
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [selectedAgent, setSelectedAgent] = useState(null)

  useEffect(() => {
    fetchAgents()
  }, [])

  const fetchAgents = async () => {
    try {
      setLoading(true)
      const response = await api.get('/agents')
      setAgents(response.data)
    } catch (error) {
      toast.error(error.response?.data?.message || error.message)
    } finally {
      setLoading(false)
    }
  }

  const handleAdd = () => {
    setSelectedAgent(null)
    setIsModalOpen(true)
  }

  const handleEdit = (agent) => {
    setSelectedAgent(agent)
    setIsModalOpen(true)
  }

  return (
    <div className="flex flex-col gap-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold tracking-tight">Agents Management</h2>
          <p className="text-muted-foreground">Manage your property agents and their system access.</p>
        </div>
        <Button onClick={handleAdd} className="gap-2 rounded-full shadow-lg">
          <IconPlus className="size-4" />
          Add New Agent
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 @xl/main:grid-cols-2 @5xl/main:grid-cols-4 *:data-[slot=card]:bg-gradient-to-t *:data-[slot=card]:from-primary/5 *:data-[slot=card]:to-card *:data-[slot=card]:shadow-xs">
        <Card className="@container/card">
          <CardHeader>
            <CardDescription>Total Agents</CardDescription>
            <CardTitle className="text-2xl font-semibold tabular-nums @[250px]/card:text-3xl">
              {agents.length}
            </CardTitle>
            <CardAction>
              <IconUsers className="size-5 text-primary" />
            </CardAction>
          </CardHeader>
          <CardFooter className="flex-col items-start gap-1.5 text-sm">
            <div className="text-muted-foreground">Registered property agents</div>
          </CardFooter>
        </Card>

        <Card className="@container/card">
          <CardHeader>
            <CardDescription>Active Status</CardDescription>
            <CardTitle className="text-2xl font-semibold tabular-nums @[250px]/card:text-3xl">
              {agents.filter(a => a.status === 'Active').length}
            </CardTitle>
            <CardAction>
              <TrendingBadge label="Active" trend="up" />
            </CardAction>
          </CardHeader>
          <CardFooter className="flex-col items-start gap-1.5 text-sm">
            <div className="text-muted-foreground">Agents with active system access</div>
          </CardFooter>
        </Card>
      </div>

      {loading ? (
        <div className="flex h-64 items-center justify-center">
          <IconLoader2 className="size-8 animate-spin text-primary" />
        </div>
      ) : agents.length === 0 ? (
        <Empty className="rounded-2xl border-2 border-dashed bg-muted/50">
          <EmptyHeader>
            <EmptyMedia variant="icon">
              <IconUsers className="size-6" />
            </EmptyMedia>
            <EmptyTitle>No agents yet.</EmptyTitle>
            <EmptyDescription>
              Start by adding your first agent to the system.
            </EmptyDescription>
          </EmptyHeader>
          <EmptyContent>
            <Button variant="outline" className="rounded-full" onClick={handleAdd}>
              Add Your First Agent
            </Button>
          </EmptyContent>
        </Empty>
      ) : (
        <AgentTable 
          agents={agents} 
          onUpdate={fetchAgents}
          onEdit={handleEdit}
        />
      )}

      <AddAgentModal 
        open={isModalOpen} 
        onOpenChange={setIsModalOpen} 
        onSuccess={fetchAgents} 
        initialData={selectedAgent}
      />
    </div>
  )
}
