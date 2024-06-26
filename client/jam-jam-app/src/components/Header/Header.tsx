import {Navbar, Nav, NavDropdown, Col} from "react-bootstrap"
import {Link, useLocation, useNavigate} from "react-router-dom"
import {useSelector} from "react-redux"
import {useAuthContext} from "../../context/AuthContext"
import {RootState} from "../../redux/store"
import "./Header.css"

const Header: React.FC = () => {
  const {pathname} = useLocation()

  const {currentUser, logout} = useAuthContext()

  const userName = useSelector(
    (state: RootState) => state.userDataMongoDB.allUserData?.userName
  )

  const friendRequestsNumber = useSelector(
    (state: RootState) => state.userNotifications.friendRequestsNumber
  )

  const navigate = useNavigate()
  async function handleLogOut() {
    try {
      await logout()

      navigate("/login")
    } catch (error) {
      console.error("Failed to log out", error)
    }
  }

  return (
    <Navbar bg="light" expand="md">
      <Col className="d-block d-md-none" sm={4} xs={4}></Col>

      <Navbar.Brand className="d-block d-md-none" as={Link} to="/">
        <img
          style={{width: "90px", marginBottom: "4px", marginLeft: "14px"}}
          src="https://firebasestorage.googleapis.com/v0/b/jam-jam-development.appspot.com/o/images%2Fw3.png?alt=media&token=60b1d871-47bc-41a2-b075-03daebb1d92b"
          alt=""
        />
      </Navbar.Brand>

      <Navbar.Brand
        className="d-none d-md-block"
        style={{marginLeft: "28px", marginBottom: "4px"}}
        as={Link}
        to="/">
        <img
          style={{width: "90px"}}
          src="https://firebasestorage.googleapis.com/v0/b/jam-jam-development.appspot.com/o/images%2Fw3.png?alt=media&token=60b1d871-47bc-41a2-b075-03daebb1d92b"
          alt=""
        />
      </Navbar.Brand>

      <Col className="d-block d-md-none" sm={2} xs={2}></Col>

      <Navbar.Toggle aria-controls="basic-navbar-nav " />

      <Navbar.Collapse id="basic-navbar-nav">
        <Nav className="mr-auto">
          <Nav.Link
            style={{paddingLeft: "5px"}}
            as={Link}
            to="/jammersList"
            className={
              pathname === "/jammersList" ? "nav-custom active" : "nav-custom"
            }>
            Explore Jammers
          </Nav.Link>
          <Nav.Link
            style={{paddingLeft: "5px"}}
            as={Link}
            to="/jam-events"
            className={
              pathname === "/jam-events" ? "nav-custom active" : "nav-custom"
            }>
            Explore Jams
          </Nav.Link>

          {currentUser?.emailVerified && (
            <div className="d-block d-md-none">
              <hr
                style={{
                  color: "gray",
                  marginLeft: "6px",
                }}
              />{" "}
              <Nav.Link
                style={{paddingLeft: "5px"}}
                as={Link}
                to="/my-profile"
                className={
                  pathname === "/my-profile"
                    ? "active nav-custom"
                    : "nav-custom"
                }>
                My Profile
              </Nav.Link>
              <Nav.Link
                style={{paddingLeft: "5px"}}
                as={Link}
                to="/update-profile"
                className={
                  pathname === "/update-profile"
                    ? "active nav-custom"
                    : "nav-custom"
                }>
                Edit Profile
              </Nav.Link>
              <hr
                style={{
                  color: "gray",
                  marginLeft: "6px",
                }}
              />
              <Nav.Link
                style={{paddingLeft: "5px"}}
                as={Link}
                to="/my-friends"
                className={
                  pathname === "/my-friends"
                    ? "nav-custom active "
                    : "nav-custom"
                }>
                My Friends
              </Nav.Link>
              <Nav.Link
                style={{paddingLeft: "5px"}}
                as={Link}
                to="/friend-requests"
                className={
                  pathname === "/friend-requests"
                    ? "active nav-custom"
                    : "nav-custom"
                }>
                Friend Requests{" "}
                <p style={{color: "red", display: "inline"}}>
                  {friendRequestsNumber > 0 && friendRequestsNumber}
                </p>
              </Nav.Link>
              <hr
                style={{
                  color: "gray",
                  marginLeft: "6px",
                }}
              />
              <Nav.Link
                style={{paddingLeft: "5px"}}
                as={Link}
                to="/joined-jams"
                className={
                  pathname === "/joined-jams"
                    ? "nav-custom active"
                    : "nav-custom"
                }>
                Joined Jams
              </Nav.Link>
              <Nav.Link
                style={{paddingLeft: "5px"}}
                as={Link}
                to="/invites-to-jams"
                className={
                  pathname === "/invites-to-jams"
                    ? "nav-custom active"
                    : "nav-custom"
                }>
                Invites to Jams
              </Nav.Link>
              <NavDropdown.Divider />
              <Nav.Link
                style={{paddingLeft: "5px"}}
                as={Link}
                to="/created-jams/:jamerId"
                className={
                  pathname === "/created-jams/:jamerId"
                    ? "nav-custom active"
                    : "nav-custom"
                }>
                Hosted Jams
              </Nav.Link>
              <Nav.Link
                style={{paddingLeft: "5px"}}
                as={Link}
                to="/create-jam/:jamerId"
                className={
                  pathname === "/create-jam/:jamerId"
                    ? "nav-custom active"
                    : "nav-custom"
                }>
                Host Jam
              </Nav.Link>
              <Nav.Link
                onClick={handleLogOut}
                style={{paddingLeft: "5px"}}
                className={
                  pathname === "/s" ? "nav-custom active" : "nav-custom"
                }>
                Log out
              </Nav.Link>
            </div>
          )}
        </Nav>

        <Col></Col>
        <div className="d-none d-md-block">
          <Nav>
            {currentUser && currentUser.emailVerified ? (
              <NavDropdown
                align="end"
                style={{marginRight: "25px", paddingLeft: "5px"}}
                title={userName || currentUser?.email}
                id="basic-nav-dropdown">
                <NavDropdown.Item as={Link} to={`/my-profile`}>
                  My Profile
                </NavDropdown.Item>
                <NavDropdown.Item as={Link} to="/update-profile">
                  Edit Profile
                </NavDropdown.Item>
                <NavDropdown.Divider />

                <NavDropdown.Item onClick={handleLogOut}>
                  Logout
                </NavDropdown.Item>
              </NavDropdown>
            ) : (
              <Nav.Link
                className="custom-link"
                style={{marginRight: "25px"}}
                as={Link}
                to="/login">
                Login
              </Nav.Link>
            )}
          </Nav>
        </div>
        {/* <Nav className="me-auto">
          <Nav.Link href="#home">Home</Nav.Link>
          <Nav.Link href="#link">Link</Nav.Link>
          
          <NavDropdown title="Dropdown" id="basic-nav-dropdown">
          <NavDropdown.Item href="#action/3.1">Action</NavDropdown.Item>
          <NavDropdown.Item href="#action/3.2">
          Another action
          </NavDropdown.Item>
            <NavDropdown.Item href="#action/3.3">Something</NavDropdown.Item>
            <NavDropdown.Divider />
            <NavDropdown.Item href="#action/3.4">
              Separated link
            </NavDropdown.Item>
          </NavDropdown>
        </Nav> */}
      </Navbar.Collapse>
    </Navbar>
  )
}

export default Header
