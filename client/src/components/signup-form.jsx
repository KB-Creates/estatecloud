import { useState } from "react"
import { useNavigate, Link } from "react-router-dom"
import { useAuth } from "@/context/AuthContext"
import { cn } from "@/lib/utils"
import { useGoogleLogin } from '@react-oauth/google'
import { Button } from "@/components/ui/button"
import Logo from "@/assets/Logo_old.png"
import LogoDark from "@/assets/Hassan Associates Logo.png"
import { toast } from "sonner"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import {
  Field,
  FieldDescription,
  FieldGroup,
  FieldLabel,
  FieldSeparator,
} from "@/components/ui/field"
import { Input } from "@/components/ui/input"

export function SignupForm({
  className,
  ...props
}) {
  const [name, setName] = useState("")
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [loading, setLoading] = useState(false)
  const { signup, googleLogin } = useAuth()
  const navigate = useNavigate()

  const handleGoogleSuccess = async (tokenResponse) => {
    setLoading(true)
    try {
      await googleLogin(tokenResponse.access_token, true)
      toast.success("Account created and logged in with Google!")
      navigate("/dashboard")
    } catch (err) {
      let msg = err.response?.data?.message || "Google registration failed";
      toast.error(msg)
    } finally {
      setLoading(false)
    }
  }

  const triggerGoogleLogin = useGoogleLogin({
    onSuccess: handleGoogleSuccess,
    onError: () => toast.error("Google login failed"),
  })

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
    try {
      await signup(name, email, password)
      toast.success("Account created successfully! Welcome.")
      navigate("/dashboard")
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to create account. Please try again.")
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className={cn("flex flex-col gap-6", className)} {...props}>
      <div className="flex flex-col items-center gap-2">
        <Link to="/" className="flex items-center gap-2 self-center font-medium">
          <img src={Logo} alt="Logo" className="h-10 w-auto dark:hidden" />
          <img src={LogoDark} alt="Logo" className="hidden h-10 w-auto dark:block" />
        </Link>
      </div>
      <Card>
        <CardHeader className="text-center">
          <CardTitle className="text-xl">Create Account</CardTitle>
          <CardDescription>
            Enter your details to register as an Admin
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit}>
            <FieldGroup>
              <Field>
                <FieldLabel htmlFor="name">Full Name</FieldLabel>
                <Input 
                  id="name" 
                  placeholder="John Doe" 
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  required 
                />
              </Field>
              <Field>
                <FieldLabel htmlFor="email">Email</FieldLabel>
                <Input 
                  id="email" 
                  type="email" 
                  placeholder="m@example.com" 
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required 
                />
              </Field>
              <Field>
                <FieldLabel htmlFor="password">Password</FieldLabel>
                <Input  
                  id="password" 
                  type="password" 
                  placeholder="••••••••"
                  value={password} 
                  onChange={(e) => setPassword(e.target.value)} 
                  required 
                />
              </Field>

              <Field>
                <FieldSeparator className="*:data-[slot=field-separator-content]:bg-card">
                  Or continue with
                </FieldSeparator>
              </Field>

              <Button 
                variant="outline" 
                type="button" 
                onClick={() => triggerGoogleLogin()}
                disabled={loading}
                className="w-full"
              >
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" className="mr-2 size-4">
                  <path
                    d="M12.48 10.92v3.28h7.84c-.24 1.84-.853 3.187-1.787 4.133-1.147 1.147-2.933 2.4-6.053 2.4-4.827 0-8.6-3.893-8.6-8.72s3.773-8.72 8.6-8.72c2.6 0 4.507 1.027 5.907 2.347l2.307-2.307C18.747 1.44 16.133 0 12.48 0 5.867 0 .307 5.387.307 12s5.56 12 12.173 12c3.573 0 6.267-1.173 8.373-3.36 2.16-2.16 2.84-5.213 2.84-7.667 0-.76-.053-1.467-.173-2.053H12.48z"
                    fill="currentColor" />
                </svg>
                Continue with Google
              </Button>

              <Field className="pt-2">
                <Button type="submit" disabled={loading} className="w-full">
                  {loading ? "Creating account..." : "Sign Up"}
                </Button>
                <FieldDescription className="text-center text-xs">
                  Already have an account? <Link to="/login" className="underline underline-offset-4">Login</Link>
                </FieldDescription>
              </Field>
            </FieldGroup>
          </form>
        </CardContent>
      </Card>
      <FieldDescription className="px-6 text-xs text-center">
        By clicking sign up, you agree to our <a href="#">Terms of Service</a>{" "}
        and <a href="#">Privacy Policy</a>.
      </FieldDescription>
    </div>
  );
}