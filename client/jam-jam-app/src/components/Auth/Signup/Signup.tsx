import {useRef, useState, FormEvent} from "react"
import {Form, Button, Card, Alert} from "react-bootstrap"
import {useAuthContext} from "../../../context/AuthContext"
import {Link, useNavigate} from "react-router-dom"
import dataAxios from "../../../server/data.axios"

export default function Signup() {
  const navigate = useNavigate()
  const emailRef = useRef<HTMLInputElement>(null)
  const passwordRef = useRef<HTMLInputElement>(null)
  const passwordConfirmRef = useRef<HTMLInputElement>(null)
  const {signup, currentUser, sendCurrentEmailVerification, signInWithGoogle} =
    useAuthContext()
  const [error, setError] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)

  async function handleSubmit(e: FormEvent) {
    e.preventDefault()

    if (passwordRef.current!.value !== passwordConfirmRef.current!.value) {
      return setError("Passwords must match")
    }
    try {
      setLoading(true)
      setError("")
      await signup(emailRef.current!.value, passwordRef.current!.value)

      if (currentUser) {
        try {
          await sendCurrentEmailVerification()
        } catch (error: any) {
          if (error.code === "auth/too-many-requests") {
            setError("Too many requests. Please try again later.")
          } else {
            setError("Error sending verification email: ")
          }
        }
      }
      await dataAxios.createUserMongoDB(emailRef.current!.value)
      navigate("/check-email")
    } catch (error: any) {
      if (error.code === "auth/email-already-in-use") {
        setError("Email already exists. Please choose a different email.")
      } else {
        setError("Failed to create an account")
      }
    }
    setLoading(false)
  }

  // async function sendVerificationEmail() {
  //   if (currentUser) {
  //     try {
  //       await sendCurrentEmailVerification()
  //       console.log("Verification email sent successfully")
  //     } catch (error) {
  //       console.error("Error sending verification email: ")
  //     }
  //   }
  // }

  async function handleGoogleSignup() {
    try {
      setLoading(true)
      setError("")
      await signInWithGoogle()
      navigate("/")
    } catch (error) {
      setError("Failed to sign up with Google")
    }

    setLoading(false)
  }

  return (
    <>
      <Card>
        <Card.Body>
          <h2 className="text-center mb-4">Sign up</h2>
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
            <Form.Group id="password-confirm">
              <Form.Label>Password Confirmation</Form.Label>
              <Form.Control type="password" ref={passwordConfirmRef} required />
            </Form.Group>
            <Button disabled={loading} className="w-100" type="submit">
              Sign up
            </Button>
            <Button
              disabled={loading}
              className="w-100 mt-3"
              onClick={handleGoogleSignup}>
              Sign up with Google
            </Button>
          </Form>
        </Card.Body>
      </Card>
      <div className="w-100 text-center mt-2">
        Already have an account? <Link to="/login">Log in</Link>
      </div>
    </>
  )
}
