import React from "react"
import {Link} from "react-router-dom"
import {Container, Row, Col, Image, Nav} from "react-bootstrap"
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome"
import {User as FirebaseUser} from "firebase/auth"

import {
  faUser,
  faMusic,
  faUsers,
  faPencilAlt,
  faUserFriends,
} from "@fortawesome/free-solid-svg-icons"
import Footer from "../Footer/Footer"
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

  return (
    <>
      {/* <div className="sidebar-container"> */}

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
              // marginBottom: "4px",
              // marginTop: "10px",
              // marginLeft: "15px",
              // fontSize: "20px",
            }}
            to="/my-profile"
            className="nav-link-custom nav-link link-black">
            {/* {userDataDB?.userName || user?.email} */}
            My Profile
          </Link>
        </Nav.Item>

        <Nav.Item>
          <Link
            style={{color: "gray"}}
            to="/update-profile"
            className="nav-link-custom nav-link link-black">
            Edit Profile
          </Link>
        </Nav.Item>
        <Nav.Item>
          <Link
            style={{color: "gray"}}
            to="/my-friends"
            className="nav-link-custom nav-link link-black">
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
            className="nav-link-custom nav-link link-black">
            Create New Jam-Event
          </Link>
        </Nav.Item>
        <Nav.Item>
          <Link
            style={{color: "gray"}}
            to="/created-jams/:jamerId"
            className="nav-link-custom nav-link link-black">
            Created Jam-Events
          </Link>
        </Nav.Item>
        <Nav.Item>
          <Link
            style={{color: "gray"}}
            to="/joined-jams"
            className="nav-link-custom nav-link link-black">
            Joined Jam-Events
          </Link>
        </Nav.Item>
      </Nav>
      {/* </div> */}
    </>
  )
}

export default Sidebar
