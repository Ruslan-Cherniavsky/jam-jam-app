import {useRef, useState, FormEvent} from "react"
import {Form, Button, Card, Alert} from "react-bootstrap"
import {useAuthContext} from "../../../context/AuthContext"
import {Link, useNavigate} from "react-router-dom"

export default function Login() {
  const navigate = useNavigate()
  const emailRef = useRef<HTMLInputElement>(null)
  const passwordRef = useRef<HTMLInputElement>(null)
  const {login, signInWithGoogle} = useAuthContext()
  const [error, setError] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)

  async function handleSubmit(e: FormEvent) {
    e.preventDefault()
    try {
      setLoading(true)
      setError("")

      if (!emailRef.current!.value || !passwordRef.current!.value) {
        setError("Email and password are required")
        return
      }

      await login(emailRef.current!.value, passwordRef.current!.value)
      

      navigate("/")
    } catch (error: any) {
      console.log(error)
      if (error.code === "auth/too-many-requests") {
        setError(
          "Access to this account has been temporarily disabled due to many failed login attempts. You can immediately restore it by resetting your password or you can try again later."
        )
      } else {
        setError("Failed to log in")
      }
    } finally {
      setLoading(false)
    }
  }

  async function handleGoogleLogin() {
    try {
      setLoading(true)
      setError("")
      await signInWithGoogle()
      navigate("/")
    } catch (error) {
      console.error("Failed to log in with Google", error)
      setError("Failed to log in with Google. Please try again.")
    } finally {
      setLoading(false)
    }
  }

  return (
    <>
      <Card>
        <Card.Body>
          <h2 className="text-center mb-4">Log In</h2>
          {error && <Alert variant="danger">{error}</Alert>}
          <Form onSubmit={handleSubmit}>
            <Form.Group id="email">
              <Form.Label>Email</Form.Label>
              <Form.Control type="email" ref={emailRef} required />
            </Form.Group>
            <Form.Group id="password">
              <Form.Label>Password</Form.Label>
              <Form.Control type="password" ref={passwordRef} required />
            </Form.Group>
            <Button disabled={loading} className="w-100" type="submit">
              {loading ? "Logging In..." : "Log In"}
            </Button>
            <Button
              onClick={handleGoogleLogin}
              disabled={loading}
              className="w-100 mt-3">
              {loading ? "Logging In with Google..." : "Log In with Google"}
            </Button>
          </Form>
          <div className="w-100 text-center mt-2">
            Forgot password? <Link to="/forgot-password">Password reset</Link>
          </div>
          <div className="w-100 text-center mt-2">
            Need an account? <Link to="/signup">Sign Up</Link>
          </div>
        </Card.Body>
      </Card>
    </>
  )
}
