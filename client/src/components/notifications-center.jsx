"use client";

import * as React from "react"
import { 
  Bell, 
  Trash2, 
  Archive, 
  ChevronRight, 
  Loader2,
  BellOff,
} from "lucide-react"
import {
  IconReceipt2,
  IconTool,
  IconFileCertificate,
  IconBuildingSkyscraper,
  IconUser,
  IconFileText,
  IconInfoCircle,
  IconGripVertical
} from "@tabler/icons-react"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"
import { Card } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Separator } from "@/components/ui/separator"
import { ScrollArea } from "@/components/ui/scroll-area"
import { motion } from "framer-motion"
import api from "@/lib/api"
import { formatDistanceToNow } from "date-fns"
import { socket } from "@/lib/socket"

const getNotificationIcon = (type, title) => {
  const checkTitle = (t) => title?.toLowerCase().includes(t.toLowerCase());
  
  // Custom checks based on title or type keywords
  if (checkTitle('financial') || checkTitle('expense') || checkTitle('commission')) {
    return { icon: <IconReceipt2 className="size-4" />, color: 'bg-amber-500/10 text-amber-600 border-amber-500/20' };
  }
  if (checkTitle('security') || checkTitle('password') || checkTitle('lock') || checkTitle('login')) {
    return { icon: <IconInfoCircle className="size-4" />, color: 'bg-rose-500/10 text-rose-600 border-rose-500/20' };
  }
  if (checkTitle('agent') || checkTitle('reply') || checkTitle('reminder')) {
    return { icon: <IconUser className="size-4" />, color: 'bg-sky-500/10 text-sky-600 border-sky-500/20' };
  }
  if (checkTitle('user') || checkTitle('role')) {
    return { icon: <IconUser className="size-4" />, color: 'bg-indigo-500/10 text-indigo-600 border-indigo-500/20' };
  }
  if (checkTitle('due') || checkTitle('installment') || checkTitle('collection')) {
    return { icon: <IconReceipt2 className="size-4" />, color: 'bg-red-500/10 text-red-600 border-red-500/20' };
  }
  if (checkTitle('lead') || checkTitle('inquiry') || checkTitle('follow-up')) {
    return { icon: <IconUser className="size-4" />, color: 'bg-teal-500/10 text-teal-600 border-teal-500/20' };
  }
  
  switch (type) {
    case 'payment':
      return { icon: <IconReceipt2 className="size-4" />, color: 'bg-emerald-500/10 text-emerald-600 border-emerald-500/20' };
    case 'maintenance':
      return { icon: <IconTool className="size-4" />, color: 'bg-orange-500/10 text-orange-600 border-orange-500/20' };
    case 'lease':
      return { icon: <IconFileCertificate className="size-4" />, color: 'bg-blue-500/10 text-blue-600 border-blue-500/20' };
    case 'property':
      return { icon: <IconBuildingSkyscraper className="size-4" />, color: 'bg-purple-500/10 text-purple-600 border-purple-500/20' };
    case 'user':
      return { icon: <IconUser className="size-4" />, color: 'bg-indigo-500/10 text-indigo-600 border-indigo-500/20' };
    case 'document':
      return { icon: <IconFileText className="size-4" />, color: 'bg-amber-500/10 text-amber-600 border-amber-500/20' };
    default:
      return { icon: <IconInfoCircle className="size-4" />, color: 'bg-slate-500/10 text-slate-600 border-slate-500/20' };
  }
}

export default function NotificationsWithActions({
  placement = "bottom",
}) {
  const [notifications, setNotifications] = React.useState([])
  const [loading, setLoading] = React.useState(true)
  const [activeId, setActiveId] = React.useState(null)

  const fetchNotifications = React.useCallback(async () => {
    try {
      setLoading(true)
      const response = await api.get('/notifications')
      setNotifications(response.data || [])
    } catch (error) {
      console.error("Failed to fetch notifications:", error)
    } finally {
      setLoading(false)
    }
  }, [])

  React.useEffect(() => {
    fetchNotifications()

    // Request HTML5 native browser desktop notification permission on mount
    if (typeof window !== 'undefined' && 'Notification' in window) {
      if (Notification.permission === 'default') {
        Notification.requestPermission();
      }
    }
  }, [fetchNotifications])

  React.useEffect(() => {
    const handleNewNotification = (notification) => {
      // Add only if notification belongs to this user
      setNotifications(prev => {
        if (prev.some(n => n._id === notification._id)) return prev;
        return [notification, ...prev];
      });

      // Trigger HTML5 native browser desktop notification if permission is granted
      if (typeof window !== 'undefined' && 'Notification' in window && Notification.permission === 'granted') {
        try {
          new Notification(notification.title, {
            body: notification.description,
            icon: '/favicon.ico'
          });
        } catch (err) {
          console.warn('Failed to trigger native desktop notification:', err);
        }
      }

      // Premium audio feedback sound!
      try {
        const audio = new Audio("https://assets.mixkit.co/active_storage/sfx/2869/2869-600.wav");
        audio.volume = 0.15;
        audio.play().catch(e => console.log('Audio autoplay blocked'));
      } catch (e) {
        // Safe fallback
      }
    };

    socket.on("notification_received", handleNewNotification);
    return () => {
      socket.off("notification_received", handleNewNotification);
    };
  }, []);

  const handleArchive = async (id) => {
    try {
      await api.patch(`/notifications/${id}/read`)
      setNotifications(prev => prev.map(n => n._id === id ? { ...n, status: 'read' } : n))
      setActiveId(null)
    } catch (error) {
      console.error("Failed to mark notification as read:", error)
    }
  }

  const handleClearAll = async () => {
    try {
      await api.delete('/notifications/clear-all')
      setNotifications([])
      setActiveId(null)
    } catch (error) {
      console.error("Failed to clear notifications:", error)
    }
  }

  const handleDelete = async (id) => {
    try {
      await api.delete(`/notifications/${id}`)
      setNotifications((prev) => prev.filter((n) => n._id !== id))
      setActiveId(null)
    } catch (error) {
      console.error("Failed to delete notification:", error)
    }
  }

  const unreadCount = React.useMemo(() => notifications.filter(n => n.status === 'unread').length, [notifications])

  return (
    <Popover>
      <PopoverTrigger asChild>
        <button className="relative inline-flex items-center justify-center rounded-full p-2 hover:bg-muted group cursor-pointer">
          <Bell className="h-5 w-5 transition-colors group-hover:text-primary" />
          <span className="t-badge" data-open={unreadCount > 0 ? "true" : "false"}>
            <span className="t-badge-dot h-5 min-w-5 rounded-full bg-red-500 px-1 text-[10px] font-bold text-white shadow-xs border border-background">
              {unreadCount}
            </span>
          </span>
        </button>
      </PopoverTrigger>
      <PopoverContent
        className="w-80 p-0 gap-0 overflow-hidden"
        align="end"
        side={placement}
      >
        <div className="px-4 py-3 flex items-center justify-between border-b">
          <h4 className="font-semibold text-sm text-foreground">Notifications</h4>
          {notifications.length > 0 && (
            <Button 
              variant="ghost" 
              size="sm" 
              className="h-auto p-0 text-xs text-muted-foreground hover:text-foreground"
              onClick={handleClearAll}
            >
              Clear all
            </Button>
          )}
        </div>
        <Card className="max-h-80 overflow-y-auto rounded-none border-none shadow-none py-0 gap-0">
          {loading ? (
            <div className="p-8 flex items-center justify-center">
              <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
            </div>
          ) : notifications.length === 0 ? (
            <div className="flex flex-col items-center justify-center p-8 text-center space-y-3">
              <div className="p-3 bg-muted rounded-full">
                <BellOff className="h-6 w-6 text-muted-foreground/60" />
              </div>
              <div className="space-y-1">
                <p className="text-sm font-medium">No notifications yet</p>
                <p className="text-xs text-muted-foreground">We'll notify you when something happens.</p>
              </div>
            </div>
          ) : (
            <ScrollArea className="h-80">
              <ul className="divide-y divide-border">
                {notifications.map((item) => {
                  const isActive = activeId === item._id
                  const isUnread = item.status === 'unread'
                  const { icon, color } = getNotificationIcon(item.type, item.title)

                  return (
                     <li
                      key={item._id}
                      className="flex items-start gap-3 p-4 hover:bg-muted/50 transition relative group overflow-hidden"
                    >
                      {/* Unread indicator */}
                      {isUnread && (
                        <div className="absolute left-1 top-1/2 -translate-y-1/2 w-1 h-4 bg-primary rounded-r-full" />
                      )}
                      
                      {/* Animated Wrapper for Icon and Text */}
                      <motion.div
                        className="flex items-start gap-3 flex-1 min-w-0"
                        animate={{ x: isActive ? -75 : 0 }}
                        transition={{ duration: 0.2 }}
                      >
                        {/* Icon */}
                        <div className={`mt-0.5 shrink-0 p-2 rounded-lg border ${color}`}>
                          {icon}
                        </div>

                        {/* Text */}
                        <div className="flex-1 min-w-0">
                          <div className="flex justify-between items-center mb-0.5">
                            <span className={`font-semibold text-sm truncate ${isUnread ? 'text-foreground' : 'text-muted-foreground'}`}>
                              {item.title}
                            </span>
                            <span className="shrink-0 text-[10px] text-muted-foreground ml-2">
                              {formatDistanceToNow(new Date(item.createdAt), { addSuffix: false })}
                            </span>
                          </div>
                          <p className={`text-xs leading-snug line-clamp-2 ${isUnread ? 'text-muted-foreground' : 'text-muted-foreground/60'}`}>
                            {item.description}
                          </p>
                        </div>
                      </motion.div>

                      {/* Right side controls (Absolute positioned) */}
                      <div className="absolute right-3 top-1/2 -translate-y-1/2 flex items-center">
                        {isActive ? (
                          <div className="flex items-center space-x-1 bg-background border rounded-lg p-1 shadow-sm">
                            <button
                              className="p-1 rounded-md hover:bg-muted cursor-pointer"
                              onClick={() => handleArchive(item._id)}
                              title="Mark as read"
                            >
                              <Archive className="h-4 w-4 text-muted-foreground" />
                            </button>
                            <button
                              className="p-1 rounded-md hover:bg-muted cursor-pointer"
                              onClick={() => handleDelete(item._id)}
                              title="Delete"
                            >
                              <Trash2 className="h-4 w-4 text-destructive" />
                            </button>
                            <button
                              className="p-1 rounded-md hover:bg-muted cursor-pointer"
                              onClick={() => setActiveId(null)}
                            >
                              <ChevronRight className="h-4 w-4 text-muted-foreground" />
                            </button>
                          </div>
                        ) : (
                          <button
                            className="p-1 rounded-md hover:bg-muted cursor-pointer"
                            onClick={() =>
                              setActiveId(isActive ? null : item._id)
                            }
                          >
                            <IconGripVertical className="h-4 w-4 text-muted-foreground/30 group-hover:text-muted-foreground transition-colors" />
                          </button>
                        )}
                      </div>
                    </li>
                  )
                })}
              </ul>
            </ScrollArea>
          )}
        </Card>
      </PopoverContent>
    </Popover>
  )
}
