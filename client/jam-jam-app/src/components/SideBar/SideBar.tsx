import React, {useState} from "react"
import {Link, useLocation} from "react-router-dom"
import {Collapse, Image, Nav} from "react-bootstrap"
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

  const friendRequestsNumber = useSelector(
    (state: RootState) => state.userNotifications.friendRequestsNumber
  )

  const {pathname} = useLocation()
  const iconColor = "#BCBCBC"

  const navItems = [
    {to: "/my-profile", label: "My Profile"},
    {to: "/update-profile", label: "Edit Profile"},
    {to: "/my-friends", label: "My Friends"},
    {to: "/host-jam", label: "Host Jam-Events"},
    {to: "/hosted-jams", label: "Created Jam-Events"},
    {to: "/joined-jams", label: "Joined Jam-Events"},
    {to: "/jam-requests", label: "Joined Jam-Events"},
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
              flex: 1,
            }}
            to="/my-profile"
            className={
              pathname === "/my-profile"
                ? "nav-link-custom nav-link link-black nav-custom active"
                : "nav-link-custom nav-link link-black nav-custom"
            }>
            My Profile
          </Link>

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
            to="/friend-requests"
            className={
              pathname === "/friend-requests"
                ? "nav-link-custom nav-link link-black nav-custom active"
                : "nav-link-custom nav-link link-black nav-custom"
            }>
            Friend Requests{"   "}
            <p style={{color: "red", display: "inline"}}>
              {friendRequestsNumber > 0 && friendRequestsNumber}
            </p>
          </Link>{" "}
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
        <Nav.Item>
          <Link
            style={{color: "gray"}}
            to="/host-jam"
            className={
              pathname === "/host-jam"
                ? "nav-link-custom nav-link link-black nav-custom active"
                : "nav-link-custom nav-link link-black nav-custom"
            }>
            Host Jam
          </Link>
        </Nav.Item>
        <Nav.Item>
          <Link
            style={{color: "gray"}}
            to="/hosted-jams"
            className={
              pathname === "/hosted-jams"
                ? "nav-link-custom nav-link link-black nav-custom active"
                : "nav-link-custom nav-link link-black nav-custom"
            }>
            Hosted Jams
          </Link>
        </Nav.Item>

        <Nav.Item>
          <Link
            style={{color: "gray"}}
            to="/jam-requests"
            className={
              pathname === "/jam-requests"
                ? "nav-link-custom nav-link link-black nav-custom active"
                : "nav-link-custom nav-link link-black nav-custom"
            }>
            Jam Requests{" "}
          </Link>
        </Nav.Item>
      </Nav>
    </>
  )
}

export default Sidebar
