import React from "react"
import {Col, Container, Row} from "react-bootstrap"
import Sidebar from "../SideBar/SideBar"
import {useAuthContext} from "../../context/AuthContext"
import {Route, Routes} from "react-router"
import PrivateRouteVerified from "../Auth/PrivateRoutes/PrivateRouteVerified"
import JammersCardListPage from "./Jammers/CardListPage/CardListPage"
import JamerCardPage from "./Jammers/ProfilePage/ProfilePage"
import {CreateJamEvent} from "./User/CreateJam/CreateJam"
import {CreatedJamEvents} from "./User/CreatedJamEvents/CreatedJamEvents"
import Signup from "../Auth/Signup/Signup"
import ForgotPassword from "../Auth/ForgotPassword/ForgotPassword"
import Login from "../Auth/Login/Login"
import PrivateRouteUnverified from "../Auth/PrivateRoutes/PrivateRouteUnverified"
import CheckEmail from "../Auth/CheckEmail/CheckEmail"
import JoinedJams from "./User/JoinedJams/JoinedJams"
import ProfilePage from "./User/ProfilePage/ProfilePage"
import UbdateProfilePage from "./User/UpdateProfilePage/Page/UbdateProfilePage"
import PrivateRouteUpdateProfile from "../Auth/PrivateRoutes/PrivateRouteUpdateProfile"
import "./MainPage.css"
import HomePage from "./HomePage/HomePage"
import MyFriends from "./User/MyFriends/MyFriends"
import InvitesToJams from "./User/InvitesToJams/InvitesToJams"
import FriendRequests from "./User/friendRequests/friendRequests"

export default function () {
  const {currentUser} = useAuthContext()

  return (
    <>
      <Container fluid className="mainPageContainer">
        {/* Sidebar */}

        <Row>
          {currentUser && currentUser.emailVerified && (
            <Col
              md={4}
              lg={3}
              xl={2}
              className="sidebar-container bg-light text-black d-none d-md-block bg-light sidebar">
              <Sidebar user={currentUser} />
            </Col>
          )}

          <Col>
            <Routes>
              <Route
                path="/jammersList"
                element={
                  <PrivateRouteVerified>
                    <JammersCardListPage />
                  </PrivateRouteVerified>
                }
              />

              <Route
                path="/jamerCard/:jamerId"
                element={
                  <PrivateRouteVerified>
                    <JamerCardPage />
                  </PrivateRouteVerified>
                }></Route>

              <Route
                path="/created-jams/:jamerId"
                element={
                  <PrivateRouteVerified>
                    <CreatedJamEvents />
                  </PrivateRouteVerified>
                }></Route>
              <Route
                path="/create-jam/"
                element={
                  <PrivateRouteVerified>
                    <CreateJamEvent />
                  </PrivateRouteVerified>
                }></Route>

              <Route
                path="/joined-jams"
                element={
                  <PrivateRouteVerified>
                    <JoinedJams />
                  </PrivateRouteVerified>
                }></Route>

              <Route
                path="/my-profile"
                element={
                  <PrivateRouteVerified>
                    <ProfilePage />
                  </PrivateRouteVerified>
                }></Route>
              <Route
                path="/update-profile"
                element={
                  <PrivateRouteUpdateProfile>
                    <UbdateProfilePage />
                  </PrivateRouteUpdateProfile>
                }></Route>
              <Route
                path="/my-friends"
                element={
                  <PrivateRouteUpdateProfile>
                    <MyFriends />
                  </PrivateRouteUpdateProfile>
                }></Route>
              <Route
                path="/invites-to-jams"
                element={
                  <PrivateRouteUpdateProfile>
                    <InvitesToJams />
                  </PrivateRouteUpdateProfile>
                }></Route>
              <Route
                path="/friend-requests"
                element={
                  <PrivateRouteUpdateProfile>
                    <FriendRequests />
                  </PrivateRouteUpdateProfile>
                }></Route>

              {/* Auth */}
              <Route path="/" element={<HomePage />}></Route>
            </Routes>
          </Col>
          <Routes>
            <Route
              path="/check-email"
              element={
                <PrivateRouteUnverified>
                  <CheckEmail />
                </PrivateRouteUnverified>
              }
            />
            <Route path="/forgot-password" element={<ForgotPassword />}></Route>
            <Route path="/login" element={<Login />}></Route>
            <Route path="/signup" element={<Signup />}></Route>
          </Routes>
        </Row>
      </Container>
    </>
  )
}
