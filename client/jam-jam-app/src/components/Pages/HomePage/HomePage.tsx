// HomePage.jsx

import React from "react"
import {Link} from "react-router-dom"
import {Container, Row, Col, Button} from "react-bootstrap"
import "./HomePage.css"
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome"
import {
  faInstagram,
  faFacebook,
  faGithub,
  faLinkedin,
  faPatreon,
} from "@fortawesome/free-brands-svg-icons"

import {faEnvelope} from "@fortawesome/free-solid-svg-icons"

const HomePage = () => {
  return (
    <div className="container mt-4">
      <Container fluid className="home-container">
        <Row>
          <Col md={12} lg={12} className="home-section">
            <div className="home-content-2">
              <Row>
                <Col xs={0} md={0} lg={2} xl={2}></Col>

                <Col xs={12} md={12} lg={8} xl={8} className="text-center">
                  <img
                    src="https://firebasestorage.googleapis.com/v0/b/jam-jam-development.appspot.com/o/images%2Fw2.png?alt=media&token=9ff95fb8-d1ca-4160-9287-2c626cf05046"
                    alt=""
                  />
                  <br></br>
                  <br></br>

                  <p>
                    Introducing Jam-Jam – your ultimate destination for musical
                    collaboration and vibrant live jam sessions. This innovative
                    app is designed with two main functions, both geared towards
                    connecting musicians worldwide and fostering an atmosphere
                    of creativity and camaraderie.
                  </p>
                  <br></br>
                </Col>
                <Col xs={0} md={0} lg={2} xl={2}></Col>

                <Col md={12} lg={12} className="home-section">
                  <img
                    className="homeImages rounded"
                    src="https://firebasestorage.googleapis.com/v0/b/jam-jam-development.appspot.com/o/images%2FOIG3888666666.png?alt=media&token=8ae50f56-55fe-45e1-995a-ba42aff2e81d"
                    alt=""
                  />
                </Col>
              </Row>
            </div>
          </Col>

          <Col xs={12} lg={6} className="home-section">
            <div className="home-content">
              {/* <img alt="Jammers" className="section-image" /> */}
              <h2>Jammers</h2>
              <p>Your go-to platform for music collaboration</p>
              <Link to="/jammersList">
                <Button variant="outline-dark">Explore Jammers</Button>
              </Link>
            </div>
          </Col>

          {/* Jam Events Section */}

          <Col xs={12} lg={6} className="home-section">
            <div className="home-content">
              {/* <img alt="Jam Events" className="section-image" /> */}
              <h2>Jam Events</h2>
              <p>Join and create memorable musical experiences</p>
              <Link to="/jam-events">
                <Button variant="outline-dark">Explore Jam Events</Button>
              </Link>
            </div>
          </Col>

          {/* Discover and Collaborate Section */}
        </Row>

        {/* <div className="home-content-2"> */}

        <Row className="home-section">
          <div className="home-content-2">
            <Row>
              <Col md={5} lg={5} className="home-section">
                <img
                  className="homeImages rounded"
                  src="https://firebasestorage.googleapis.com/v0/b/jam-jam-development.appspot.com/o/images%2FOIG3.FsYMOE.UYxcE8y---3.jpg?alt=media&token=47fd9469-c9a4-44e4-a9a9-8ee3c70b3483"
                  alt=""
                />
              </Col>
              <Col xs={7} lg={7}>
                <br></br>
                <br></br>
                <br></br>
                <br></br>
                <br></br>
                <h4 className="text-center">Create and Join Jam Events</h4>
                <br></br>

                <ul>
                  <br></br>

                  <li>
                    Host your own jam events and invite musicians from around
                    the world to join.
                  </li>
                  <br></br>

                  <li>
                    Customize jam events based on genre, instruments, location,
                    time, and more.
                  </li>
                  <br></br>

                  <li>
                    Advanced search functionalities allow you to find the right
                    musicians for your event.
                  </li>
                  <br></br>

                  <li>
                    Define the jam type, set the number of participants, and
                    curate an unforgettable live james.
                  </li>
                </ul>
              </Col>
            </Row>
          </div>
        </Row>

        <Row className="home-section">
          <div className="home-content-2">
            <Row>
              <Col xs={7} lg={7}>
                <br></br>
                <br></br>
                <br></br>
                <br></br>
                <br></br>

                <h4 className="text-center">
                  Discover and Collaborate Worldwide
                </h4>
                <br></br>
                <br></br>
                <ul>
                  <li>
                    Search for musicians globally based on genre, instruments,
                    and location.
                  </li>
                  <br></br>

                  <li>
                    Utilize advanced search filters to find the perfect
                    collaborators for your musical endeavors.
                  </li>
                  <br></br>

                  <li>
                    Invite musicians to engage in real-time live jam sessions.
                  </li>
                  <br></br>

                  <li>
                    Connect with like-minded artists, create beautiful music,
                    and establish lasting friendships.
                  </li>
                </ul>
              </Col>
              <Col md={5} lg={5} className="home-section">
                <img
                  className="homeImages rounded"
                  src="https://firebasestorage.googleapis.com/v0/b/jam-jam-development.appspot.com/o/images%2FOIG4.w8FvX2.png?alt=media&token=b85c6463-b594-40f5-8b68-4da027d50e65"
                  alt=""
                />
              </Col>
            </Row>
          </div>
        </Row>
        {/* </div> */}

        <Row className="home-section">
          <div className="home-content-2">
            <Row>
              <Col md={5} lg={5} className="home-section">
                <img
                  className="homeImages rounded"
                  src="https://firebasestorage.googleapis.com/v0/b/jam-jam-development.appspot.com/o/images%2FOIG2888679.png?alt=media&token=97855e14-9034-4a12-b15e-325d8b42603e"
                  alt=""
                />
              </Col>
              <Col xs={7} lg={7}>
                <br></br>
                <br></br>
                <br></br>
                <br></br>
                <br></br>
                <h4 className="text-center">
                  Advanced Search for Jammers and Jam Sessions
                </h4>
                <br></br>
                <ul>
                  <li>
                    Filter musicians by genre, instruments, and location to
                    pinpoint your ideal collaborators.
                  </li>
                  <br></br>

                  <li>
                    Specify jam preferences, including required instruments, jam
                    type, and preferred number of participants.
                  </li>
                  <br></br>
                  <li>
                    Search for events based on genre, instruments, location, and
                    time availability.
                  </li>
                  <br></br>
                  <li>
                    Explore events tailored to your preferences, such as
                    specific jam types, required instruments, and the number of
                    jammers desired.
                  </li>
                </ul>
              </Col>
            </Row>
          </div>
        </Row>

        <Row className="home-section">
          <div className="home-content-2">
            <Row>
              <Col xs={0} md={0} lg={2} xl={2}></Col>

              <Col xs={12} md={12} lg={8} xl={8} className="text-center">
                <br></br>

                <h2>Join the Community</h2>
                <br></br>

                <p>
                  Jam-Jam is not just an app, it's a vibrant community where
                  musicians come together to create magic. Whether you're a
                  seasoned artist or just starting your musical journey, Jam-Jam
                  provides a platform to connect, collaborate, and experience
                  the joy of live jam sessions. Break free from the limitations
                  of online interaction and immerse yourself in the excitement
                  of making music with new friends.
                </p>
                <br></br>
                <br></br>
              </Col>
            </Row>
            <Col md={12} lg={12}>
              <img
                className="homeImages rounded"
                src="https://firebasestorage.googleapis.com/v0/b/jam-jam-development.appspot.com/o/images%2FOIG490888.png?alt=media&token=aed7d14c-2d5d-4664-83a3-804660889f8e"
                alt=""
              />
            </Col>
          </div>
        </Row>

        <Row>
          {/* <Col xs={0} md={0} lg={2} xl={3}></Col> */}

          <Col xs={12} md={12} lg={12} xl={12} className="home-section ">
            <div className="home-content-5">
              {/* <h3>Contact</h3> */}
              {/* <a
                href="https://www.instagram.com/your_instagram_handle"
                target="_blank"
                rel="noopener noreferrer">
                <FontAwesomeIcon
                  size="3x"
                  className="mr-2"
                  style={{color: "#BCBCBC", margin: "15px"}}
                  icon={faInstagram}
                />
              </a>
              <a
                href="https://www.instagram.com/your_instagram_handle"
                target="_blank"
                rel="noopener noreferrer">
                <FontAwesomeIcon
                  size="3x"
                  className="mr-2"
                  style={{color: "#BCBCBC", margin: "15px"}}
                  icon={faFacebook}
                />
              </a> */}
              <a href="nalsurion@gmail.com">
                <FontAwesomeIcon
                  size="3x"
                  className="mr-2"
                  style={{color: "#BCBCBC", margin: "15px"}}
                  icon={faEnvelope}
                />
              </a>
              <a
                href="https://www.instagram.com/your_instagram_handle"
                target="_blank"
                rel="noopener noreferrer">
                <FontAwesomeIcon
                  size="3x"
                  className="mr-2"
                  style={{color: "#BCBCBC", margin: "15px"}}
                  icon={faGithub}
                />
              </a>
              <a
                href="https://www.instagram.com/your_instagram_handle"
                target="_blank"
                rel="noopener noreferrer">
                <FontAwesomeIcon
                  size="3x"
                  className="mr-2"
                  style={{color: "#BCBCBC", margin: "15px"}}
                  icon={faLinkedin}
                />
              </a>
              <a href="nalsurion@gmail.com">
                <FontAwesomeIcon
                  size="3x"
                  className="mr-2"
                  style={{color: "#BCBCBC", margin: "15px"}}
                  icon={faPatreon}
                />
              </a>
              <p>&copy; 2024 Ruslan Cherniavsky. All Rights Reserved.</p>
            </div>
          </Col>
          {/* <Col xs={0} md={0} lg={2} xl={3}></Col> */}
        </Row>
      </Container>
    </div>
  )
}

export default HomePage
