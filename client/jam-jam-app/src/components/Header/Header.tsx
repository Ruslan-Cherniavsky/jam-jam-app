import React, {useEffect, useState} from "react"
import {Navbar, Nav, NavDropdown, Col} from "react-bootstrap"
import {Link, useNavigate} from "react-router-dom" // Assuming you're using react-router-dom
import {
  selectFirebaseUserData,
  clearFirebaseUserData,
} from "../../redux/reducers/FirbaseUserDataSlice"
import {useSelector} from "react-redux"
import {useAuthContext} from "../../context/AuthContext"
import {RootState} from "../../redux/store"

const Header: React.FC = () => {
  const [error, setError] = useState<string>("")
  // const [userName, setUserName] = useState<string | null | undefined>("")
  // const firebaseUserData = useSelector(selectFirebaseUserData)

  const {currentUser, logout} = useAuthContext()

  const userName = useSelector(
    (state: RootState) => state.userDataMongoDB.allUserData?.userName
  )
  const navigate = useNavigate()

  async function handleLogOut() {
    setError("")

    try {
      await logout()

      navigate("/login")
    } catch (error) {
      setError("Failed to log out")
      console.log("Failed to log out")
    }
  }

  // const userIdMongoDB: any = useSelector(
  //   (state: RootState) => state.userDataMongoDB.allUserData?.userId
  // )

  return (
    <Navbar bg="light" expand="lg">
      {/* Your logo, brand, etc. */}
      <Navbar.Brand style={{marginLeft: "28px"}} as={Link} to="/">
        <img
          style={{width: "100px"}}
          src="https://firebasestorage.googleapis.com/v0/b/jam-jam-development.appspot.com/o/images%2Fw3.png?alt=media&token=60b1d871-47bc-41a2-b075-03daebb1d92b"
          alt=""
        />
        {/* Jam - Jam{" "} */}
      </Navbar.Brand>

      <Navbar.Toggle aria-controls="basic-navbar-nav" />

      <Navbar.Collapse id="basic-navbar-nav">
        <Nav className="mr-auto">
          {/* <Nav.Link as={Link} to={`/jammersList`}>
            Jammers
          </Nav.Link> */}
          <Nav.Link as={Link} to="/jammersList">
            Jammers
          </Nav.Link>

          <Nav.Link as={Link} to="/jam-events">
            Jam-Events
          </Nav.Link>
          <Nav.Link as={Link} to="/about">
            About
          </Nav.Link>
        </Nav>

        <Col></Col>

        {/* Dropdown with user-related options */}
        {currentUser && currentUser.emailVerified ? (
          <NavDropdown
            align="end" // Add this line to align the dropdown to the left
            style={{marginRight: "25px"}}
            title={userName || currentUser?.email}
            id="basic-nav-dropdown">
            <NavDropdown.Item as={Link} to={`/my-profile`}>
              My Profile
            </NavDropdown.Item>
            {/* <NavDropdown.Item as={Link} to="/my-jam-events/:jamerId">
              My Jam Events
            </NavDropdown.Item>
            <NavDropdown.Item as={Link} to="/create-jam-event/:jamerId">
              Create Jam Event
            </NavDropdown.Item> */}
            <NavDropdown.Item as={Link} to="/update-profile">
              Edit Profile
            </NavDropdown.Item>
            <NavDropdown.Item onClick={handleLogOut}>Logout</NavDropdown.Item>
          </NavDropdown>
        ) : (
          <Nav.Link style={{marginRight: "25px"}} as={Link} to="/login">
            Login
          </Nav.Link>
        )}
      </Navbar.Collapse>
    </Navbar>
  )
}

export default Header
