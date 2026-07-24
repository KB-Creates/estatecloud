import { useState, useEffect } from "react"
import { useTheme } from "@/components/theme-provider"
import api from "@/lib/api"
import { toast } from "sonner"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle
} from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Switch } from "@/components/ui/switch"
import { Textarea } from "@/components/ui/textarea"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
  SelectGroup
} from "@/components/ui/select"
import { useAuth } from "@/context/AuthContext"
import { useSettings } from "@/context/SettingsContext"
import {
  IconSettings,
  IconPalette,
  IconLock,
  IconBell,
  IconMoon,
  IconSun,
  IconDeviceDesktop,
  IconLoader2,
  IconBuildingStore,
  IconPhone,
  IconMail,
  IconWorld,
  IconClock,
  IconMapPin,
  IconReceipt,
  IconRobot,
  IconCloudDownload,
  IconDeviceFloppy,
  IconUser,
  IconCamera,
  IconBuilding,
  IconFileText,
  IconServer
} from "@tabler/icons-react"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import React from "react"

export default function SettingsPage() {
  const { user, updateUser } = useAuth()
  const { theme, setTheme } = useTheme()
  const { refreshSettings } = useSettings()
  const [loading, setLoading] = useState(false)
  const [saving, setSaving] = useState(false)
  const [profileLoading, setProfileLoading] = useState(false)
  const fileInputRef = React.useRef(null)

  const [settings, setSettings] = useState({
    storeName: "EstateCloud",
    storeLogo: "",
    phone: "+8801749335508",
    email: "admin@example.com",
    website: "https://www.yourstore.com",
    businessHours: "Mon-Fri: 9:00 AM - 6:00 PM",
    address: "Bashundhara, Dhaka",
    taxId: "",
    currency: "$ USD - US Dollar",
    timezone: "(GMT+04:00) Dubai",
    taxRate: 0,
    receiptFooter: "Thank you for your business!",
    termsAndConditions: "",
    enableSMS: false,
    enableEmail: false,
    enableAIReporting: false,
    smtpHost: "",
    smtpPort: "587",
    smtpUser: "",
    smtpPass: "",
    smtpFrom: "",
    accentColor: "#eab308"
  })

  const [profileData, setProfileData] = useState({
    name: "",
    email: "",
    phone: "",
    companyName: "",
    address: "",
    avatar: ""
  })

  const [passwords, setPasswords] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: ""
  })

  useEffect(() => {
    fetchSettings()
  }, [])

  useEffect(() => {
    if (user) {
      setProfileData({
        name: user.name || "",
        email: user.email || "",
        phone: user.phone || "",
        companyName: user.companyName || "",
        address: user.address || "",
        avatar: user.avatar || ""
      })
    }
  }, [user])

  const fetchSettings = async () => {
    try {
      setLoading(true)
      const response = await api.get('/settings')
      if (response.data) {
        setSettings(response.data)
      }
    } catch (error) {
      toast.error("Failed to load settings")
    } finally {
      setLoading(false)
    }
  }

  const handleInputChange = (id, value) => {
    setSettings(prev => ({ ...prev, [id]: value }))

    // Real-time preview for accent color
    if (id === 'accentColor') {
      document.documentElement.style.setProperty('--primary', value);
      document.documentElement.style.setProperty('--sidebar-primary', value);
    }
  }

  const saveSettings = async () => {
    try {
      setSaving(true)
      await api.patch('/settings', settings)
      await refreshSettings()
      toast.success("Settings updated successfully")
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to save settings")
    } finally {
      setSaving(false)
    }
  }

  const handlePasswordChange = async (e) => {
    e.preventDefault()
    if (passwords.newPassword !== passwords.confirmPassword) {
      return toast.error("New passwords do not match")
    }

    try {
      setSaving(true)
      await api.patch('/users/change-password', {
        currentPassword: user?.googleId ? undefined : passwords.currentPassword,
        newPassword: passwords.newPassword
      })
      toast.success(user?.googleId ? "Password set successfully" : "Password changed successfully")
      setPasswords({ currentPassword: "", newPassword: "", confirmPassword: "" })
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to change password")
    } finally {
      setSaving(false)
    }
  }

  const handleProfileChange = (e) => {
    const { id, value } = e.target
    setProfileData(prev => ({ ...prev, [id]: value }))
  }

  const handleProfileSubmit = async (e) => {
    e.preventDefault()
    try {
      setProfileLoading(true)
      const dataToUpdate = {
        name: profileData.name,
        phone: profileData.phone,
        companyName: profileData.companyName,
        address: profileData.address,
        avatar: profileData.avatar
      }
      const response = await api.patch('/users/profile', dataToUpdate)
      updateUser(response.data)
      toast.success("Profile updated successfully")
    } catch (error) {
      console.error("Profile update error:", error)
      toast.error(error.response?.data?.message || "Failed to update profile")
    } finally {
      setProfileLoading(false)
    }
  }

  const handleFileChange = (e) => {
    const file = e.target.files[0]
    if (!file) return

    if (file.size > 2 * 1024 * 1024) {
      toast.error("File size must be less than 2MB")
      return
    }

    const reader = new FileReader()
    reader.onloadend = () => {
      setProfileData(prev => ({ ...prev, avatar: reader.result }))
      toast.info("Avatar updated in preview. Click Update Profile to confirm.")
    }
    reader.readAsDataURL(file)
  }

  const triggerFileInput = () => {
    fileInputRef.current?.click()
  }

  const initials = profileData.name ? profileData.name.split(' ').map(n => n[0]).join('').toUpperCase() : 'U'

  const testEmailConnection = async () => {
    try {
      setSaving(true)
      await api.post('/settings/test-email', { testEmail: user.email })
      toast.success("Test email sent successfully! Please check your inbox.")
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to send test email")
    } finally {
      setSaving(false)
    }
  }

  const handleDownloadBackup = async () => {
    try {
      toast.info("Preparing backup...")
      const response = await api.get('/settings/backup', { responseType: 'blob' })
      const url = window.URL.createObjectURL(new Blob([response.data]))
      const link = document.createElement('a')
      link.href = url
      link.setAttribute('download', 'backup.json')
      document.body.appendChild(link)
      link.click()
      link.remove()
      toast.success("Backup downloaded successfully")
    } catch (error) {
      toast.error("Failed to download backup")
    }
  }

  const handleRestoreBackup = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = async (event) => {
      try {
        const json = JSON.parse(event.target.result);

        if (confirm("WARNING: Restoring this backup will wipe all current data and replace it with the backup data. Are you sure you want to proceed?")) {
          setLoading(true);
          await api.post('/settings/restore', json);
          toast.success("Backup restored successfully!");
          setTimeout(() => window.location.reload(), 2000);
        }
      } catch (error) {
        console.error("Restore failed:", error);
        toast.error("Failed to restore backup. Invalid file format.");
      } finally {
        setLoading(false);
      }
    };
    reader.readAsText(file);
  }

  if (loading) {
    return (
      <div className="flex h-[400px] items-center justify-center">
        <IconLoader2 className="size-8 animate-spin text-primary" />
      </div>
    )
  }

  return (
    <div className="w-full space-y-8 pb-10">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 px-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight flex items-center gap-2">
            <IconSettings className="size-8 text-primary" />
            System Settings
          </h1>
          <p className="text-muted-foreground">
            Manage your store configuration, financial settings, and account security.
          </p>
        </div>
      </div>

      <Tabs defaultValue="profile" className="w-full">
        <TabsList className="flex w-fit bg-muted/50 border items-center">
          <TabsTrigger value="profile" className="gap-2 px-4 h-8">
            <IconUser className="size-4" />
            Profile
          </TabsTrigger>

          <TabsTrigger value="regional" className="gap-2 px-4 h-8">
            <IconReceipt className="size-4" />
            Regional
          </TabsTrigger>
          <TabsTrigger value="features" className="gap-2 px-4 h-8">
            <IconRobot className="size-4" />
            Features
          </TabsTrigger>
          <TabsTrigger value="appearance" className="gap-2 px-4 h-8">
            <IconPalette className="size-4" />
            Appearance
          </TabsTrigger>
          <TabsTrigger value="email" className="gap-2 px-4 h-8">
            <IconMail className="size-4" />
            Email
          </TabsTrigger>
          <TabsTrigger value="security" className="gap-2 px-4 h-8">
            <IconLock className="size-4" />
            Security
          </TabsTrigger>
          <TabsTrigger value="backup" className="gap-2 px-4 h-8">
            <IconCloudDownload className="size-4" />
            Backup
          </TabsTrigger>
        </TabsList>

        {/* --- Profile Settings --- */}
        <TabsContent value="profile" className="mt-6 space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <Card className="md:col-span-1 h-fit">
              <CardHeader className="text-center">
                <div className="relative mx-auto w-24 h-24 mb-4">
                  <input
                    type="file"
                    ref={fileInputRef}
                    className="hidden"
                    accept="image/*"
                    onChange={handleFileChange}
                  />
                  <Avatar className="w-24 h-24 border-4 border-background shadow-xl">
                    <AvatarImage src={profileData.avatar} className="object-cover" />
                    <AvatarFallback className="text-2xl font-bold bg-primary/10 text-primary">
                      {initials}
                    </AvatarFallback>
                  </Avatar>
                  <Button
                    size="icon"
                    variant="secondary"
                    className="absolute bottom-0 right-0 rounded-full size-8 shadow-md border border-background hover:bg-primary hover:text-primary-foreground transition-all"
                    title="Change Avatar"
                    onClick={triggerFileInput}
                    type="button"
                  >
                    <IconCamera className="size-4" />
                  </Button>
                </div>
                <CardTitle>{profileData.name}</CardTitle>
                <CardDescription>{user?.role?.toUpperCase() || "ADMIN"}</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center gap-3 text-sm text-muted-foreground justify-center">
                  <IconMail className="size-4" />
                  <span>{profileData.email}</span>
                </div>
                {profileData.phone && (
                  <div className="flex items-center gap-3 text-sm text-muted-foreground justify-center">
                    <IconPhone className="size-4" />
                    <span>{profileData.phone}</span>
                  </div>
                )}
                {profileData.address && (
                  <div className="flex items-center gap-3 text-sm text-muted-foreground justify-center">
                    <IconMapPin className="size-4" />
                    <span>{profileData.address}</span>
                  </div>
                )}
              </CardContent>
            </Card>

            <Card className="md:col-span-2">
              <CardHeader>
                <CardTitle>Profile Information</CardTitle>
                <CardDescription>Update your personal details here.</CardDescription>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleProfileSubmit} className="space-y-6">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="name">Full Name</Label>
                      <div className="relative">
                        <IconUser className="absolute left-3 top-3 size-4 text-muted-foreground" />
                        <Input
                          id="name"
                          className="pl-9 w-full"
                          placeholder="Enter your name"
                          value={profileData.name}
                          onChange={handleProfileChange}
                          required
                        />
                      </div>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="email">Email Address</Label>
                      <div className="relative">
                        <IconMail className="absolute left-3 top-3 size-4 text-muted-foreground" />
                        <Input
                          id="email"
                          className="pl-9 w-full bg-muted cursor-not-allowed"
                          placeholder="your@email.com"
                          value={profileData.email}
                          disabled
                        />
                      </div>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="phone">Phone Number</Label>
                      <div className="relative">
                        <IconPhone className="absolute left-3 top-3 size-4 text-muted-foreground" />
                        <Input
                          id="phone"
                          className="pl-9 w-full"
                          placeholder="+1 (555) 000-0000"
                          value={profileData.phone}
                          onChange={handleProfileChange}
                        />
                      </div>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="companyName">Company Name</Label>
                      <div className="relative">
                        <IconBuilding className="absolute left-3 top-3 size-4 text-muted-foreground" />
                        <Input
                          id="companyName"
                          className="pl-9 w-full"
                          placeholder="Acme Inc."
                          value={profileData.companyName}
                          onChange={handleProfileChange}
                        />
                      </div>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="address">Address</Label>
                      <div className="relative">
                        <IconMapPin className="absolute left-3 top-3 size-4 text-muted-foreground" />
                        <Input
                          id="address"
                          className="pl-9 w-full"
                          placeholder="123 Street, City"
                          value={profileData.address}
                          onChange={handleProfileChange}
                        />
                      </div>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="avatar">Avatar URL</Label>
                    <Input
                      id="avatar"
                      className="w-full"
                      placeholder="https://example.com/avatar.jpg"
                      value={profileData.avatar}
                      onChange={handleProfileChange}
                    />
                  </div>

                  <div className="flex justify-end pt-4 border-t">
                    <Button type="submit" disabled={profileLoading} className="gap-2">
                      {profileLoading ? (
                        <IconLoader2 className="size-4 animate-spin" />
                      ) : (
                        <IconDeviceFloppy className="size-4" />
                      )}
                      Update Profile
                    </Button>
                  </div>
                </form>
              </CardContent>
            </Card>
          </div>
        </TabsContent>



        {/* --- Regional Settings --- */}
        <TabsContent value="regional" className="mt-6 space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Regional Settings</CardTitle>
                <CardDescription>Currency and Date formats configurations.</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label>Currency</Label>
                    <Select value={settings.currency} onValueChange={(v) => handleInputChange('currency', v)}>
                      <SelectTrigger className="w-full">
                        <SelectValue placeholder="Select Currency" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectGroup>
                          <SelectItem value="$ USD - US Dollar">$ USD - US Dollar</SelectItem>
                          <SelectItem value="€ EUR - Euro">€ EUR - Euro</SelectItem>
                          <SelectItem value="AED - UAE Dirham">AED - UAE Dirham</SelectItem>
                          <SelectItem value="SAR - Saudi Riyal">SR - Saudi Riyal</SelectItem>
                          <SelectItem value="PKR - Pakistani Rupee">₨ - Pakistani Rupee</SelectItem>
                        </SelectGroup>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label>Timezone</Label>
                    <Select value={settings.timezone} onValueChange={(v) => handleInputChange('timezone', v)}>
                      <SelectTrigger className="w-full">
                        <SelectValue placeholder="Select Timezone" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectGroup>
                          <SelectItem value="(GMT+04:00) Dubai">(GMT+04:00) Dubai</SelectItem>
                          <SelectItem value="(GMT+05:00) Karachi">(GMT+05:00) Karachi</SelectItem>
                          <SelectItem value="(GMT+00:00) London">(GMT+00:00) London</SelectItem>
                        </SelectGroup>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label>Default Tax Rate (%)</Label>
                    <Input
                      type="number"
                      value={settings.taxRate}
                      onChange={(e) => handleInputChange('taxRate', Number(e.target.value))}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>Date Format</Label>
                    <Select value={settings.dateFormat} onValueChange={(v) => handleInputChange('dateFormat', v)}>
                      <SelectTrigger className="w-full">
                        <SelectValue placeholder="Select Date Format" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectGroup>
                          <SelectItem value="(MM/DD/YYYY) MM/DD/YYYY">(MM/DD/YYYY) MM/DD/YYYY</SelectItem>
                          <SelectItem value="(DD/MM/YYYY) DD/MM/YYYY">(DD/MM/YYYY) DD/MM/YYYY</SelectItem>
                          <SelectItem value="(YYYY/MM/DD) YYYY/MM/DD">(YYYY/MM/DD) YYYY/MM/DD</SelectItem>
                        </SelectGroup>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Receipt Customization</CardTitle>
                <CardDescription>Customize the appearance of your receipts.</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label>Receipt Footer Message</Label>
                  <Input
                    value={settings.receiptFooter}
                    onChange={(e) => handleInputChange('receiptFooter', e.target.value)}
                  />
                </div>
                <div className="space-y-2">
                  <Label>Terms and Conditions</Label>
                  <Textarea
                    placeholder="Enter your terms and conditions..."
                    className="min-h-[100px]"
                    value={settings.termsAndConditions}
                    onChange={(e) => handleInputChange('termsAndConditions', e.target.value)}
                  />
                </div>
              </CardContent>
            </Card>
          </div>
          <div className="flex justify-end px-4">
            <Button onClick={saveSettings} disabled={saving} className="gap-2">
              {saving ? <IconLoader2 className="size-4 animate-spin" /> : <IconDeviceFloppy className="size-4" />}
              Save Financial Settings
            </Button>
          </div>
        </TabsContent>

        {/* --- Features --- */}
        <TabsContent value="features" className="mt-6 space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Feature Integrations</CardTitle>
              <CardDescription>Toggle advanced system capabilities.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="flex items-center justify-between p-4 border rounded-lg hover:bg-muted/50 transition-colors">
                <div className="space-y-0.5">
                  <div className="flex items-center gap-2">
                    <Label className="text-base">SMS Settings (Twilio)</Label>
                  </div>
                  <p className="text-sm text-muted-foreground">Enable SMS notifications for bookings and payments.</p>
                </div>
                <Switch
                  checked={settings.enableSMS}
                  onCheckedChange={(v) => handleInputChange('enableSMS', v)}
                />
              </div>

              <div className="flex items-center justify-between p-4 border rounded-lg hover:bg-muted/50 transition-colors">
                <div className="space-y-0.5">
                  <Label className="text-base">Email Settings (SMTP)</Label>
                  <p className="text-sm text-muted-foreground">Enable automated email notifications.</p>
                </div>
                <Switch
                  checked={settings.enableEmail}
                  onCheckedChange={(v) => handleInputChange('enableEmail', v)}
                />
              </div>


            </CardContent>
          </Card>
          <div className="flex justify-end">
            <Button onClick={saveSettings} disabled={saving} className="gap-2">
              {saving ? <IconLoader2 className="size-4 animate-spin" /> : <IconDeviceFloppy className="size-4" />}
              Save Features
            </Button>
          </div>
        </TabsContent>

        {/* --- Email Settings --- */}
        <TabsContent value="email" className="mt-6 space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>SMTP Configuration</CardTitle>
              <CardDescription>Configure your outgoing email server settings.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label>SMTP Host</Label>
                  <div className="relative">
                    <IconServer className="absolute left-3 top-3 size-4 text-muted-foreground" />
                    <Input
                      className="pl-9"
                      placeholder="smtp.example.com"
                      value={settings.smtpHost}
                      onChange={(e) => handleInputChange('smtpHost', e.target.value)}
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label>SMTP Port</Label>
                  <Input
                    placeholder="587"
                    value={settings.smtpPort}
                    onChange={(e) => handleInputChange('smtpPort', e.target.value)}
                  />
                </div>
                <div className="space-y-2">
                  <Label>SMTP Username</Label>
                  <div className="relative">
                    <IconUser className="absolute left-3 top-3 size-4 text-muted-foreground" />
                    <Input
                      className="pl-9"
                      placeholder="user@example.com"
                      value={settings.smtpUser}
                      onChange={(e) => handleInputChange('smtpUser', e.target.value)}
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label>SMTP Password</Label>
                  <div className="relative">
                    <IconLock className="absolute left-3 top-3 size-4 text-muted-foreground" />
                    <Input
                      type="password"
                      className="pl-9"
                      placeholder="••••••••"
                      value={settings.smtpPass}
                      onChange={(e) => handleInputChange('smtpPass', e.target.value)}
                    />
                  </div>
                </div>
                <div className="space-y-2 md:col-span-2">
                  <Label>Sender Email (From)</Label>
                  <div className="relative">
                    <IconMail className="absolute left-3 top-3 size-4 text-muted-foreground" />
                    <Input
                      className="pl-9"
                      placeholder="noreply@yourdomain.com"
                      value={settings.smtpFrom}
                      onChange={(e) => handleInputChange('smtpFrom', e.target.value)}
                    />
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
          <div className="flex justify-end px-4 gap-3">
            <Button onClick={testEmailConnection} variant="outline" disabled={saving} className="gap-2">
              {saving ? <IconLoader2 className="size-4 animate-spin" /> : <IconMail className="size-4" />}
              Test Connection
            </Button>
            <Button onClick={saveSettings} disabled={saving} className="gap-2">
              {saving ? <IconLoader2 className="size-4 animate-spin" /> : <IconDeviceFloppy className="size-4" />}
              Save SMTP Settings
            </Button>
          </div>
        </TabsContent>

        {/* --- Appearance --- */}
        <TabsContent value="appearance" className="mt-6 space-y-8">
          <Card>
            <CardHeader>
              <CardTitle>Accent Color</CardTitle>
              <CardDescription>Customize the primary color of the application.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="flex flex-wrap gap-4">
                {[
                  { name: "Default (Yellow)", color: "#eab308" },
                  { name: "Blue", color: "#3b82f6" },
                  { name: "Green", color: "#22c55e" },
                  { name: "Red", color: "#ef4444" },
                  { name: "Purple", color: "#a855f7" },
                  { name: "Orange", color: "#f97316" },
                  { name: "Indigo", color: "#6366f1" },
                  { name: "Pink", color: "#ec4899" },
                ].map((c) => (
                  <button
                    key={c.color}
                    type="button"
                    className={`size-10 rounded-full border-2 transition-all hover:scale-110 ${settings.accentColor === c.color ? "border-primary ring-2 ring-primary ring-offset-2" : "border-transparent"
                      }`}
                    style={{ backgroundColor: c.color }}
                    title={c.name}
                    onClick={() => handleInputChange('accentColor', c.color)}
                  />
                ))}
              </div>
              <div className="flex items-center gap-4 pt-4 border-t">
                <div className="space-y-1">
                  <Label>Custom Color</Label>
                  <div className="flex items-center gap-2">
                    <Input
                      type="color"
                      className="p-1 size-10 rounded-lg cursor-pointer"
                      value={settings.accentColor}
                      onChange={(e) => handleInputChange('accentColor', e.target.value)}
                    />
                    <Input
                      className="w-32 font-mono"
                      value={settings.accentColor}
                      onChange={(e) => handleInputChange('accentColor', e.target.value)}
                    />
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Theme Preference</CardTitle>
              <CardDescription>Choose how the application looks to you.</CardDescription>
            </CardHeader>
            <CardContent className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <Button
                variant={theme === "light" ? "default" : "outline"}
                className="flex flex-col items-center gap-3 h-32"
                onClick={() => setTheme("light")}
              >
                <IconSun className="size-8" />
                <p className="font-medium">Light Mode</p>
              </Button>

              <Button
                variant={theme === "dark" ? "default" : "outline"}
                className="flex flex-col items-center gap-3 h-32"
                onClick={() => setTheme("dark")}
              >
                <IconMoon className="size-8" />
                <p className="font-medium">Dark Mode</p>
              </Button>

              <Button
                variant={theme === "system" ? "default" : "outline"}
                className="flex flex-col items-center gap-3 h-32"
                onClick={() => setTheme("system")}
              >
                <IconDeviceDesktop className="size-8" />
                <p className="font-medium">System Default</p>
              </Button>
            </CardContent>
          </Card>

          <div className="flex justify-end px-4">
            <Button onClick={saveSettings} disabled={saving} className="gap-2">
              {saving ? <IconLoader2 className="size-4 animate-spin" /> : <IconDeviceFloppy className="size-4" />}
              Save Appearance
            </Button>
          </div>
        </TabsContent>

        {/* --- Security --- */}
        <TabsContent value="security" className="mt-6 space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Change Password</CardTitle>
              <CardDescription>Secure your account with a strong password.</CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handlePasswordChange} className="space-y-4 max-w-md">
                {!user?.googleId && (
                  <div className="space-y-2">
                    <Label htmlFor="currentPassword">Current Password</Label>
                    <Input
                      id="currentPassword"
                      type="password"
                      value={passwords.currentPassword}
                      onChange={(e) => setPasswords(prev => ({ ...prev, currentPassword: e.target.value }))}
                      required
                    />
                  </div>
                )}
                <div className="space-y-2">
                  <Label htmlFor="newPassword">New Password</Label>
                  <Input
                    id="newPassword"
                    type="password"
                    value={passwords.newPassword}
                    onChange={(e) => setPasswords(prev => ({ ...prev, newPassword: e.target.value }))}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="confirmPassword">Confirm New Password</Label>
                  <Input
                    id="confirmPassword"
                    type="password"
                    value={passwords.confirmPassword}
                    onChange={(e) => setPasswords(prev => ({ ...prev, confirmPassword: e.target.value }))}
                    required
                  />
                </div>
                <Button type="submit" disabled={saving} className="gap-2">
                  {saving ? <IconLoader2 className="size-4 animate-spin" /> : <IconLock className="size-4" />}
                  Update Password
                </Button>
              </form>
            </CardContent>
          </Card>
        </TabsContent>

        {/* --- Backup --- */}
        <TabsContent value="backup" className="mt-6 space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Export Card */}
            <Card className="border-primary/20">
              <CardHeader>
                <CardTitle className="text-primary">Export Full Backup</CardTitle>
                <CardDescription>Download a complete snapshot of your data.</CardDescription>
              </CardHeader>
              <CardContent className="pt-6 space-y-4">
                <div className="p-4 bg-muted rounded-lg text-sm text-muted-foreground flex gap-3 items-start">
                  <IconCloudDownload className="size-5 shrink-0 text-primary" />
                  <p>
                    Download a JSON backup of your entire database. Keep this file safe and do not share it publicly.
                    This backup can be used to restore your system in case of data loss.
                  </p>
                </div>
                <Button onClick={handleDownloadBackup} variant="outline" className="gap-2 border-primary/30 hover:bg-primary/10 transition-all">
                  <IconCloudDownload className="size-4" />
                  Download Backup
                </Button>
              </CardContent>
            </Card>

            {/* Import Card */}
            <Card className="border-destructive/20">
              <CardHeader>
                <CardTitle className="text-destructive">Restore Data</CardTitle>
                <CardDescription>Import a previously exported backup file.</CardDescription>
              </CardHeader>
              <CardContent className="pt-6 space-y-4">
                <div className="p-4 bg-destructive/10 rounded-lg text-sm text-destructive flex gap-3 items-start">
                  <IconFileText className="size-5 shrink-0" />
                  <p>
                    WARNING: Restoring a backup will overwrite ALL current data in the application (Properties, Customers, Bookings, etc). This action cannot be undone.
                  </p>
                </div>
                <div>
                  <Label htmlFor="importBackup" className="cursor-pointer">
                    <div className="flex items-center gap-2 justify-center w-max px-4 py-2 border border-destructive text-destructive rounded-md hover:bg-destructive hover:text-destructive-foreground transition-all">
                      <IconFileText className="size-4" />
                      Select Backup File
                    </div>
                  </Label>
                  <input
                    id="importBackup"
                    type="file"
                    accept=".json"
                    className="hidden"
                    onChange={handleRestoreBackup}
                  />
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  )
}
