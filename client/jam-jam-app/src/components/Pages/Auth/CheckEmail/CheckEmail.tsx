import {useEffect, useState} from "react"
import {Card, Alert, Button} from "react-bootstrap"
import {Link, useNavigate} from "react-router-dom"
import {useAuthContext} from "../../../../context/AuthContext"

export default function CheckEmail() {
  const {sendCurrentEmailVerification, currentUser} = useAuthContext()
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [message, setMessage] = useState<string | null>(null)
  const navigate = useNavigate()

  useEffect(() => {
    if (currentUser?.emailVerified) {
      return navigate("/")
    }
    if (!currentUser) {
      return navigate("/login")
    }
  }, [])

  async function handleResendVerification() {
    try {
      setLoading(true)
      setError("")
      setMessage("")
      if (currentUser) {
        console.log(currentUser)
        await sendCurrentEmailVerification()
        setMessage("Verification email sent successfully.")
      } else {
        setError("User not logged in.")
      }
    } catch (error: any) {
      if (error.code === "auth/too-many-requests") {
        setError("Too many requests. Please try again later.")
      } else {
        setError("Error sending verification email: ")
      }
    } finally {
      setLoading(false)
    }
  }

  return (
    <>
      <div className="authContainer ">
        <div className="authDiv w-100">
          <Card>
            <Card.Body>
              <h3 className="text-center mb-3">Check your email</h3>
              {error ? <Alert variant="danger">{error}</Alert> : null}

              {!error || message ? (
                <Alert variant="info">
                  We've sent a verification link to your email address. Please
                  check your email and click on the link to verify your account.
                </Alert>
              ) : null}

              <div className="w-100 text-center mt-2">
                Didn't receive the email?{" "}
              </div>

              <Button
                variant="outline-dark"
                disabled={loading}
                className="w-100 mt-3"
                onClick={handleResendVerification}>
                Resend Verification Email
              </Button>
              <div className="w-100 text-center mt-2">
                Your email has been verified? Try to{" "}
                <Link to="/login">Log in</Link> again
              </div>
            </Card.Body>
          </Card>
        </div>
      </div>
    </>
  )
}
