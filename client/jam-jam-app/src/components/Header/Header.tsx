import React, {useEffect, useState} from "react"
import {Navbar, Nav, NavDropdown} from "react-bootstrap"
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
      <Navbar.Brand as={Link} to="/">
        Your Logo
      </Navbar.Brand>

      <Navbar.Toggle aria-controls="basic-navbar-nav" />

      <Navbar.Collapse id="basic-navbar-nav">
        <Nav className="mr-auto">
          <Nav.Link as={Link} to="/jammersList">
            Jamers
          </Nav.Link>
          <Nav.Link as={Link} to="/jam-events">
            Jam-Events
          </Nav.Link>
          <Nav.Link as={Link} to="/about">
            About
          </Nav.Link>
        </Nav>

        {/* Dropdown with user-related options */}
        {currentUser ? (
          <NavDropdown title={currentUser?.email} id="basic-nav-dropdown">
            <NavDropdown.Item as={Link} to={`/profile`}>
              My Profile
            </NavDropdown.Item>
            <NavDropdown.Item as={Link} to="/my-jam-events/:jamerId">
              My Jam Events
            </NavDropdown.Item>
            <NavDropdown.Item as={Link} to="/create-jam-event/:jamerId">
              Create Jam Event
            </NavDropdown.Item>
            <NavDropdown.Item as={Link} to="/update-profile">
              Update Profile
            </NavDropdown.Item>
            <NavDropdown.Item onClick={handleLogOut}>Logout</NavDropdown.Item>
          </NavDropdown>
        ) : null}
      </Navbar.Collapse>
    </Navbar>
  )
}

export default Header
