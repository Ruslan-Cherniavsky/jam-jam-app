import React, {useState} from "react"
import {Link, useLocation} from "react-router-dom"
import {Button, Col, Collapse, Image, Nav, Row} from "react-bootstrap"
import {User as FirebaseUser} from "firebase/auth"
import {RootState} from "../../redux/store"
import {useSelector} from "react-redux"
import "./SideBar.css"
import {
  faArrowAltCircleDown,
  faArrowAltCircleUp,
} from "@fortawesome/free-solid-svg-icons"
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome"

interface SidebarProps {
  user: FirebaseUser | undefined
}

const Sidebar: React.FC<SidebarProps> = ({user}) => {
  const [open, setOpen] = useState(false)
  const userDataDB = useSelector(
    (state: RootState) => state.userDataMongoDB.allUserData
  )
  const {pathname} = useLocation()
  const iconColor = "#BCBCBC"

  const navItems = [
    {to: "/my-profile", label: "My Profile"},
    {to: "/update-profile", label: "Edit Profile"},
    {to: "/my-friends", label: "My Friends"},
    {to: "/create-jam/", label: "Host Jam-Events"},
    {to: "/created-jams/:jamerId", label: "Created Jam-Events"},
    {to: "/joined-jams", label: "Joined Jam-Events"},
  ]

  return (
    <>
      <Image
        style={{
          marginBottom: "9px",
          marginTop: "2px",
          color: "#BCBCBC",
          marginLeft: "16px",
          width: "80px",
          display: "flex",
          justifyContent: "center",
          textAlign: "center",
        }}
        src={userDataDB?.img || user?.photoURL || ""}
        alt="Profile"
        rounded
        fluid
      />

      <Nav className="flex-column">
        <Nav.Item>
          <Link
            style={{
              color: "gray",
              flex: 1, // Ensure the link takes up remaining space
            }}
            to="/my-profile"
            className={
              pathname === "/my-profile"
                ? "nav-link-custom nav-link link-black nav-custom active"
                : "nav-link-custom nav-link link-black nav-custom"
            }>
            My Profile
          </Link>

          {/* <div
            // variant="outline-dark"
            style={{
              borderColor: iconColor,
              backgroundColor: "red",
              width: "fit-content",
              marginLeft: "auto", // Push the icon to the far right
            }}
            // size="sm"
            onClick={() => setOpen(!open)}
            // aria-controls="example-collapse-text"
            aria-expanded={open}>
            {open ? (
              <FontAwesomeIcon
                style={{
                  color: iconColor,
                  marginRight: "4px",
                }}
                icon={faArrowAltCircleDown}
                className="mr-2"
              />
            ) : (
              <FontAwesomeIcon
                style={{
                  color: iconColor,
                  marginRight: "4px",
                }}
                icon={faArrowAltCircleUp}
                className="mr-2"
              />
            )}
          </div> */}

          <Link
            style={{color: "gray"}}
            to="/update-profile"
            className={
              pathname === "/update-profile"
                ? "nav-link-custom nav-link link-black nav-custom active"
                : "nav-link-custom nav-link link-black nav-custom"
            }>
            Edit Profile
          </Link>
          <Collapse in={open}>
            <div id="example-collapse-text"></div>
          </Collapse>
        </Nav.Item>

        {/* <Nav.Item>
          <Link
            style={{color: "gray"}}
            to="/update-profile"
            className={
              pathname === "/update-profile"
                ? "nav-link-custom nav-link link-black nav-custom active"
                : "nav-link-custom nav-link link-black nav-custom"
            }>
            Edit Profile
          </Link>
        </Nav.Item> */}
        <hr
          style={{
            color: "gray",
            marginLeft: "16px",
          }}
        />
        <Nav.Item>
          <Link
            style={{color: "gray"}}
            to="/my-friends"
            className={
              pathname === "/my-friends"
                ? "nav-link-custom nav-link link-black nav-custom active"
                : "nav-link-custom nav-link link-black nav-custom"
            }>
            {" "}
            My Friends
          </Link>
        </Nav.Item>

        <Nav.Item>
          <Link
            style={{color: "gray"}}
            to="/friendRequests"
            className={
              pathname === "/friendRequests"
                ? "nav-link-custom nav-link link-black nav-custom active"
                : "nav-link-custom nav-link link-black nav-custom"
            }>
            {" "}
            Friend Requests
          </Link>
        </Nav.Item>
        <hr
          style={{
            color: "gray",
            marginLeft: "16px",
          }}
        />
        <Nav.Item>
          <Link
            style={{color: "gray"}}
            to="/joined-jams"
            className={
              pathname === "/joined-jams"
                ? "nav-link-custom nav-link link-black nav-custom active"
                : "nav-link-custom nav-link link-black nav-custom"
            }>
            Joined Jams
          </Link>
        </Nav.Item>

        <Nav.Item>
          <Link
            style={{color: "gray"}}
            to="/invites-to-jams"
            className={
              pathname === "/invites-to-jams"
                ? "nav-link-custom nav-link link-black nav-custom active"
                : "nav-link-custom nav-link link-black nav-custom"
            }>
            Invites to Jams
          </Link>
        </Nav.Item>
        {/* <hr
          style={{
            color: "gray",
            marginLeft: "16px",
          }}
        /> */}
        <Nav.Item>
          <Link
            style={{color: "gray"}}
            to="/create-jam/"
            className={
              pathname === "/create-jam/"
                ? "nav-link-custom nav-link link-black nav-custom active"
                : "nav-link-custom nav-link link-black nav-custom"
            }>
            Hosted Jams
          </Link>
        </Nav.Item>
        <Nav.Item>
          <Link
            style={{color: "gray"}}
            to="/created-jams/:jamerId"
            className={
              pathname === "/created-jams/:jamerId"
                ? "nav-link-custom nav-link link-black nav-custom active"
                : "nav-link-custom nav-link link-black nav-custom"
            }>
            Host Jam
          </Link>
        </Nav.Item>
      </Nav>
    </>
  )
}

export default Sidebar
