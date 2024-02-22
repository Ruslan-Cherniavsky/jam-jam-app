import React, {useEffect, useState} from "react"
import {Alert, Button, Card} from "react-bootstrap"
import {Link, useNavigate} from "react-router-dom"
import {useAuthContext} from "../../context/AuthContext"
import JammersTablePage from "../Pages/Jammers/TablePage/TablePage"

export default function Dashboard() {
  const navigate = useNavigate()
  const [error, setError] = useState<string>("")

  const {currentUser, logout} = useAuthContext()

  async function handleLogOut() {
    setError("")
    try {
      await logout()

      navigate("/login")
    } catch (error) {
      setError("Failed to log out")
    }
  }

  return (
    <>
      <JammersTablePage />
    </>
  )
}
