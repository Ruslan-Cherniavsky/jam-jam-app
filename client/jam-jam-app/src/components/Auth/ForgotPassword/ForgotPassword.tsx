import React, {FormEvent, useRef, useState} from "react"
import {Form, Button, Card, Alert, Col, Container, Row} from "react-bootstrap"
import {useAuthContext} from "../../../context/AuthContext"
import {Link} from "react-router-dom"
import Intro from "../Intro/Intro"

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
                    <h2 className="text-center mb-4">Password Reset</h2>
                    {error && <Alert variant="danger">Error {error}</Alert>}
                    {message && <Alert variant="info"> {message}</Alert>}
                    <Form onSubmit={handleSubmit}>
                      <Form.Group id="email">
                        <Form.Label>Email</Form.Label>
                        <Form.Control type="email" ref={emailRef} required />
                      </Form.Group>
                      <Form.Group id="password"></Form.Group>
                      <Button
                        variant="outline-dark"
                        disabled={loading}
                        className="w-100 mt-3"
                        type="submit">
                        Reset Password
                      </Button>
                    </Form>
                    <div className="w-100 text-center mt-2">
                      <Link to="/login">Login</Link>
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
