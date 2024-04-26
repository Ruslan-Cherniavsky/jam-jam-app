import React, {useState} from "react"
import {Navigate} from "react-router-dom"
import Card from "react-bootstrap/Card"
import ListGroup from "react-bootstrap/ListGroup"
import "bootstrap/dist/css/bootstrap.min.css"
import Button from "react-bootstrap/Button"
import "./CardList_Jammers_JamRequests.css"
import {Col, Row} from "react-bootstrap"
import {useSelector} from "react-redux"
import {RootState} from "../../redux/store"
import dataAxios from "../../server/data.axios"

interface Jammer {
  _id: string
  userName: string
  city: string
  country: string
  instruments: Object[]
  genres: Object[]
  img?: string
}

type JamRequest = {
  _id: string
  jamId: {
    _id: string
    jamName: string
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
    email: string
    userName: string
    firstName: string
    lastName: string
    country: string
    city: string
    age: number
    gender: string
    genres: string[]
    instruments: string[]
    friends: any[] // You may need to define the type for friends array
    img: string
    oboutMe: string
    links: string[]
    dob: Date
    role: string
    reports: any[] // You may need to define the type for reports array
    createdAt: Date
    __v: number
  }
  status: string
  __v: number
}

interface JammersCardListProps {
  jammers: Jammer[]
  cardListType: string
  updateListCB: Function
  jamRequests: JamRequest[]
}

const JammersRequestsCardList: React.FC<JammersCardListProps> = ({
  jammers,
  cardListType,
  updateListCB,
  jamRequests,
}) => {
  const [selectedUserId, setSelectedUserId] = useState<string | null>(null)

  const userId = useSelector(
    (state: RootState) => state.userDataMongoDB.allUserData?._id
  )
  // const userId = useSelector(
  //   (state: RootState) => state.userDataMongoDB.allUserData?._id
  // )

  const handleCardClick = (currentJammerId: string) => {
    setSelectedUserId(currentJammerId)
  }

  const handleUnfriend = async (
    currentJammerId: string,
    jemmerUsername: string
  ) => {
    // setSelectedUserId(currentJammerId)
    if (userId && currentJammerId) {
      const response = await dataAxios.deleteFriend(userId, currentJammerId)
      // console.log(response)

      // console.log(response)
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
        {jamRequests.map((jamRequest) => (
          <div key={jamRequest._id} className="col mb-4">
            <Card
              onClick={() => handleCardClick(jamRequest.receiverId._id)}
              className={`custom-card ${
                selectedUserId === jamRequest.receiverId._id
                  ? "custom-selected"
                  : ""
              }`}>
              {jamRequest.receiverId.img ? (
                <Card.Img
                  src={jamRequest.receiverId.img}
                  style={{
                    width: "100%",
                    objectFit: "cover",
                  }}
                  alt={`Profile image of ${jamRequest.receiverId.userName}`}
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
                  {jamRequest.receiverId.userName || "- "}
                </Card.Title>
                <Card.Subtitle
                  className="mb-2 text-muted"
                  style={{
                    whiteSpace: "nowrap",
                    overflow: "hidden",
                    textOverflow: "ellipsis",
                  }}>{`${
                  (jamRequest.receiverId.city &&
                    jamRequest.receiverId.city + ",") ||
                  " "
                } ${jamRequest.receiverId.country || " "}`}</Card.Subtitle>
                <ListGroup>
                  <div
                    style={{
                      whiteSpace: "nowrap",
                      overflow: "hidden",
                      textOverflow: "ellipsis",
                    }}>
                    {/* {jammer.instruments
                      .map((instruments: any) => instruments.instrument)
                      .join(", ") || "- "} */}
                    {/* {jamRequest.jamId.jamName} */}
                    <p>
                      {" "}
                      Request to join{" "}
                      <span style={{color: "green"}}>
                        {jamRequest.instrumentId.instrument}
                      </span>{" "}
                      Role
                    </p>

                    <p>
                      {" "}
                      in:{" "}
                      <span style={{color: "purple"}}>
                        {jamRequest?.jamId?.jamName}
                      </span>
                    </p>
                  </div>

                  <div
                    style={{
                      whiteSpace: "nowrap",
                      overflow: "hidden",
                      textOverflow: "ellipsis",
                    }}>
                    {/* {jamRequest.jamId.jamName} */}

                    {/* {jamRequest.receiverId.genres
                      .map((genres: any) => genres.genre)
                      .join(", ") || "- "} */}
                  </div>
                </ListGroup>

                {cardListType === "Explore Jammers" && <p></p>}

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
                            handleConfirmRequest(
                              jamRequest.receiverId._id,
                              jamRequest.receiverId.userName
                            )
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
                            handleRejectRequest(
                              jamRequest.receiverId._id,
                              jamRequest.receiverId.userName
                            )
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
                            handleUnfriend(
                              jamRequest.receiverId._id,
                              jamRequest.receiverId.userName
                            )
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
                            handleCardClick(jamRequest.receiverId._id)
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

export default JammersRequestsCardList
