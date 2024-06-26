import React, {useState} from "react"
import {Navigate} from "react-router-dom"
import Card from "react-bootstrap/Card"
import ListGroup from "react-bootstrap/ListGroup"
import "bootstrap/dist/css/bootstrap.min.css"
import Button from "react-bootstrap/Button"
import "./CardList_Jammers.css"
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

interface JammersCardListProps {
  jammers: Jammer[]
  cardListType: string
  updateListCB: Function
}

const JammersCardList: React.FC<JammersCardListProps> = ({
  jammers,
  cardListType,
  updateListCB,
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
        {jammers.map((jammer) => (
          <div key={jammer._id} className="col mb-4">
            <Card
              onClick={() => handleCardClick(jammer._id)}
              className={`custom-card ${
                selectedUserId === jammer._id ? "custom-selected" : ""
              }`}>
              {jammer.img ? (
                <Card.Img
                  src={jammer.img}
                  style={{
                    width: "100%",
                    objectFit: "cover",
                  }}
                  alt={`Profile image of ${jammer.userName}`}
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
                  {jammer.userName || "- "}
                </Card.Title>
                <Card.Subtitle
                  className="mb-2 text-muted"
                  style={{
                    whiteSpace: "nowrap",
                    overflow: "hidden",
                    textOverflow: "ellipsis",
                  }}>{`${(jammer.city && jammer.city + ",") || " "} ${
                  jammer.country || " "
                }`}</Card.Subtitle>
                <ListGroup>
                  <div
                    style={{
                      whiteSpace: "nowrap",
                      overflow: "hidden",
                      textOverflow: "ellipsis",
                    }}>
                    {jammer.instruments
                      .map((instruments: any) => instruments.instrument)
                      .join(", ") || "- "}
                  </div>
                  <div
                    style={{
                      whiteSpace: "nowrap",
                      overflow: "hidden",
                      textOverflow: "ellipsis",
                    }}>
                    {jammer.genres
                      .map((genres: any) => genres.genre)
                      .join(", ") || "- "}
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
                            handleConfirmRequest(jammer._id, jammer.userName)
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
                            handleRejectRequest(jammer._id, jammer.userName)
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
                            handleUnfriend(jammer._id, jammer.userName)
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
                            handleCardClick(jammer._id)
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

export default JammersCardList
