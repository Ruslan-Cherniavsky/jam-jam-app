import {AuthProvider} from "./context/AuthContext"
import {BrowserRouter as Router} from "react-router-dom"

import Header from "./components/Header/Header"
import {Provider} from "react-redux"
import store from "./redux/store"
import MainPage from "./components/Pages/MainPage"

function App() {
  return (
    <>
      <Provider store={store}>
        <AuthProvider>
          <Router>
            <Header />
            <MainPage />
          </Router>
        </AuthProvider>
      </Provider>
    </>
  )
}

export default App
