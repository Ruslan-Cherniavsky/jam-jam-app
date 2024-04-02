import React, {useEffect, useRef, useState, FormEvent} from "react"
import {Form, Button, Card, Alert} from "react-bootstrap"
import {Link, useNavigate} from "react-router-dom"
import {useAuthContext} from "../../../context/AuthContext"

interface UpdateProfileProps {}

export default function UpdateProfileFirebase(
  props: UpdateProfileProps
): JSX.Element {
  const navigate = useNavigate()
  const currentPasswordRef = useRef<HTMLInputElement>(null)
  const newPasswordRef = useRef<HTMLInputElement>(null)
  const newPasswordConfirmRef = useRef<HTMLInputElement>(null)
  const {
    currentUser,
    updateCurrentPassword,
    reauthenticateCurrentWithCredential,
  } = useAuthContext()
  const [error, setError] = useState<string | null>(null)
  const [loading, setLoading] = useState<boolean>(false)
  const [ifGoogleUser, setifGoogleUser] = useState<boolean>(false)

  useEffect(() => {
    if (
      currentUser &&
      currentUser.providerData[0].providerId === "google.com"
    ) {
      setifGoogleUser(true)
    } else {
      setifGoogleUser(false)
    }
  }, [currentUser])

  async function handleSubmit(e: FormEvent) {
    e.preventDefault()

    if (
      newPasswordRef.current!.value !== newPasswordConfirmRef.current!.value
    ) {
      return setError("Passwords must match")
    }

    try {
      setError("")
      setLoading(true)

      await reauthenticateCurrentWithCredential(
        currentPasswordRef.current!.value
      )

      await updateCurrentPassword(newPasswordRef.current!.value)

      navigate("/")
    } catch (error: any) {
      if (error.code === "auth/invalid-credential") {
        setError("Current password is incorrect")
      } else {
        setError("Failed to update account. Please try again.")
      }
    } finally {
      setLoading(false)
    }
  }

  return (
    <>
      <Card>
        <Card.Body>
          <h2 className="text-center mb-4">Update Profile</h2>

          {error && <Alert variant="danger">Error {error}</Alert>}

          {!ifGoogleUser ? (
            <div>
              <h6 className="text-center mb-2">Update Password</h6>

              <Form onSubmit={handleSubmit}>
                <Form.Group id="current-password">
                  <Form.Label>Current Password</Form.Label>
                  <Form.Control
                    type="password"
                    ref={currentPasswordRef}
                    required
                  />
                </Form.Group>
                <Form.Group id="password">
                  <Form.Label>New Password</Form.Label>
                  <Form.Control type="password" ref={newPasswordRef} required />
                </Form.Group>
                <Form.Group id="password-confirm">
                  <Form.Label>New Password Confirmation</Form.Label>
                  <Form.Control
                    type="password"
                    ref={newPasswordConfirmRef}
                    required
                  />
                </Form.Group>
                <Button disabled={loading} className="w-100" type="submit">
                  {loading ? "Updating..." : "Update"}
                </Button>
              </Form>
            </div>
          ) : null}
        </Card.Body>
      </Card>
      <div className="w-100 text-center mt-2">
        Cancel <Link to="/">Log in</Link>
      </div>
    </>
  )
}
