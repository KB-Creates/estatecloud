import * as React from "react"
import { cn } from "@/lib/utils"
import { useIsMobile } from "@/hooks/use-mobile"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerDescription,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from "@/components/ui/drawer"
import { IconUser, IconCalendar, IconMessageDots, IconPhone, IconMapPin, IconCoin, IconCategory, IconTarget, IconClock } from "@tabler/icons-react"
import { format } from "date-fns"

const statusColors = {
  New: "bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400",
  Contacted: "bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400",
  Qualified: "bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-400",
  Lost: "bg-rose-100 text-rose-700 dark:bg-rose-900/30 dark:text-rose-400",
  Converted: "bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400",
}

export function LeadCellViewer({ lead }) {
  const isMobile = useIsMobile()
  const [isOpen, setIsOpen] = React.useState(false)

  return (
    <Drawer direction={isMobile ? "bottom" : "right"} open={isOpen} onOpenChange={setIsOpen}>
      <DrawerTrigger asChild>
        <Button variant="link" className="h-fit py-0.5 w-fit px-0 text-left text-foreground text-sm font-medium">
          {lead.name}
        </Button>
      </DrawerTrigger>
      <DrawerContent className="h-full max-h-[100dvh]">
        <DrawerHeader className="gap-1 border-b pb-4">
          <DrawerTitle className="flex items-center gap-2 text-xl font-bold">
            <IconUser className="size-5 text-primary" />
            {lead.name}
          </DrawerTitle>
          <DrawerDescription className="text-sm">
            Requirement: {lead.propertyType || "Any Property"} for {lead.purpose || "Investment"} in {lead.city || "Any City"}
          </DrawerDescription>
        </DrawerHeader>

        <ScrollArea className="flex-1 px-4">
          <div className="flex flex-col gap-6 py-6">
            
            {/* Lead Information Card */}
            <div className="grid gap-2.5">
              <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-muted-foreground">
                <IconUser className="size-3.5" />
                <span>Lead Information</span>
              </div>
              <div className="grid grid-cols-2 gap-x-4 gap-y-4 text-sm bg-muted/20 p-4 rounded-xl border">
                <div className="flex flex-col gap-0.5">
                  <span className="text-[10px] uppercase text-muted-foreground font-bold flex items-center gap-1">
                    <IconPhone className="size-3" /> Phone
                  </span>
                  <span className="font-semibold">{lead.phone || "N/A"}</span>
                </div>
                <div className="flex flex-col gap-0.5">
                  <span className="text-[10px] uppercase text-muted-foreground font-bold flex items-center gap-1">
                    <IconMapPin className="size-3" /> City / Location
                  </span>
                  <span className="font-semibold">{lead.city || "N/A"}</span>
                </div>
                <div className="flex flex-col gap-0.5">
                  <span className="text-[10px] uppercase text-muted-foreground font-bold flex items-center gap-1">
                    <IconCoin className="size-3" /> Budget
                  </span>
                  <span className="font-semibold text-primary">{lead.budget || "N/A"}</span>
                </div>
                <div className="flex flex-col gap-0.5">
                  <span className="text-[10px] uppercase text-muted-foreground font-bold flex items-center gap-1">
                    <IconCategory className="size-3" /> Property Type
                  </span>
                  <span className="font-semibold">{lead.propertyType || "N/A"}</span>
                </div>
                <div className="flex flex-col gap-0.5">
                  <span className="text-[10px] uppercase text-muted-foreground font-bold flex items-center gap-1">
                    <IconTarget className="size-3" /> Purpose
                  </span>
                  <span className="font-semibold">{lead.purpose || "N/A"}</span>
                </div>
                <div className="flex flex-col gap-0.5">
                  <span className="text-[10px] uppercase text-muted-foreground font-bold flex items-center gap-1">
                    <IconClock className="size-3" /> Priority
                  </span>
                  <Badge variant={lead.priority === 'High' ? 'destructive' : 'secondary'} className="w-fit h-4.5 px-1.5 text-[9px] font-bold">
                    {lead.priority}
                  </Badge>
                </div>
                <div className="flex flex-col gap-0.5">
                  <span className="text-[10px] uppercase text-muted-foreground font-bold flex items-center gap-1">
                    <IconClock className="size-3" /> Current Status
                  </span>
                  <Badge className={cn("w-fit h-4.5 px-1.5 text-[9px] font-bold border-none", statusColors[lead.status || "New"])} variant="outline">
                    {lead.status || "New"}
                  </Badge>
                </div>
                <div className="flex flex-col gap-0.5">
                  <span className="text-[10px] uppercase text-muted-foreground font-bold flex items-center gap-1">
                    <IconCalendar className="size-3" /> Created Date
                  </span>
                  <span className="text-muted-foreground text-xs font-semibold">{lead.createdAt ? format(new Date(lead.createdAt), "PPP") : "N/A"}</span>
                </div>
              </div>
            </div>

            {/* Remarks & Status History */}
            <div className="flex-1 flex flex-col gap-3 min-h-[350px]">
              <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-muted-foreground">
                <IconMessageDots className="size-3.5" />
                <span>Remarks & Status History Log</span>
              </div>
              
              <div className="flex-1 flex flex-col gap-3 overflow-y-auto bg-muted/20 p-4 rounded-xl border text-sm max-h-[50vh]">
                {(() => {
                  let history = lead.statusHistory;
                  if (typeof history === 'string') {
                    try {
                      history = JSON.parse(history);
                    } catch (e) {
                      history = [];
                    }
                  }
                  
                  if (!Array.isArray(history) || history.length === 0) {
                    return (
                      <div className="text-xs text-muted-foreground italic text-center py-8">
                        No history logs recorded yet.
                      </div>
                    );
                  }

                  return history.slice().reverse().map((entry, index) => (
                    <div key={index} className="flex flex-col gap-1.5 pb-4 border-b last:border-0 last:pb-0">
                      <div className="flex items-center justify-between gap-2">
                        <Badge className={cn("text-[9px] px-1.5 h-4.5 font-bold border-none rounded-full", statusColors[entry.status || "New"])} variant="outline">
                          {entry.status}
                        </Badge>
                        <span className="text-[10px] text-muted-foreground">
                          {entry.updatedAt ? format(new Date(entry.updatedAt), "PPp") : "N/A"}
                        </span>
                      </div>
                      
                      {entry.remarks && (
                        <p className="text-xs text-foreground bg-background/60 p-2.5 rounded-lg border mt-0.5 whitespace-pre-wrap leading-relaxed">
                          {entry.remarks}
                        </p>
                      )}
                      
                      {entry.nextFollowUp && (
                        <div className="flex items-center gap-1.5 text-[10px] text-amber-600 dark:text-amber-400 font-semibold mt-0.5">
                          <span>Next Follow-up:</span>
                          <span>{format(new Date(entry.nextFollowUp), "PPp")}</span>
                        </div>
                      )}
                      
                      <span className="text-[9px] text-muted-foreground/80 self-end mt-1">
                        By: {entry.updatedBy || "System"}
                      </span>
                    </div>
                  ));
                })()}
              </div>
            </div>

          </div>
        </ScrollArea>

        <DrawerFooter className="border-t pt-4">
          <DrawerClose asChild>
            <Button variant="outline" className="w-full rounded-full">Close Viewer</Button>
          </DrawerClose>
        </DrawerFooter>
      </DrawerContent>
    </Drawer>
  )
}
