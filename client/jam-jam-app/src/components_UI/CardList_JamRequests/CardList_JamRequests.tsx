import React, {useEffect, useState} from "react"
import {Navigate} from "react-router-dom"
import Card from "react-bootstrap/Card"
import ListGroup from "react-bootstrap/ListGroup"
import "bootstrap/dist/css/bootstrap.min.css"
import Button from "react-bootstrap/Button"
import "./CardList_JamRequests.css"
import {Col, Row} from "react-bootstrap"
import {useSelector} from "react-redux"
import {RootState} from "../../redux/store"
import dataAxios from "../../server/data.axios"
import {formatDateString} from "../../helpers/formatDateString"

import {useNavigate} from "react-router-dom"

interface JamRequest {
  _id: string
  jamId: {
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
    sharedInstruments: string[]
    jammers: {
      instrument: string
      maxNumberOfJammers: number
      jammersId: string[]
      _id: string
    }[]
    audience: string[]
    reports: any[] // adjust this type as needed
    createdAt: string
    __v: number
    ifCanceled: boolean
    jamTime: number
    status: string
  }
  instrumentId: {
    _id: string
    instrument: string
    __v: number
  }
  senderId: {
    _id: string
    userName: string
  }
  receiverId: {
    _id: string
    userName: string
  }
  status: string
  __v: number
}

export interface Jam {
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
    jammersId: string[]
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

interface JamsCardListProps {
  jams: Jam[]
  cardListType: string
  jamInvites: JamRequest[]
  updateListCB: Function
}

const JamsInvitesCardList: React.FC<JamsCardListProps> = ({
  jams,
  cardListType,
  jamInvites,
  updateListCB,
}) => {
  const [selectedJamId, setSelectedJamId] = useState<string | null>(null)

  const userId = useSelector(
    (state: RootState) => state.userDataMongoDB.allUserData?._id
  )

  const handleCardClick = (currentJamId: string) => {
    setSelectedJamId(currentJamId)
  }

  const navigate = useNavigate()

  const handleUnfriend = async (
    currentJammerId: string,
    jemmerUsername: string
  ) => {
    if (userId && currentJammerId) {
      const response = await dataAxios.deleteFriend(userId, currentJammerId)

      if (response.status === 200) {
        console.log(`new friend ${jemmerUsername} confirmed succesful`)
      }
      updateListCB()
    }
  }

  const handleAcceptJamRequest = async (requestId: string) => {
    try {
      if (userId) {
        // const data = await dataAxios.getAllFriendRequestsByReceiverId(userId)

        const response = await dataAxios.respondToJamRequest(
          requestId,
          "approved"
        )
        console.log(response)
        if (response.status === 200) {
          console.log(`new jam role confirmed succesful`)
        }
        updateListCB()
      }
    } catch (error) {
      console.error("Error confirming friend request :", error)
    }
  }

  const handleRejectJamRequest = async (requestId: string) => {
    try {
      if (userId) {
        // const data = await dataAxios.getAllFriendRequestsByReceiverId(userId)

        const response = await dataAxios.respondToJamRequest(
          requestId,
          "rejected"
        )
        console.log(response)
        if (response.status === 200) {
          console.log(`a current jam role rejected succesful`)
        }
        updateListCB()
      }
    } catch (error) {
      console.error("Error confirming friend request :", error)
    }
  }

  return (
    <>
      <div className="row row-cols-2 row-cols-md-2 row-cols-lg-3 row-cols-xl-4">
        {jamInvites.map((jamInvite) => (
          <div key={jamInvite._id} className="col mb-4">
            <Card
              onClick={() => handleCardClick(jamInvite.jamId._id)}
              className={`custom-card ${
                selectedJamId === jamInvite.jamId._id ? "custom-selected" : ""
              }`}>
              {jamInvite.jamId.img ? (
                <Card.Img
                  src={jamInvite.jamId.img}
                  style={{
                    width: "100%",
                    objectFit: "cover",
                  }}
                  alt={`Profile image of ${jamInvite.jamId.jamName}`}
                />
              ) : (
                <div
                  className="d-flex align-items-center justify-content-center"
                  style={{height: "150px"}}>
                  <span>No Image</span>
                </div>
              )}

              <Card.Body className=" text-center">
                <Card.Title
                  style={{
                    whiteSpace: "nowrap",
                    overflow: "hidden",
                    textOverflow: "ellipsis",
                  }}>
                  {jamInvite.jamId.jamName || "- "}
                </Card.Title>
                <Card.Subtitle
                  className="mb-2 text-muted"
                  style={{
                    whiteSpace: "nowrap",
                    overflow: "hidden",
                    textOverflow: "ellipsis",
                  }}>{`${
                  (jamInvite.jamId.city && jamInvite.jamId.city + ",") || " "
                } ${jamInvite.jamId.country || " "}`}</Card.Subtitle>

                <Card.Subtitle
                  className="mb-2 text-muted"
                  style={{
                    whiteSpace: "nowrap",
                    overflow: "hidden",
                    textOverflow: "ellipsis",
                  }}>
                  {formatDateString(jamInvite.jamId.jamDate)}
                </Card.Subtitle>

                <ListGroup>
                  {/* <div
                    style={{
                      whiteSpace: "nowrap",
                      overflow: "hidden",
                      textOverflow: "ellipsis",
                    }}>
                    {jamInvite.jamId.type}
                  </div> */}
                  <div
                    style={{
                      whiteSpace: "nowrap",
                      overflow: "hidden",
                      textOverflow: "ellipsis",
                    }}>
                    {jamInvite.jamId.genres
                      .map((genres: any) => genres.genre)
                      .join(", ") || "- "}
                  </div>
                  {/* {cardListType === "Explore Jams" && <p></p>} */}
                  <div>
                    You invited by{" "}
                    <a style={{color: "green"}}>
                      {jamInvite.jamId?.hostedBy?.userName || " "}
                    </a>{" "}
                    to:
                  </div>
                  <div
                    style={{
                      whiteSpace: "nowrap",
                      overflow: "hidden",
                      textOverflow: "ellipsis",
                    }}>
                    <p style={{color: "purple"}}>
                      {jamInvite.instrumentId.instrument} player role.
                    </p>
                  </div>
                </ListGroup>
                <div className="friendRequestsCont">
                  <Row>
                    <Col md={6} sm={12} xs={12}>
                      <Button
                        size="sm"
                        style={{
                          borderColor: "#BCBCBC",
                          width: "100%",
                          marginTop: "10px",
                        }}
                        variant="outline-dark"
                        className="confirm-button"
                        onClick={(e) => {
                          e.stopPropagation()
                          handleAcceptJamRequest(jamInvite._id)
                        }}>
                        Accept
                      </Button>
                    </Col>
                    <Col md={6} sm={12} xs={12}>
                      <Button
                        size="sm"
                        style={{
                          borderColor: "#BCBCBC",
                          width: "100%",
                          marginTop: "10px",
                        }}
                        variant="outline-dark"
                        className="confirm-button"
                        onClick={(e) => {
                          e.stopPropagation()
                          handleRejectJamRequest(jamInvite._id)
                        }}>
                        Reject
                      </Button>
                    </Col>
                  </Row>
                </div>
              </Card.Body>
            </Card>
          </div>
        ))}
      </div>
      {selectedJamId && (
        <Navigate to={`/jamCard/${selectedJamId}`} replace={true} />
      )}
    </>
  )
}

export default JamsInvitesCardList
