import {Form, Button, Card, Alert, Container} from "react-bootstrap"
import React from "react"

export default function Intro() {
  return (
    <>
      <Container
        style={{marginBottom: "2px", marginTop: "22px", textAlign: "center"}}>
        {/* <Card>
          <Card.Body style={{textAlign: "center"}}> */}
        {/* <h2 className="text-center mb-4">hay hay</h2> */}
        {/* <h5>Welcome to </h5> */}
        {/* <p>
          Jam-Jam is a social networking app for musicians seeking jam sessions.
          It enables users to create jam session events, invite relevant
          musicians, collaborate, make new connections, and create beautiful
          live jams worldwide.
        </p> */}
        {/* </Card.Body>
        </Card> */}

        <img
          style={{width: "120px"}}
          src="https://firebasestorage.googleapis.com/v0/b/jam-jam-development.appspot.com/o/images%2Fw2.png?alt=media&token=9ff95fb8-d1ca-4160-9287-2c626cf05046"
          alt=""
        />
      </Container>
    </>
  )
}
