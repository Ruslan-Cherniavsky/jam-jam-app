import {Col, Container, Row} from "react-bootstrap"
import Signup from "./components/Auth/Signup/Signup"
import {AuthProvider, useAuthContext} from "./context/AuthContext"
import {BrowserRouter as Router, Routes, Route} from "react-router-dom"
import Dashbord from "./components/Dashboard/Dashboard"
import Login from "./components/Auth/Login/Login"
import PrivateRouteUnverified from "./components/Auth/PrivateRoutes/PrivateRouteUnverified"
import ForgotPassword from "./components/Auth/ForgotPassword/ForgotPassword"
import UpdateProfile from "./components/Auth/UpdateProfileFirebase/UpdateProfileFirebase"
import CheckEmail from "./components/Auth/CheckEmail/CheckEmail"
import PrivateRouteVerified from "./components/Auth/PrivateRoutes/PrivateRouteVerified"
import Header from "./components/Header/Header"
import Footer from "./components/Footer/Footer"
import About from "./components/About/About"
import {Provider} from "react-redux"
import store from "./redux/store"
import MainPage from "./components/Pages/MainPage"

function App() {
  const user = {
    img: "path/to/profile-picture.jpg",
    userName: "Your Name",
  }
  // const {login, signInWithGoogle} = useAuthContext()

  return (
    <>
      <Provider store={store}>
        <AuthProvider>
          <Router>
            <Header />
            <MainPage />
            {/* <Footer /> */}
          </Router>
        </AuthProvider>
      </Provider>
    </>
  )
}

export default App
