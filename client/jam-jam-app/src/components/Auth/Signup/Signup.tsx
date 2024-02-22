import {useRef, useState, FormEvent} from "react"
import {Form, Button, Card, Alert, Container, Row, Col} from "react-bootstrap"
import {useAuthContext} from "../../../context/AuthContext"
import {Link, useNavigate} from "react-router-dom"
import dataAxios from "../../../server/data.axios"
import Intro from "../Intro/Intro"

export default function Signup() {
  const navigate = useNavigate()
  const emailRef = useRef<HTMLInputElement>(null)
  const passwordRef = useRef<HTMLInputElement>(null)
  const passwordConfirmRef = useRef<HTMLInputElement>(null)
  const {
    signup,
    currentUser,
    logout,
    sendCurrentEmailVerification,
    signInWithGoogle,
  } = useAuthContext()
  const [error, setError] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)

  async function handleSubmit(e: FormEvent) {
    e.preventDefault()

    if (currentUser) {
      logout()
    }

    if (passwordRef.current!.value !== passwordConfirmRef.current!.value) {
      return setError("Passwords must match")
    }
    try {
      setLoading(true)
      setError("")
      await signup(emailRef.current!.value, passwordRef.current!.value)

      //TODO----clean this block
      try {
        await sendCurrentEmailVerification()
      } catch (error: any) {
        if (error.code === "auth/too-many-requests") {
          setError("Too many requests. Please try again later.")
          return
        } else {
          setError("Error sending verification email: ")
          return
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
      <Container>
        <Row>
          <Col sm={0} md={3} lg={3} xl={3} xxl={4}></Col>
          <Col style={{paddingTop: "0px"}}>
            {" "}
            {/* <h2 className="text-center">Welcome to </h2> */}
            <Intro />
          </Col>
          <Col sm={0} md={3} lg={3} xl={3} xxl={4}></Col>
        </Row>
        <Row>
          <Col className="d-none d-md-block" xs={5} sm={5} md={3} lg={4}>
            <img
              className="intro_image"
              src="https://firebasestorage.googleapis.com/v0/b/jam-jam-development.appspot.com/o/images%2Fintro-1.2.png?alt=media&token=c114f18f-a6d2-43e6-b528-bbbef1f64002"
              alt=""
            />
          </Col>
          <Col xs={2} sm={2} className="d-md-none"></Col>

          <Col sm={12} md={6} lg={4}>
            <div className="authContainer ">
              <div className="authDiv w-100">
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
                        <Form.Control
                          type="password"
                          ref={passwordRef}
                          required
                        />
                      </Form.Group>
                      <Form.Group id="password-confirm">
                        <Form.Label>Password Confirmation</Form.Label>
                        <Form.Control
                          type="password"
                          ref={passwordConfirmRef}
                          required
                        />
                      </Form.Group>
                      <Button
                        variant="outline-dark"
                        disabled={loading}
                        className="w-100 mt-3"
                        type="submit">
                        Sign up
                      </Button>
                      <Button
                        variant="outline-dark"
                        disabled={loading}
                        className="w-100 mt-3"
                        onClick={handleGoogleSignup}>
                        Sign up with Google
                      </Button>
                    </Form>
                    <div className="w-100 text-center mt-2">
                      Already have an account? <Link to="/login">Log in</Link>
                    </div>
                  </Card.Body>
                </Card>
              </div>
            </div>
          </Col>

          <Col sm={4} md={3} lg={4} className="d-none d-md-block">
            <img
              className="intro_image"
              src="https://firebasestorage.googleapis.com/v0/b/jam-jam-development.appspot.com/o/images%2Fintro-4.png?alt=media&token=5f60d38c-90fd-437b-9d26-5f3ecf1ba14a"
              alt=""
            />
          </Col>
          <Col sm={0} md={3} lg={3} xl={3} xxl={4}></Col>
          <Col
            className="d-md-none d-sm-block"
            style={{paddingTop: "80px"}}></Col>
          <Col sm={0} md={3} lg={3} xl={3} xxl={4}></Col>
          <Col className="d-md-none d-sm-block">
            <img
              className="intro_image"
              src="https://firebasestorage.googleapis.com/v0/b/jam-jam-development.appspot.com/o/images%2FOIG39999978.png?alt=media&token=721748d2-d279-471d-96d1-e5194885d8d5"
              alt=""
            />
          </Col>
        </Row>
      </Container>
    </>
  )
}
