import * as React from "react"
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { IconLoader2 } from "@tabler/icons-react"

export function UpdateStatusModal({ open, onOpenChange, leadName, newStatus, onSave }) {
  const [remarks, setRemarks] = React.useState("")
  const [nextFollowUp, setNextFollowUp] = React.useState("")
  const [loading, setLoading] = React.useState(false)

  React.useEffect(() => {
    if (open) {
      setRemarks("")
      setNextFollowUp("")
    }
  }, [open])

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
    try {
      await onSave({ remarks, nextFollowUp })
      onOpenChange(false)
    } catch (error) {
      console.error(error)
    } finally {
      setLoading(false)
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md">
        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <DialogHeader>
            <DialogTitle>Update Lead Status</DialogTitle>
            <DialogDescription>
              Updating status of <strong>{leadName}</strong> to <strong className="text-primary">{newStatus}</strong>.
            </DialogDescription>
          </DialogHeader>

          <div className="grid gap-4 py-2">
            <div className="grid gap-2">
              <Label htmlFor="remarks">Follow-up Remarks <span className="text-destructive">*</span></Label>
              <Textarea
                id="remarks"
                placeholder="What was discussed? Enter remarks/notes..."
                value={remarks}
                onChange={(e) => setRemarks(e.target.value)}
                required
                className="min-h-[100px]"
              />
            </div>

            <div className="grid gap-2">
              <Label htmlFor="nextFollowUp">Next Follow-up Date & Time</Label>
              <Input
                id="nextFollowUp"
                type="datetime-local"
                value={nextFollowUp}
                onChange={(e) => setNextFollowUp(e.target.value)}
              />
            </div>
          </div>

          <DialogFooter className="gap-2 sm:gap-0">
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
              disabled={loading}
              className="w-full sm:w-auto"
            >
              Cancel
            </Button>
            <Button type="submit" disabled={loading} className="w-full sm:w-auto">
              {loading && <IconLoader2 className="mr-2 size-4 animate-spin" />}
              Save & Update Status
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
