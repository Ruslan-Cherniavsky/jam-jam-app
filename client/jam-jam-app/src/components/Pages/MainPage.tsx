import React from "react"
import {Col, Container, Row} from "react-bootstrap"
import Sidebar from "../SideBar/SideBar"
import {useAuthContext} from "../../context/AuthContext"
import {Route, Routes} from "react-router"
import PrivateRouteVerified from "./Auth/PrivateRoutes/PrivateRouteVerified"
import JammersCardListPage from "./Jammers/CardListPage_Jammers/CardListPage_jammers"
import JamerCardPage from "./Jammers/ProfilePage/ProfilePage"
import {CreateJamEvent} from "./James/CreateJam/CreateJam"
import Signup from "./Auth/Signup/Signup"
import ForgotPassword from "./Auth/ForgotPassword/ForgotPassword"
import Login from "./Auth/Login/Login"
import PrivateRouteUnverified from "./Auth/PrivateRoutes/PrivateRouteUnverified"
import CheckEmail from "./Auth/CheckEmail/CheckEmail"
import ProfilePage from "./User/ProfilePage/ProfilePage"
import UbdateProfilePage from "./User/UpdateProfilePage/Page/UbdateProfilePage"
import PrivateRouteUpdateProfile from "./Auth/PrivateRoutes/PrivateRouteUpdateProfile"
import "./MainPage.css"
import HomePage from "./HomePage/HomePage"
import MyFriends from "./User/MyFriends/MyFriends"
import InvitesToJamsCardListPage from "./James/InvitesToJams/InvitesToJamsPage"
import FriendRequests from "./User/friendRequests/friendRequests"
import {CreatedJams} from "./James/CreatedJams/CreatedJams"
import JamsCardListPage from "./James/CardListPage_Jams/CardListPage_Jams"
import JamCardPage from "./James/jamCardPage/jamCardPage"
import JoinedJamsCardListPage from "./James/JoinedJams/JoinedJamsPage"
import UbdateJamPage from "./James/CreateJam/Page/CreateJamPage"
import HostJamPage from "./James/CreateJam/Page/CreateJamPage"
import CreateJamPage from "./James/CreateJam/Page/CreateJamPage"
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
                path="/jam-events"
                element={
                  <PrivateRouteVerified>
                    <JamsCardListPage />
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
                path="/jamCard/:jamId"
                element={
                  <PrivateRouteVerified>
                    <JamCardPage />
                  </PrivateRouteVerified>
                }></Route>

              <Route
                path="/created-jams/"
                element={
                  <PrivateRouteVerified>
                    <CreateJamEvent />
                  </PrivateRouteVerified>
                }></Route>
              <Route
                path="/host-jam/"
                element={
                  <PrivateRouteVerified>
                    <CreateJamPage />
                  </PrivateRouteVerified>
                }></Route>

              <Route
                path="/joined-jams"
                element={
                  <PrivateRouteVerified>
                    <JoinedJamsCardListPage />
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
                    <InvitesToJamsCardListPage />
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
