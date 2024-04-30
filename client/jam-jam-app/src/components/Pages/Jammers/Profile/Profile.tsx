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
import JamsListModal from "./JamsListModat"

interface UserCardProps {
  jammer: {
    _id: string
    email: string
    userName: string
    firstName: string
    lastName: string
    country: string
    city: string
    street: string
    age: number
    dob: Date
    gender: string
    genres: Array<{_id: string; genre: string; __v: number}>
    instruments: Array<{_id: string; instrument: string; __v: number}>
    img: string
    references: string
    oboutMe: string
    role: string
    links: string[]
    createdAt: string
    __v: number
  }
}

interface FriendRequest {
  __v: number
  _id: string
  receiverId: ReceiverId | null
  senderId: SenderId | null
  status: string
}

interface SenderId {
  _id: string
  userName: string
}

interface ReceiverId {
  _id: string
  userName: string
}

const UserProfileCard: React.FC<UserCardProps> = ({jammer}) => {
  const [showInviteModal, setShowInviteModal] = useState<boolean>(false)

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

  const handleInviteToJam = () => {
    console.log("Inviting to jam:", jammer.userName)
  }
  const handleEditProfileClick = () => {
    navigate("/update-profile")
  }

  function calculateAge(birthdate: Date): number {
    const today = new Date()
    const birthdateDate = new Date(birthdate)

    let age = today.getFullYear() - birthdateDate.getFullYear()
    const monthDiff = today.getMonth() - birthdateDate.getMonth()

    if (
      monthDiff < 0 ||
      (monthDiff === 0 && today.getDate() < birthdateDate.getDate())
    ) {
      age--
    }

    return age
  }

  const handleSetShowReportModal = () => {
    setError("")
    setShowReportModal(false)
  }

  const handleAddToFriend = async () => {
    try {
      const userData = await dataAxios.jemerCardDataFetchByEmail(
        currentUser?.email
      )
      const currentUserDB = userData.data.user

      if (currentUserDB?.friends.includes(jammer._id)) {
        setMessage("User is already in your friends list.")
        return
      }

      const senderId = currentUserDB._id
      const requestsResponseBySenderId =
        await dataAxios.getAllFriendRequestsBySenderId(senderId)

      if (
        !requestsResponseBySenderId ||
        !requestsResponseBySenderId.friendRequests
      ) {
        console.error(
          "Invalid friend requests response:",
          requestsResponseBySenderId
        )
        return
      }

      const friendRequestsBySender = requestsResponseBySenderId.friendRequests
      if (
        friendRequestsBySender.some(
          (request: FriendRequest) =>
            request.receiverId?._id === jammer._id &&
            request.status === "pending"
        )
      ) {
        setMessage("Friend request already sent.")
        return
      }
      const requestsResponseByReceiverId =
        await dataAxios.getAllFriendRequestsByReceiverId(currentUserDB._id)
      if (
        !requestsResponseByReceiverId ||
        !requestsResponseByReceiverId.friendRequests
      ) {
        console.error(
          "Invalid friend requests response:",
          requestsResponseByReceiverId
        )
        return
      }

      const friendRequestsByReceiver =
        requestsResponseByReceiverId.friendRequests

      if (
        friendRequestsByReceiver.some(
          (request: FriendRequest) =>
            request.senderId?._id === jammer._id && request.status === "pending"
        )
      ) {
        setMessage(
          "This person has already sent you a friend request. Please check your friend requests."
        )
        return
      }

      if (jammer._id === currentUserDB?._id) {
        setMessage("Cannot add yourself as a friend.")
        return
      }

      const response = await dataAxios.sendFriendRequest(
        currentUserDB?._id,
        jammer._id
      )

      if (response.status === 200) {
        console.log("Friend request sent successfully.")
        setMessage("Friend request sent successfully.")
      } else {
        console.error("Failed to send friend request.")
        setMessage("Failed to send friend request. Please try again later.")
      }
    } catch (error) {
      console.error("Error adding user to friends:", error)
      setMessage("Error adding user to friends. Please try again later.")
    }
  }

  const handleReport = async () => {
    try {
      if (!reportReason.trim()) {
        setError("Report reason is required.")
        return
      }
      if (reportReason.length > 1000) {
        setError("Report reason should be less than 1000 characters.")
        return
      }

      console.log(jammer._id)

      const response = await dataAxios.reportUser(
        jammer._id,
        userId,
        reportReason
      )

      if (response.status === 200) {
        setMessage(
          "User reported successfully. We will review the report and take appropriate action if necessary."
        )
        setShowReportModal(false)
        setReportReason("")
      } else {
        console.error("Failed to report user.")
      }
    } catch (error) {
      console.error("Error reporting user:", error)
    }
  }

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
                {jammer.userName}{" "}
                {jammer?.email === currentUser?.email && "*(Me)"}
              </h2>
            </Col>
            {/* <Col xl={2} lg={2} md={3} sm={4} xs={4}></Col> */}
            {jammer?.email !== currentUser?.email && (
              <Col xl={2} lg={2} md={4} sm={4} xs={4}>
                <Button
                  onClick={() => setShowReportModal(true)}
                  variant="outline-dark"
                  size="sm"
                  style={{
                    borderColor: iconColor,
                    width: "100%",
                  }}
                  disabled={jammer?.email === currentUser?.email}>
                  <FontAwesomeIcon
                    style={{color: iconColor, marginRight: "4px"}}
                    icon={faFlag}
                  />{" "}
                  Report
                </Button>
              </Col>
            )}
          </Row>
        </Card.Header>
        <Card.Body>
          {message && <Alert variant="info">{message}</Alert>}

          <Row>
            <Col md={4}>
              <Image
                style={{margin: "0px 0px 15px 0px"}}
                src={jammer.img}
                className="img-fluid"
                alt="User"
                fluid
              />
            </Col>
            <Col md={8}>
              <h3>{`${jammer.firstName} ${jammer.lastName}`}</h3>
              <p>
                {` ${jammer.country}`} {jammer.city ? `${","}` : ""}
                {jammer.city && `${jammer.city} `}
              </p>
              <p>Age: {calculateAge(jammer.dob)}</p>
              <p>Gender: {jammer.gender}</p>
              <h5>Instruments:</h5>
              <ul>
                {jammer.instruments.map((instrument) => (
                  <li key={instrument._id}>{instrument.instrument}</li>
                ))}
              </ul>
              <h5>Genres:</h5>
              <ul>
                {jammer.genres.map((genre) => (
                  <li key={genre._id}>{genre.genre}</li>
                ))}
              </ul>
            </Col>
          </Row>

          <SocialMediaLinks socialLinks={jammer.links} />
          <hr />
          <h4>About Me</h4>
          <p>{jammer.oboutMe}</p>

          {jammer?.email !== currentUser?.email && (
            <Row>
              <Col xl={2} lg={4} md={4} sm={6} xs={6}>
                <Button
                  variant="outline-dark"
                  size="sm"
                  className="mr-2"
                  style={{
                    borderColor: iconColor,
                    width: "100%",
                  }}
                  disabled={jammer?.email === currentUser?.email}
                  onClick={handleAddToFriend}>
                  <FontAwesomeIcon
                    style={{color: iconColor, marginRight: "1px"}}
                    icon={faUserPlus}
                    className="mr-1"
                  />{" "}
                  Add to Friend
                </Button>
              </Col>
              <Col xl={2} lg={4} md={4} sm={6} xs={6}>
                {/* <Button
                  disabled={jammer?.email === currentUser?.email}
                  variant="outline-dark"
                  size="sm"
                  style={{
                    borderColor: iconColor,
                    width: "100%",
                  }}
                  onClick={handleInviteToJam}>
                  <FontAwesomeIcon
                    style={{color: iconColor, marginRight: "4px"}}
                    icon={faMusic}
                    className="mr-2"
                  />{" "}
                  Invite to Jam
                </Button> */}

                <Button
                  variant="outline-dark"
                  size="sm"
                  style={{
                    borderColor: iconColor,
                    width: "100%",
                  }}
                  onClick={() => setShowInviteModal(true)}>
                  <FontAwesomeIcon
                    style={{color: iconColor, marginRight: "4px"}}
                    icon={faMusic}
                    className="mr-2"
                  />{" "}
                  Invite to Jam
                </Button>

                <JamsListModal
                  jammerId={jammer._id}
                  show={showInviteModal}
                  onHide={() => setShowInviteModal(false)}
                />
              </Col>
            </Row>
          )}
          {jammer?.email === currentUser?.email && (
            <Row>
              <Col xl={2} lg={4} md={4} sm={6} xs={6}>
                <Button
                  variant="outline-dark"
                  size="sm"
                  style={{
                    borderColor: iconColor,
                    width: "100%",
                  }}
                  onClick={handleEditProfileClick}>
                  <FontAwesomeIcon
                    style={{
                      color: iconColor,
                      marginRight: "4px",
                    }}
                    icon={faEdit}
                    className="mr-2"
                  />{" "}
                  Edit Profile
                </Button>
              </Col>
            </Row>
          )}
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
            onClick={handleReport}>
            Send Report
          </Button>
        </Modal.Footer>
      </Modal>
      <br></br>
    </Container>
  )
}

export default UserProfileCard
