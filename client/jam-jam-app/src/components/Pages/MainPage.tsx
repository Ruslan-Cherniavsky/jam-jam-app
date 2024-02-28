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
import About from "../About/About"
import Signup from "../Auth/Signup/Signup"
import UpdateProfile from "../Auth/UpdateProfileFirebase/UpdateProfileFirebase"
import ForgotPassword from "../Auth/ForgotPassword/ForgotPassword"
import Login from "../Auth/Login/Login"
import PrivateRouteUnverified from "../Auth/PrivateRoutes/PrivateRouteUnverified"
import CheckEmail from "../Auth/CheckEmail/CheckEmail"
import Footer from "../Footer/Footer"
import JoinedJams from "./User/JoinedJams/JoinedJams"
import ProfilePage from "./User/ProfilePage/ProfilePage"
import UbdateProfilePage from "./User/UpdateProfilePage/Page/UbdateProfilePage"
import PrivateRouteUpdateProfile from "../Auth/PrivateRoutes/PrivateRouteUpdateProfile"
import "./MainPage.css"
import HomePage from "./HomePage/HomePage"

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
              // style={{minHeight: "100%"}}
              // className="bg-light text-black d-none d-md-block bg-light sidebar"
              className="sidebar-container bg-light text-black d-none d-md-block bg-light sidebar">
              <Sidebar user={currentUser} />
            </Col>
          )}

          {/* All Page */}

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
              {/* <Route
                path="/"
                element={
                  <PrivateRouteVerified>
                    <HomePage />
                  </PrivateRouteVerified>
                }></Route> */}

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
            <Route path="/about" element={<About />}></Route>
            <Route path="/signup" element={<Signup />}></Route>
          </Routes>
        </Row>
      </Container>
    </>
  )
}
