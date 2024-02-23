import React from "react"
import {Navigate, useParams} from "react-router-dom"
import {Card, Container, Row, Col, Image, Button} from "react-bootstrap"
import SocialMediaLinks from "../../User/UpdateProfilePage/SocialMediaLinks/SocialMediaLinks"
import {faUserPlus, faMusic} from "@fortawesome/free-solid-svg-icons"
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome"
import {useAuthContext} from "../../../../context/AuthContext"
import {useNavigate} from "react-router-dom"

interface UserCardProps {
  user: {
    _id: string
    email: string
    userName: string
    firstName: string
    lastName: string
    country: string
    city: string
    street: string
    age: number
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

const UserProfileCard: React.FC<UserCardProps> = ({user}) => {
  // Use useParams to get the user ID from the route
  const {userId} = useParams<{userId: string}>()
  const {currentUser} = useAuthContext()
  const navigate = useNavigate()

  const iconColor = "#BCBCBC" // Specify the desired color here
  const iconSpacing = "12px" // Specify the desired spacing here

  const handleAddToFriend = () => {
    // Logic to handle adding user to friend
    console.log("Adding to friend:", user.userName)
  }

  const handleInviteToJam = () => {
    // Logic to handle inviting user to jam
    console.log("Inviting to jam:", user.userName)
  }
  const handleEditProfileClick = () => {
    navigate("/update-profile")
  }
  return (
    <Container className="mt-4">
      <Card>
        <Card.Header>
          <h2>
            {user.userName} {user?.email === currentUser?.email && "*(Me)"}
          </h2>
        </Card.Header>
        <Card.Body>
          <Row>
            <Col md={4}>
              <Image src={user.img} className="img-fluid" alt="User" fluid />
            </Col>
            <Col md={8}>
              <h3>{`${user.firstName} ${user.lastName}`}</h3>
              <p>
                {` ${user.country}`} {user.city ? `${","}` : ""}
                {user.city && `${user.city} `}
              </p>
              <p>Age: {user.age}</p>
              <p>Gender: {user.gender}</p>
              <h5>Instruments:</h5>
              <ul>
                {user.instruments.map((instrument) => (
                  <li key={instrument._id}>{instrument.instrument}</li>
                ))}
              </ul>
              <h5>Genres:</h5>
              <ul>
                {user.genres.map((genre) => (
                  <li key={genre._id}>{genre.genre}</li>
                ))}
              </ul>
            </Col>
          </Row>

          <SocialMediaLinks socialLinks={user.links} />
          <hr />
          {/* <hr /> */}
          <h4>About Me</h4>
          <p>{user.oboutMe}</p>

          <Row>
            {user?.email !== currentUser?.email && (
              <Col>
                <Button
                  variant="outline-dark"
                  size="sm"
                  className="mr-2"
                  style={{
                    borderColor: iconColor,
                    marginRight: "20px",
                  }}
                  disabled={user?.email === currentUser?.email}
                  onClick={handleAddToFriend}>
                  <FontAwesomeIcon
                    style={{color: iconColor, marginRight: iconSpacing}}
                    icon={faUserPlus}
                    className="mr-1"
                  />{" "}
                  Add to Friend
                </Button>
                <Button
                  disabled={user?.email === currentUser?.email}
                  variant="outline-dark"
                  size="sm"
                  style={{
                    borderColor: iconColor,
                  }}
                  onClick={handleInviteToJam}>
                  <FontAwesomeIcon
                    style={{color: iconColor, marginRight: iconSpacing}}
                    icon={faMusic}
                    className="mr-1"
                  />{" "}
                  Invite to Jam
                </Button>
              </Col>
            )}

            <Col>
              {user?.email === currentUser?.email && (
                <Button
                  variant="outline-dark"
                  size="sm"
                  style={{
                    borderColor: iconColor,
                  }}
                  onClick={handleEditProfileClick}>
                  <FontAwesomeIcon
                    style={{color: iconColor, marginRight: iconSpacing}}
                    icon={faMusic}
                    className="mr-1"
                  />{" "}
                  Edit Profile
                </Button>
              )}
            </Col>
          </Row>
        </Card.Body>
      </Card>
    </Container>
  )
}

export default UserProfileCard
