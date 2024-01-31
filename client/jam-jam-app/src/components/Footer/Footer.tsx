import React from "react"
import {Container, Row, Col} from "react-bootstrap"

const Footer = () => {
  return (
    <footer className="mt-5">
      <Container>
        <Row>
          <Col md={4}>
            <h5>Quick Links</h5>
            <ul>
              <li>
                <a href="/">Home</a>
              </li>
              <li>
                <a href="/about">About Us</a>
              </li>
              <li>
                <a href="/contact">Contact</a>
              </li>
            </ul>
          </Col>
          <Col md={4}>
            <h5>Follow Us</h5>
            <ul>
              <li>
                <a href="https://twitter.com">Twitter</a>
              </li>
              <li>
                <a href="https://facebook.com">Facebook</a>
              </li>
              <li>
                <a href="https://instagram.com">Instagram</a>
              </li>
            </ul>
          </Col>
          <Col md={4}>
            <h5>Contact Info</h5>
            <p>Email: info@example.com</p>
            <p>Phone: +123 456 7890</p>
          </Col>
        </Row>
      </Container>
      <div className="text-center p-3 bg-dark text-light">
        © {new Date().getFullYear()} Your Website Name. All rights reserved.
      </div>
    </footer>
  )
}

export default Footer
