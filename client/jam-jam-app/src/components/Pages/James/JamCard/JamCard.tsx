import React, {useId, useState} from "react"
import {Navigate, useParams} from "react-router-dom"

import {
  Card,
  Container,
  Row,
  Col,
  Image,
  Button,
  Modal,
  Form,
  Alert,
} from "react-bootstrap"

import SocialMediaLinks from "../../User/UpdateProfilePage/SocialMediaLinks/SocialMediaLinks"

import {
  faUserPlus,
  faMusic,
  faBackward,
  faFlag,
  faEdit,
} from "@fortawesome/free-solid-svg-icons"

import {FontAwesomeIcon} from "@fortawesome/react-fontawesome"
import {useAuthContext} from "../../../../context/AuthContext"
import {useNavigate} from "react-router-dom"
import dataAxios from "../../../../server/data.axios"
import {RootState} from "../../../../redux/store"
import {useDispatch, useSelector} from "react-redux"
import {Link} from "react-router-dom"
import Map from "./Map/MapDisplay"
import MapWithSearch from "./Map/MapWithSearch"
import MapDisplay from "./Map/MapDisplay"

import {formatDateString} from "../../../../helpers/formatDateString"

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

interface ExistingJamRequest {
  _id: string
  jamId: string
  instrumentId: string
  senderId: string
  receiverId: string
  status: string
  __v: number
}

interface ExistingJamRequestsResponse {
  existingJamRequests: ExistingJamRequest[]
}

interface JamCardListProps {
  jam: Jam
  updateCard: Function
  ifPastEvent: Boolean
}

const JamCard = ({jam, updateCard, ifPastEvent}: JamCardListProps) => {
  // const {userId} = useParams<{userId: string}>()
  const {currentUser} = useAuthContext()
  const navigate = useNavigate()
  const [reportReason, setReportReason] = useState<string>("")
  const [showReportModal, setShowReportModal] = useState<boolean>(false)
  const [message, setMessage] = useState<string | null>(null)
  const [error, setError] = useState<string | null>(null)

  const dispatch = useDispatch()

  const iconColor = "#BCBCBC"
  const iconSpacing = "12px"

  const userId = useSelector(
    (state: RootState) => state.userDataMongoDB.allUserData?._id
  )
  const currentUserName = useSelector(
    (state: RootState) => state.userDataMongoDB.allUserData?.userName
  )

  // const handleInviteToJam = () => {
  //   console.log("Inviting to jam:", jammer.userName)
  // }

  const handleEditProfileClick = () => {
    navigate("/update-profile")
  }

  const handleSetShowReportModal = () => {
    setError("")
    setShowReportModal(false)
  }

  const sendJamRequest = async (jamId: string, instrumentId: string) => {
    try {
      if (!userId) {
        setMessage("Error.")
        return
      }

      const ifJammersRequired = jam.jammers.some(
        (jammer) =>
          jammer.maxNumberOfJammers <= jammer.jammersId.length &&
          jammer.instrument._id === instrumentId
      )

      if (ifJammersRequired) {
        setMessage("Jam Roles are full.")
        return
      }

      // const isJammRequestExist = jam.jammers.some((jammer) => {
      //   jammer.jammersId.some((jammerId: any) => jammerId._id === userId)
      // })

      // if (isJammRequestExist) {
      //   setMessage("Jam request has already been sent.")
      //   return
      // }

      const params = {
        senderId: userId,
        receiverId: userId,
        jamId: jam._id,
        instrumentId: instrumentId,
      }
      const jamRequestsByUser: ExistingJamRequestsResponse =
        await dataAxios.getalljamrequestsbyids(params)

      console.log(jamRequestsByUser?.existingJamRequests)

      if (jamRequestsByUser?.existingJamRequests) {
        setMessage("Jam request has already been sent.")
        return
      }

      const ifJamRequestSentAndAprooved = jam.jammers.some((jammer) =>
        jammer.jammersId.some(
          (jammersId) =>
            jammersId._id === userId && jammer.instrument._id === instrumentId
        )
      )

      if (ifJamRequestSentAndAprooved) {
        setMessage("You are already on this role in this jam.")
        updateCard()

        return
      }

      if (userId) {
        const jamRequestresponse = await dataAxios.sendJamRequest(
          userId,
          userId,
          jamId,
          instrumentId
        )
        if (jamRequestresponse.status === 200) {
          setMessage("You have successfully sent jam request.")
          updateCard()
          return
        }
      }
    } catch (error) {
      console.error(error)
    }
  }

  const leaveJammerRole = async (jamId: string, instrumentId: string) => {
    try {
      if (!userId) {
        setMessage("Error.")
        return
      }

      const response = await dataAxios.deleteJammerFromJamByIds(
        userId,
        userId,
        jamId,
        instrumentId
      )

      if (response.status === 200) {
        setMessage("You have left this role in this jam.")
        updateCard()

        return
      }
    } catch (error) {
      console.error(error)
    }
  }

  const joinJamByUserId = async (
    jamId: string,
    jamHostedById: string,
    instrumentId: string
  ) => {
    try {
      if (!userId) {
        setMessage("Error.")
        return
      }
      if (!jam) {
        setMessage("Error.")
        return
      }

      if (jamHostedById !== userId) {
        updateCard()

        setMessage(
          "You can't join this jam because you are not the host of this jam."
        )
        return
      }

      const ifJammersRequired = jam.jammers.some(
        (jammer) =>
          jammer.maxNumberOfJammers <= jammer.jammersId.length &&
          jammer.instrument._id === instrumentId
      )

      if (ifJammersRequired) {
        setMessage("Jam Roles are full.")
        return
      }

      const requestData = {
        jamId: jamId,
        userId: userId,
        instrumentId: instrumentId,
      }

      const response = await dataAxios.joinJam(requestData)

      if (response.status === 200) {
        setMessage("You have successfully joined this role in this jam.")
        updateCard()
        return
      }
    } catch (error) {
      console.error(error)
    }
  }

  const deleteJamRole = async (
    jamId: string,
    instrumentId: string,
    jammerId: string
  ) => {
    try {
      if (!userId) {
        setMessage("Error.")
        return
      }

      const response = await dataAxios.deleteJammerFromJamByIds(
        jammerId,
        jammerId,
        jamId,
        instrumentId
      )

      if (response.status === 200) {
        setMessage("You have delete this jammer from this role in this jam.")
        updateCard()
        return
      }
    } catch (error) {
      console.error(error)
    }
  }
  // const handleAddToFriend = async () => {
  //   try {
  //     const userData = await dataAxios.jemerCardDataFetchByEmail(
  //       currentUser?.email
  //     )
  //     const currentUserDB = userData.data.user

  //     if (currentUserDB?.friends.includes(jammer._id)) {
  //       setMessage("User is already in your friends list.")
  //       return
  //     }

  //     const senderId = currentUserDB._id
  //     const requestsResponseBySenderId =
  //       await dataAxios.getAllFriendRequestsBySenderId(senderId)

  //     if (
  //       !requestsResponseBySenderId ||
  //       !requestsResponseBySenderId.friendRequests
  //     ) {
  //       console.error(
  //         "Invalid friend requests response:",
  //         requestsResponseBySenderId
  //       )
  //       return
  //     }

  //     const friendRequestsBySender = requestsResponseBySenderId.friendRequests
  //     if (
  //       friendRequestsBySender.some(
  //         (request: FriendRequest) =>
  //           request.receiverId?._id === jammer._id &&
  //           request.status === "pending"
  //       )
  //     ) {
  //       setMessage("Friend request already sent.")
  //       return
  //     }
  //     const requestsResponseByReceiverId =
  //       await dataAxios.getAllFriendRequestsByReceiverId(currentUserDB._id)
  //     if (
  //       !requestsResponseByReceiverId ||
  //       !requestsResponseByReceiverId.friendRequests
  //     ) {
  //       console.error(
  //         "Invalid friend requests response:",
  //         requestsResponseByReceiverId
  //       )
  //       return
  //     }

  //     const friendRequestsByReceiver =
  //       requestsResponseByReceiverId.friendRequests

  //     if (
  //       friendRequestsByReceiver.some(
  //         (request: FriendRequest) =>
  //           request.senderId?._id === jammer._id && request.status === "pending"
  //       )
  //     ) {
  //       setMessage(
  //         "This person has already sent you a friend request. Please check your friend requests."
  //       )
  //       return
  //     }

  //     if (jammer._id === currentUserDB?._id) {
  //       setMessage("Cannot add yourself as a friend.")
  //       return
  //     }

  //     const response = await dataAxios.sendFriendRequest(
  //       currentUserDB?._id,
  //       jammer._id
  //     )

  //     if (response.status === 200) {
  //       console.log("Friend request sent successfully.")
  //       setMessage("Friend request sent successfully.")
  //     } else {
  //       console.error("Failed to send friend request.")
  //       setMessage("Failed to send friend request. Please try again later.")
  //     }
  //   } catch (error) {
  //     console.error("Error adding user to friends:", error)
  //     setMessage("Error adding user to friends. Please try again later.")
  //   }
  // }

  // const handleReport = async () => {
  //   try {
  //     if (!reportReason.trim()) {
  //       setError("Report reason is required.")
  //       return
  //     }
  //     if (reportReason.length > 1000) {
  //       setError("Report reason should be less than 1000 characters.")
  //       return
  //     }

  //     console.log(jammer._id)

  //     const response = await dataAxios.reportUser(
  //       jammer._id,
  //       userId,
  //       reportReason
  //     )

  //     if (response.status === 200) {
  //       setMessage(
  //         "User reported successfully. We will review the report and take appropriate action if necessary."
  //       )
  //       setShowReportModal(false)
  //       setReportReason("")
  //     } else {
  //       console.error("Failed to report user.")
  //     }
  //   } catch (error) {
  //     console.error("Error reporting user:", error)
  //   }
  // }

  return (
    <>
      <Container className="mt-4">
        <Row>
          <Col xl={2} lg={2} md={3} sm={3} xs={3}>
            <Button
              variant="outline-dark"
              size="sm"
              // className="mr-2"
              className="w-100"
              style={{
                borderColor: iconColor,
                marginRight: "20px",
                marginBottom: "20px",
              }}
              onClick={() => {
                navigate(-1)
              }}>
              <FontAwesomeIcon
                style={{color: iconColor, marginRight: iconSpacing}}
                icon={faBackward}
                className="mr-1"
              />{" "}
              Back
            </Button>
          </Col>
          <Col>
            {message && (
              <Alert
                style={{
                  height: "33px",
                  paddingTop: " 4px",
                  textAlign: "center",
                }}
                variant="info small">
                {message}
              </Alert>
            )}
          </Col>
        </Row>
        <Card>
          <Card.Header>
            <Row className="align-items-center">
              <Col xl={10} lg={10} md={8} sm={8} xs={8}>
                <h2>
                  {jam.jamName}{" "}
                  {/* {jammer?.email === currentUser?.email && "*(Me)"} */}
                </h2>
              </Col>

              {/* <Col xl={2} lg={2} md={3} sm={4} xs={4}></Col> */}
              {/* {jammer?.email !== currentUser?.email && ( */}
              <Col xl={2} lg={2} md={4} sm={4} xs={4}>
                <Button
                  onClick={() => setShowReportModal(true)}
                  variant="outline-dark"
                  size="sm"
                  style={{
                    borderColor: iconColor,
                    width: "100%",
                  }}
                  // disabled={jammer?.email === currentUser?.email}
                >
                  <FontAwesomeIcon
                    style={{color: iconColor, marginRight: "4px"}}
                    icon={faFlag}
                  />{" "}
                  Report
                </Button>
              </Col>
              {/* )} */}
            </Row>
          </Card.Header>
          <Card.Body>
            {/* {message && <Alert variant="info">{message}</Alert>} */}
            <Row>
              <Col md={4}>
                <Image
                  style={{margin: "0px 0px 15px 0px"}}
                  src={jam.img}
                  className="img-fluid"
                  alt="User"
                  fluid
                />
              </Col>
              <Col md={8}>
                <p>
                  {` ${jam.country}`} {jam.city ? `${","}` : ""}
                  {jam.city && `${jam.city} `}
                </p>
                <p>{formatDateString(jam.jamDate)}</p>
                {/* <p>Age: {calculateAge(jammer.dob)}</p> */}
                {/* <p>Gender: {jammer.gender}</p> */}
                <h5>Shared Instruments:</h5>
                <ul>
                  {jam.sharedInstruments.map((instrument) => (
                    <li key={instrument._id}>{instrument.instrument}</li>
                  ))}
                </ul>
                <h5>Genres:</h5>
                <ul>
                  {jam.genres.map((genre) => (
                    <li key={genre._id}>{genre.genre}</li>
                  ))}
                </ul>
                <p>Type: {jam.type}</p>
                <p>
                  Hosted By:{" "}
                  <Link to={`/jamerCard/${jam.hostedBy._id}`}>
                    {" "}
                    {jam.hostedBy.userName}
                  </Link>
                </p>
              </Col>
            </Row>
            {/* <SocialMediaLinks socialLinks={jammer.links} /> */}
            <hr />
            <h4>Jam Description:</h4>
            <p>{jam.jamDescription}</p>
            <hr />

            <h4>Jammer roles:</h4>
            {/* <h6>
            *** Please only request to join if you can bring a required
            instrument or if your instrument is on the list of shared
            instruments.
          </h6> */}
            <br></br>

            {!ifPastEvent ? (
              jam.jammers.map((jammer) => (
                <Row>
                  <Col xl={2} lg={2} md={1} className="sm-block" sb></Col>
                  <Col
                    xl={8}
                    lg={8}
                    md={10}
                    sm={12}
                    xs={12}
                    key={jammer._id}
                    style={{
                      // width: "90%",
                      // marginLeft: "5%",
                      border: "solid 1px",
                      borderColor: iconColor,
                      borderRadius: "15px",
                      padding: "18px 18px 0px 18px",
                      marginBottom: "30px",
                      // margin: "5px",
                      // backgroundColor: "#f3f3f3",
                    }}>
                    <div
                      style={{
                        marginLeft: "15px",
                        marginBottom: "20px",
                      }}
                      key={jammer._id}>
                      <Row>
                        <Col
                          xl={11}
                          lg={10}
                          md={10}
                          xs={9}
                          style={{fontSize: "22px"}}>
                          {jammer.instrument.instrument}
                          {" ("}
                          {jammer.jammersId.length || 0}
                          {"/"}
                          {jammer.maxNumberOfJammers}
                          {")"}
                        </Col>

                        {/* <Col style={{paddingLeft: "14px"}}> */}
                        <Col xl={1} lg={2} md={2} xs={3}>
                          {/* {jam.jammers.some(
                          (jammer) =>
                            Number(jammer.maxNumberOfJammers) >
                            Number(jammer.jammersId.length)
                        ) ? (
                          !jammer.jammersId.some(
                            (jammersId) => jammersId._id === userId
                          ) &&
                          jam.hostedBy._id != userId && (
                            <a
                              key={jammer._id} // Make sure to provide a unique key
                              href="#"
                              onClick={() =>
                                sendJamRequest(jam._id, jammer.instrument._id)
                              }>
                              Request to join
                            </a>
                          )
                        ) : (
                          <span key={jammer._id}>Full</span>
                        )} */}

                          {/* {jam.jammers.some(
                          (jammer) =>
                            Number(jammer.maxNumberOfJammers) >
                            Number(jammer.jammersId.length)
                        ) ? (
                          !jammer.jammersId.some(
                            (jammersId) => jammersId._id === userId
                          ) &&
                          jam.hostedBy._id === userId && (
                            <a
                              key={jammer._id} // Make sure to provide a unique key
                              href="#"
                              onClick={() =>
                                sendJamRequest(jam._id, jammer.instrument._id)
                              }>
                              Join
                            </a>
                          )
                        ) : (
                          <span key={jammer._id}>Full</span>
                        )} */}
                        </Col>
                      </Row>

                      {/* {jammer.jammersId.length > 0 && <hr />} */}
                      {jammer.jammersId.map((jammerId, index) => (
                        <Row key={jammerId._id}>
                          {/* <hr></hr> */}
                          <Col xl={12}>
                            <hr></hr>
                          </Col>
                          <Col xl={10} lg={10} md={9} xs={9}>
                            {/* <div style={{marginBottom: "20px"}}> */}

                            <div>
                              <Link to={`/jamerCard/${jammerId._id}`}>
                                {jammerId.userName}
                              </Link>{" "}
                            </div>
                            {""}
                            {/* {index !== jammer.jammersId.length - 1 && <hr />} */}
                          </Col>
                          <Col xl={2} lg={2} md={3} xs={3}>
                            {currentUserName === jammerId.userName && (
                              // <span>{jammerId.userName}</span>
                              <div
                                style={{
                                  display: "flex",
                                  justifyContent: "center",
                                }}>
                                <a
                                  href="#"
                                  onClick={() =>
                                    leaveJammerRole(
                                      jam._id,
                                      jammer.instrument._id
                                    )
                                  }
                                  style={{color: "red"}}>
                                  Leave{" "}
                                </a>
                              </div>
                            )}
                            {""}
                            {userId != jammerId._id &&
                              jam.hostedBy._id === userId && (
                                // <span>{jammerId.userName}</span>
                                <div
                                  style={{
                                    display: "flex",
                                    justifyContent: "center",
                                  }}>
                                  <a
                                    href="#"
                                    onClick={() =>
                                      deleteJamRole(
                                        jam._id,
                                        jammer.instrument._id,
                                        jammerId._id
                                      )
                                    }
                                    style={{
                                      color: "red",
                                      // marginBottom: "20px",
                                    }}>
                                    Delete{" "}
                                  </a>
                                </div>
                              )}
                            {""}
                            {/* <span>some</span> */}
                          </Col>
                          {/* {currentUserName != jammerId.userName && <hr></hr>} */}

                          {/* <hr></hr> */}

                          {/* {index !== jammer.jammersId.length - 1 &&
                          jammer.maxNumberOfJammers >
                            jammer.jammersId.length && <hr />} */}
                        </Row>
                      ))}
                    </div>

                    <div style={{paddingLeft: "14px"}}>
                      {jam.jammers.some(
                        (jammer) =>
                          Number(jammer.maxNumberOfJammers) >
                          Number(jammer.jammersId.length)
                      ) &&
                        !jammer.jammersId.some(
                          (jammersId) => jammersId._id === userId
                        ) &&
                        jam.hostedBy._id != userId && (
                          <div style={{marginBottom: "20px"}}>
                            <hr></hr>
                            <a
                              key={jammer._id} // Make sure to provide a unique key
                              href="#"
                              style={{color: "green"}}
                              onClick={() =>
                                sendJamRequest(jam._id, jammer.instrument._id)
                              }>
                              Request to join
                            </a>
                          </div>
                        )}

                      {jam.jammers.some(
                        (jammer) =>
                          Number(jammer.maxNumberOfJammers) >
                          Number(jammer.jammersId.length)
                      ) &&
                        !jammer.jammersId.some(
                          (jammersId) => jammersId._id === userId
                        ) &&
                        jam.hostedBy._id === userId && (
                          <div style={{marginBottom: "20px"}}>
                            <hr></hr>

                            <a
                              style={{color: "green"}}
                              key={jammer._id} // Make sure to provide a unique key
                              href="#"
                              onClick={() =>
                                joinJamByUserId(
                                  jam._id,
                                  jam.hostedBy._id,
                                  jammer.instrument._id
                                )
                              }>
                              Join
                            </a>
                          </div>
                        )}
                    </div>
                    {/* <br></br> */}

                    {/* To Do specific Logic */}

                    {/* <p>{jammer.instrument.instrument}</p> */}
                  </Col>
                </Row>
              ))
            ) : (
              <a style={{color: "red"}}>
                {" "}
                The jam is over... See you next time!
              </a>
            )}

            <hr />
            <h4>Audience:</h4>
            <p>Comming Soon...</p>
            {/* {jam.audience.map((visitor) => (
              <span key={visitor._id}>
              {" "}
              <Link to={`/jamerCard/${visitor._id}`}>
              {visitor.userName}
              </Link>{" "}
            </span>
          ))}
          <br></br>
          <br></br>
          <a href="/"> Request to join</a> */}
            <hr />
            <h4>Jam Location:</h4>
            {/* <p>Comming Soon...</p> */}

            <MapWithSearch city={jam.city} country={jam.country} />
            {/* 
            <div>
              <h1>Map Display</h1>
            </div> */}

            <hr />
            <h4>Comments:</h4>
            <p>Comming Soon...</p>
          </Card.Body>
        </Card>

        <Modal show={showReportModal} onHide={() => handleSetShowReportModal()}>
          <Modal.Header closeButton>
            <Modal.Title>Report User</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            {error && <Alert variant="danger">{error}</Alert>}

            <Form.Group controlId="reportReason">
              <Form.Label>Enter report reason:</Form.Label>
              <Form.Control
                as="textarea"
                rows={3}
                value={reportReason}
                onChange={(e) => setReportReason(e.target.value)}
              />
            </Form.Group>
          </Modal.Body>
          <Modal.Footer>
            <Button
              variant="outline-dark"
              size="sm"
              style={{
                borderColor: iconColor,
              }}
              // onClick={handleReport}
            >
              Send Report
            </Button>
          </Modal.Footer>
        </Modal>
        <br></br>
      </Container>
    </>
  )
}

export default JamCard
