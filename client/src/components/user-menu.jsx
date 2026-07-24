import * as React from "react"
import { useLocation, useNavigate } from "react-router-dom"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Switch } from "@/components/ui/switch"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
  DropdownMenuGroup,
} from "@/components/ui/dropdown-menu"
import {
  IconUserCircle,
  IconActivity,
  IconBell as IconNotification,
  IconSettings,
  IconLogout,
  IconUser,
  IconSun,
  IconMoon,
} from "@tabler/icons-react"
import { useAuth } from "@/context/AuthContext"
import { useTheme } from "@/components/theme-provider"

export function UserMenu() {
  const { user, logout } = useAuth()
  const navigate = useNavigate()
  const { theme, setTheme } = useTheme()

  if (!user) return null;

  const initials = user?.name?.trim().split(' ').map(n => n[0]).join('').toUpperCase() || 'U'

  const handleLogout = async () => {
    await logout()
    navigate('/login')
  }

  const getAvatarUrl = () => {
    if (!user?.avatar) return null;
    if (user.avatar.startsWith('http') || user.avatar.startsWith('data:')) return user.avatar;
    const baseUrl = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';
    return `${baseUrl.replace('/api', '')}/${user.avatar.replace(/^\//, '')}`;
  };
  const avatarUrl = getAvatarUrl();

  return (
    <>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Avatar className="cursor-pointer">
            <AvatarImage src={avatarUrl} alt={user.name} />
            <AvatarFallback >{initials}</AvatarFallback>
          </Avatar>
        </DropdownMenuTrigger>
        <DropdownMenuContent
          side="bottom"
          align="end"
          sideOffset={5}
          className="w-57"
        >
          <DropdownMenuLabel className="p-0 font-normal">
            <div className="flex items-center gap-2 px-1 py-1.5 text-left text-sm">
              <Avatar className="h-8 w-8">
                <AvatarImage src={avatarUrl} alt={user.name} />
                <AvatarFallback>{initials}</AvatarFallback>
              </Avatar>
              <div className="grid flex-1 text-left leading-tight">
                <span className="font-medium text-foreground text-sm">{user.name}</span>
                <span className="truncate text-xs text-muted-foreground uppercase">{user.role || 'User'}</span>
              </div>
            </div>
          </DropdownMenuLabel>
          <DropdownMenuSeparator />
          <DropdownMenuGroup>
            <DropdownMenuItem 
              className="flex items-center justify-between"
              onClick={(e) => {
                e.preventDefault()
                setTheme(theme === 'dark' ? 'light' : 'dark')
              }}
            >
              <div className="flex items-center gap-2">
                {theme === 'dark' ? <IconSun className="size-4" /> : <IconMoon className="size-4" />}
                {theme === 'dark' ? 'Light Mode' : 'Dark Mode'}
              </div>
              <Switch 
                checked={theme === 'dark'} 
                onCheckedChange={(checked) => setTheme(checked ? 'dark' : 'light')} 
              />
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => navigate('/settings')}>
              <IconUserCircle className="size-4" />
              Account
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => navigate('/activities')}>
              <IconActivity className="size-4" />
              Activities
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => navigate('/roles')}>
              <IconUser className="size-4" />
              Manage Role
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => navigate('/settings')}>
              <IconSettings className="size-4" />
              Settings
            </DropdownMenuItem>
          </DropdownMenuGroup>
          <DropdownMenuSeparator />
          <DropdownMenuItem onClick={handleLogout}>
            <IconLogout className="text-destructive hover:text-destructive" />
            <span className="text-destructive hover:text-destructive">Log out</span>
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </>
  )
}
