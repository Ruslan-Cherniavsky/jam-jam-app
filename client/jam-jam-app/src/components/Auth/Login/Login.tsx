import {useRef, useState, FormEvent, useEffect} from "react"
import {Form, Button, Card, Alert, Container, Row, Col} from "react-bootstrap"
import {useAuthContext} from "../../../context/AuthContext"
import {Link, useNavigate} from "react-router-dom"
import "../Auth.css"
import Intro from "../Intro/Intro"

export default function Login() {
  const navigate = useNavigate()
  const emailRef = useRef<HTMLInputElement>(null)
  const passwordRef = useRef<HTMLInputElement>(null)
  const {login, logout, signInWithGoogle, currentUser} = useAuthContext()
  const [error, setError] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    if (currentUser?.emailVerified) {
      return navigate("/")
    }
  }, [])

  async function handleSubmit(e: FormEvent) {
    e.preventDefault()

    try {
      setLoading(true)
      setError("")

      if (currentUser) {
        logout()
      }

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
      {/* <div className="authContainer ">
      <div className="authDiv w-100"> */}

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
                    <h3 className="text-center mb-3">Log In</h3>
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
                      <Button
                        variant="outline-dark"
                        disabled={loading}
                        className="w-100 mt-3"
                        type="submit">
                        {loading ? "Logging In..." : "Log In"}
                      </Button>
                      <Button
                        variant="outline-dark"
                        onClick={handleGoogleLogin}
                        disabled={loading}
                        className="w-100 mt-3">
                        {loading
                          ? "Logging In with Google..."
                          : "Log In with Google"}
                      </Button>
                    </Form>
                    <div className="w-100 text-center mt-2">
                      Forgot password?{" "}
                      <Link to="/forgot-password">Password reset</Link>
                    </div>
                    <div className="w-100 text-center mt-2">
                      Need an account? <Link to="/signup">Sign Up</Link>
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
