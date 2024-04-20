import React, {useState} from "react"
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

// interface JamCardListProps {
//   jam: Jam
// }

const JamCard = ({jam}: {jam: Jam}) => {
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
    <Container className="mt-4">
      <Button
        variant="outline-dark"
        size="sm"
        className="mr-2"
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
          {message && <Alert variant="info">{message}</Alert>}

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
              {/* <p>Age: {calculateAge(jammer.dob)}</p> */}
              {/* <p>Gender: {jammer.gender}</p> */}
              <p>Type: {jam.type}</p>
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

          <br></br>
          {jam.jammers.map((jammer) => (
            <div style={{marginLeft: "15px"}} key={jammer._id}>
              <h5>
                {jammer.instrument.instrument}
                {" ("}
                {jammer.jammersId.length}
                {"/"}
                {jammer.maxNumberOfJammers}
                {")"}
              </h5>

              {jammer.jammersId.map((jammer) => (
                <li key={jammer._id}>
                  <Link to={`/jamerCard/${jammer._id}`}>{jammer.userName}</Link>
                </li>
              ))}
              <a href="/"> Request to join</a>
              <br></br>
              <br></br>

              {/* To Do specific Logic */}

              {/* <p>{jammer.instrument.instrument}</p> */}
            </div>
          ))}

          <hr />
          <h4>Audience:</h4>
          {jam.audience.map((visitor) => (
            <span key={visitor._id}>
              {" "}
              <Link to={`/jamerCard/${visitor._id}`}>
                {visitor.userName}
              </Link>{" "}
            </span>
          ))}
          <br></br>
          <br></br>
          <a href="/"> Request to join</a>

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
  )
}

export default JamCard
