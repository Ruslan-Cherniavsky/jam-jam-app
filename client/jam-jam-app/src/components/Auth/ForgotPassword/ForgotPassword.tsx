import React, {FormEvent, useRef, useState} from "react"
import {Form, Button, Card, Alert} from "react-bootstrap"
import {useAuthContext} from "../../../context/AuthContext"
import {Link} from "react-router-dom"

export default function ForgotPassword() {
  const emailRef = useRef<HTMLInputElement>(null)
  const {resetPassword} = useAuthContext()
  const [error, setError] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)
  const [message, setMessage] = useState<string | null>("")

  async function handleSubmit(e: FormEvent) {
    e.preventDefault()

    try {
      setMessage("")
      setLoading(true)
      setError("")
      await resetPassword(emailRef.current!.value)
      setMessage("Check your inbox for further instractions")
    } catch (error) {
      setError("Failed to reset password")
    }

    setLoading(false)
  }

  return (
    <>
      <Card>
        <Card.Body>
          <h2 className="text-center mb-4">Password Reset</h2>
          {error && <Alert variant="danger">Error {error}</Alert>}
          {message && <Alert variant="info"> {message}</Alert>}
          <Form onSubmit={handleSubmit}>
            <Form.Group id="email">
              <Form.Label>Email</Form.Label>
              <Form.Control type="email" ref={emailRef} required />
            </Form.Group>
            <Form.Group id="password"></Form.Group>
            <Button disabled={loading} className="w-100" type="submit">
              Reset Password
            </Button>
          </Form>
          <div className="w-100 text-center mt-2">
            <Link to="/login">Login</Link>
          </div>
        </Card.Body>
      </Card>
      <div className="w-100 text-center mt-2">
        Need an account? <Link to="/signup">Sign Up</Link>
      </div>
    </>
  )
}
