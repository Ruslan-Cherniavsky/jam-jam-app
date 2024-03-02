import React from "react"
import {Link, useLocation} from "react-router-dom"
import {Image, Nav} from "react-bootstrap"
import {User as FirebaseUser} from "firebase/auth"
import {RootState} from "../../redux/store"
import {useSelector} from "react-redux"
import "./SideBar.css"

interface SidebarProps {
  user: FirebaseUser | undefined
}

const Sidebar: React.FC<SidebarProps> = ({user}) => {
  const userDataDB = useSelector(
    (state: RootState) => state.userDataMongoDB.allUserData
  )
  const {pathname} = useLocation()

  const navItems = [
    {to: "/my-profile", label: "My Profile"},
    {to: "/update-profile", label: "Edit Profile"},
    {to: "/my-friends", label: "My Friends"},
    {to: "/create-jam/", label: "Create New Jam-Event"},
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
            }}
            to="/my-profile"
            className={
              pathname === "/my-profile"
                ? "nav-link-custom nav-link link-black nav-custom active"
                : "nav-link-custom nav-link link-black nav-custom"
            }>
            My Profile
          </Link>
        </Nav.Item>

        <Nav.Item>
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
        </Nav.Item>
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
        <hr
          style={{
            color: "gray",
            marginLeft: "16px",
          }}
        />
        <Nav.Item>
          <Link
            style={{color: "gray"}}
            to="/create-jam/"
            className={
              pathname === "/create-jam/"
                ? "nav-link-custom nav-link link-black nav-custom active"
                : "nav-link-custom nav-link link-black nav-custom"
            }>
            Create New Jam-Event
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
            Created Jam-Events
          </Link>
        </Nav.Item>
        <Nav.Item>
          <Link
            style={{color: "gray"}}
            to="/joined-jams"
            className={
              pathname === "/joined-jams"
                ? "nav-link-custom nav-link link-black nav-custom active"
                : "nav-link-custom nav-link link-black nav-custom"
            }>
            Joined Jam-Events
          </Link>
        </Nav.Item>
      </Nav>
    </>
  )
}

export default Sidebar
