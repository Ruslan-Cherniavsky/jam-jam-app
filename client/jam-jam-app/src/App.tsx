import {Container} from "react-bootstrap"
import Signup from "./components/Auth/Signup/Signup"
import {AuthProvider} from "./context/AuthContext"
import {BrowserRouter as Router, Routes, Route} from "react-router-dom"
import Dashbord from "./components/Dashboard/Dashboard"
import Login from "./components/Auth/Login/Login"
import PrivateRouteUnverified from "./components/Auth/PrivateRoutes/PrivateRouteUnverified"
import ForgotPassword from "./components/Auth/ForgotPassword/ForgotPassword"
import UpdateProfile from "./components/Auth/UpdateProfile/UpdateProfile"
import CheckEmail from "./components/Auth/CheckEmail/CheckEmail"
import PrivateRouteVerified from "./components/Auth/PrivateRoutes/PrivateRouteVerified"
import Header from "./components/Header/Header"
import Footer from "./components/Footer/Footer"
import About from "./components/Auth/About/About"
import {Provider} from "react-redux"
import store from "./redux/store"
import JammersTablePage from "./components/Dashboard/JammersTablePage/jammersTablePage"
import JamerCardPage from "./components/Dashboard/JammersCardPage/JammerCardPage"
import Profile from "./components/User/ProfilePage/userProfilePage"
import {CreateJamEvent} from "./components/User/CreateJamEventPage/createJamEvent"
import {MyJamEvent} from "./components/User/JamEventsPage/myJamEvents"
import JammersCardList from "./components_UI/JammersCardList/JammersCardList"
import JammersCardListPage from "./components/Dashboard/JammersCardListPage/JammersCardListPage"

function App() {
  return (
    <>
      <Provider store={store}>
        <AuthProvider>
          <Router>
            <Header />

            <Routes>
              <Route
                path="/"
                element={
                  <PrivateRouteVerified>
                    <JammersTablePage />
                  </PrivateRouteVerified>
                }></Route>

              <Route
                path="/jammersList"
                element={
                  <PrivateRouteVerified>
                    <JammersCardListPage />
                  </PrivateRouteVerified>
                }></Route>

              <Route
                path="/jamerCard/:jamerId"
                element={
                  <PrivateRouteVerified>
                    <JamerCardPage />
                  </PrivateRouteVerified>
                }></Route>

              <Route
                path="/profile"
                element={
                  <PrivateRouteVerified>
                    <Profile />
                  </PrivateRouteVerified>
                }></Route>

              <Route
                path="/create-jam-event/:jamerId"
                element={
                  <PrivateRouteVerified>
                    <CreateJamEvent />
                  </PrivateRouteVerified>
                }></Route>

              <Route
                path="/my-jam-events/:jamerId"
                element={
                  <PrivateRouteVerified>
                    <MyJamEvent />
                  </PrivateRouteVerified>
                }></Route>
            </Routes>

            <Container
              className="d-flex align-items-center justify-content-center"
              style={{minHeight: "100vh"}}>
              <div className="w-100" style={{maxWidth: "400px"}}>
                <Routes>
                  <Route path="/about" element={<About />}></Route>
                  <Route path="/signup" element={<Signup />}></Route>

                  <Route
                    path="/update-profile"
                    element={
                      <PrivateRouteVerified>
                        <UpdateProfile />
                      </PrivateRouteVerified>
                    }></Route>
                  <Route
                    path="/forgot-password"
                    element={<ForgotPassword />}></Route>
                  <Route path="/login" element={<Login />}></Route>
                  <Route
                    path="/check-email"
                    element={
                      <PrivateRouteUnverified>
                        <CheckEmail />
                      </PrivateRouteUnverified>
                    }
                  />
                </Routes>
              </div>
            </Container>
            <Footer />
          </Router>
        </AuthProvider>
      </Provider>
    </>
  )
}

export default App
