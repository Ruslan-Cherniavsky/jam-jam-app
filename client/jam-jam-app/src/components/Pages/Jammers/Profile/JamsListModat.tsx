import React, {useEffect, useState} from "react"
import {Modal, Button, ListGroup, Row, Col, Alert} from "react-bootstrap"
import dataAxios from "../../../../server/data.axios"
import {useDispatch, useSelector} from "react-redux"
import {Navigate, useNavigate, useParams} from "react-router-dom"

import {RootState} from "../../../../redux/store"

interface Jam {
  _id: string
  img: string
  jamName: string
  hostedBy: {
    _id: string
    userName: string
  }
  jamDate: string
  country: string
  isoCode: string
  city: string
  region: string
  type: string
  entrance: string
  tune: string
  jamDescription: string
  genres: {
    _id: string
    genre: string
    __v: number
  }[]
  sharedInstruments: {
    _id: string
    instrument: string
    __v: number
  }[]
  jammers: {
    instrument: {
      _id: string
      instrument: string
      __v: number
    }
    maxNumberOfJammers: number
    jammersId: {
      _id: string
      img: string
      userName: string
    }[]
    _id: string
  }[]
  audience: {
    _id: string
    userName: string
  }[]
  reports: any[] // You might want to create a specific type for reports
  createdAt: string
  __v: number
  ifCanceled: boolean
  jamTime: number
  status: string
}

const iconColor = "#BCBCBC"
const iconSpacing = "12px"

interface JamsListModalProps {
  jammerId: string
  show: boolean
  onHide: () => void
}

const JamsListModal: React.FC<JamsListModalProps> = ({
  jammerId,
  show,
  onHide,
}) => {
  const [jams, setJams] = useState<Jam[]>([])
  const [loading, setLoading] = useState<boolean>(true)
  const [disabledOptions, setDisabledOptions] = useState<boolean>(false)
  const [selectedInstruments, setSelectedInstruments] = useState<string[]>([])
  const currentUserId = useSelector(
    (state: RootState) => state.userDataMongoDB.allUserData?._id
  )

  const [message, setMessage] = useState<string | null>(null)

  const navigate = useNavigate()

  useEffect(() => {
    const fetchJams = async () => {
      try {
        const response = await dataAxios.getAllJamsByHostedById(
          currentUserId,
          1
        )
        setJams(response.data.jams)
        setLoading(false)
      } catch (error) {
        console.error("Error fetching jams:", error)
      }
    }

    if (show) {
      fetchJams()
    }
  }, [jammerId, show, currentUserId])

  const inviteToJam = async (jamId: string, instrumentId: string) => {
    try {
      if (!currentUserId || !jamId || !instrumentId) {
        console.error("Invalid parameters.")
        return
      }

      console.log(currentUserId)

      console.log(jamId)

      const response = await dataAxios.sendJamRequest(
        currentUserId,
        jammerId,
        jamId,
        instrumentId
      )

      if (response.status === 200) {
        console.log("Invitation sent successfully.")
        setMessage("Invitation sent successfully.")

        // Optionally, update UI or provide feedback to the user
      } else {
        console.error("Failed to send invitation.")
        if (response.status === 400) {
        }
        // if (response.status === 400) {
        //   setMessage(response.data)
        // }
        // Optionally, handle error case
      }
    } catch (error: any) {
      if (error.response.status === 400) {
        console.log(error.response.data.message)
        setMessage(error.response.data.message)
      }
      console.error("Error sending invitation:", error)
      // Optionally, handle error case
    }
  }

  const handleInstrumentChange = (index: number, instrumentId: string) => {
    const updatedInstruments = [...selectedInstruments]
    updatedInstruments[index] = instrumentId
    setSelectedInstruments(updatedInstruments)
  }

  return (
    <Modal show={show} onHide={onHide}>
      <Modal.Header closeButton>
        <Modal.Title>Your Jams</Modal.Title>
      </Modal.Header>

      {message && <Alert variant="info">{message}</Alert>}

      <Modal.Body>
        {loading ? (
          <p>Loading...</p>
        ) : jams.length === 0 ? (
          <p>No jams found.</p>
        ) : (
          <ListGroup>
            {jams.map((jam, index) => (
              <ListGroup.Item key={jam._id}>
                <Row>
                  <Col xl={4}>
                    <strong
                      onClick={() => navigate(`/jamCard/${jam._id}`)}
                      style={{cursor: "pointer"}}>
                      {jam.jamName}
                    </strong>{" "}
                  </Col>
                  <Col xl={4}>
                    <select
                      style={{width: "100%"}}
                      name="Jam Roles"
                      value={selectedInstruments[index] || ""}
                      onChange={(e) =>
                        handleInstrumentChange(index, e.target.value)
                      }>
                      <option value="">Select</option>
                      {jam.jammers.map((jammer: any) => (
                        <option
                          key={jammer.instrument._id}
                          value={jammer.instrument._id}>
                          {jammer.instrument.instrument}
                        </option>
                      ))}
                    </select>
                  </Col>
                  <Col xl={4}>
                    <Button
                      variant="outline-dark"
                      size="sm"
                      style={{
                        borderColor: iconColor,
                        width: "100%",
                      }}
                      onClick={() =>
                        inviteToJam(jam._id, selectedInstruments[index])
                      }>
                      Invite
                    </Button>
                  </Col>
                </Row>
              </ListGroup.Item>
            ))}
          </ListGroup>
        )}
      </Modal.Body>
      <Modal.Footer>
        <Button variant="secondary" onClick={onHide}>
          Close
        </Button>
      </Modal.Footer>
    </Modal>
  )
}

export default JamsListModal
