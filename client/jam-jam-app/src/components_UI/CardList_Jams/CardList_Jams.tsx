import React, {useState} from "react"
import {Navigate} from "react-router-dom"
import Card from "react-bootstrap/Card"
import ListGroup from "react-bootstrap/ListGroup"
import "bootstrap/dist/css/bootstrap.min.css"
import Button from "react-bootstrap/Button"
import "./CardList_Jams.css"
import {Col, Row} from "react-bootstrap"
import {useSelector} from "react-redux"
import {RootState} from "../../redux/store"
import dataAxios from "../../server/data.axios"

import {useNavigate} from "react-router-dom"

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
  updateListCB: Function
}

const JamsCardList: React.FC<JamsCardListProps> = ({
  jams,
  cardListType,
  updateListCB,
}) => {
  const [selectedUserId, setSelectedUserId] = useState<string | null>(null)

  const userId = useSelector(
    (state: RootState) => state.userDataMongoDB.allUserData?._id
  )

  const handleCardClick = (currentJammerId: string) => {
    setSelectedUserId(currentJammerId)
  }

  const formatDateString = (dateString: string) => {
    const date = new Date(dateString)
    return (
      date.toLocaleDateString() +
      " " +
      date.toLocaleTimeString([], {
        hour: "2-digit",
        minute: "2-digit",
        hour12: false,
      })
    )
  }
  // const date = new Date(jam.jamDate)
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

  const handleConfirmRequest = async (
    currentJammerId: string,
    jemmerUsername: string
  ) => {
    try {
      if (userId) {
        const data = await dataAxios.getAllFriendRequestsByReceiverId(userId)

        console.log(data.friendRequests)

        const friendRequest = data.friendRequests.filter(
          (request: any) => request.senderId._id === currentJammerId
        )

        const response = await dataAxios.respondToFriendRequest(
          friendRequest,
          "approved"
        )
        console.log(response)
        if (response.status === 200) {
          console.log(`new friend ${jemmerUsername} confirmed succesful`)
        }
        updateListCB()
      }
    } catch (error) {
      console.error("Error confirming friend request :", error)
    }
  }
  const handleRejectRequest = async (
    currentJammerId: string,
    jemmerUsername: string
  ) => {
    try {
      if (userId) {
        const data = await dataAxios.getAllFriendRequestsByReceiverId(userId)

        const friendRequest = data.friendRequests.filter(
          (request: any) => request.senderId._id === currentJammerId
        )

        const response = await dataAxios.respondToFriendRequest(
          friendRequest,
          "rejected"
        )
        if (response.status === 200) {
          console.log(`new friend ${jemmerUsername} rejected succesful`)
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
        {jams.map((jam) => (
          <div key={jam._id} className="col mb-4">
            <Card
              onClick={() => handleCardClick(jam._id)}
              className={`custom-card ${
                selectedUserId === jam._id ? "custom-selected" : ""
              }`}>
              {jam.img ? (
                <Card.Img
                  src={jam.img}
                  style={{
                    width: "100%",
                    objectFit: "cover",
                  }}
                  alt={`Profile image of ${jam.jamName}`}
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
                  {jam.jamName || "- "}
                </Card.Title>
                <Card.Subtitle
                  className="mb-2 text-muted"
                  style={{
                    whiteSpace: "nowrap",
                    overflow: "hidden",
                    textOverflow: "ellipsis",
                  }}>{`${(jam.city && jam.city + ",") || " "} ${
                  jam.country || " "
                }`}</Card.Subtitle>
                <Card.Subtitle
                  className="mb-2 text-muted"
                  style={{
                    whiteSpace: "nowrap",
                    overflow: "hidden",
                    textOverflow: "ellipsis",
                  }}>
                  {formatDateString(jam.jamDate)}
                </Card.Subtitle>
                <ListGroup>
                  <div
                    style={{
                      whiteSpace: "nowrap",
                      overflow: "hidden",
                      textOverflow: "ellipsis",
                    }}>
                    {jam.type}
                  </div>
                  <div
                    style={{
                      whiteSpace: "nowrap",
                      overflow: "hidden",
                      textOverflow: "ellipsis",
                    }}>
                    {jam.jammers
                      .map((jammer: any) => jammer.instrument.instrument)
                      .join(", ") || "- "}
                  </div>
                  <div
                    style={{
                      whiteSpace: "nowrap",
                      overflow: "hidden",
                      textOverflow: "ellipsis",
                    }}>
                    {jam.genres.map((genres: any) => genres.genre).join(", ") ||
                      "- "}
                  </div>
                  {/* {cardListType === "Explore Jams" && <p></p>} */}
                  <div>
                    Creator: <a>{jam?.hostedBy?.userName || " "}</a>
                  </div>
                </ListGroup>

                {cardListType === "Friend Requests" && (
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
                            handleConfirmRequest(jam._id, jam.jamName)
                          }}>
                          Confirm
                        </Button>
                      </Col>
                      <Col md={6} sm={12} xs={12}>
                        <Button
                          style={{
                            borderColor: "#BCBCBC",
                            width: "100%",
                            marginTop: "10px",
                          }}
                          size="sm"
                          variant="outline-dark"
                          className="reject-button"
                          onClick={(e) => {
                            e.stopPropagation()
                            handleRejectRequest(jam._id, jam.jamName)
                          }}>
                          Reject
                        </Button>
                      </Col>
                    </Row>
                  </div>
                )}
                {cardListType === "My Friends" && (
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
                            handleUnfriend(jam._id, jam.jamName)
                          }}>
                          Unfriend
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
                            handleCardClick(jam._id)
                          }}>
                          invite to jam
                        </Button>
                      </Col>
                    </Row>
                  </div>
                )}
              </Card.Body>
            </Card>
          </div>
        ))}
      </div>
      {selectedUserId && (
        <Navigate to={`/jamerCard/${selectedUserId}`} replace={true} />
      )}
    </>
  )
}

export default JamsCardList
