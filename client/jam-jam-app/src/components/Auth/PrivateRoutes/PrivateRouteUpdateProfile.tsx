import React, {ReactNode, useState} from "react"
import {Navigate} from "react-router-dom"
import {useAuthContext} from "../../../context/AuthContext"

interface PrivateRouteVerifiedProps {
  children: ReactNode
}

const PrivateRouteUpdateProfile: React.FC<PrivateRouteVerifiedProps> = ({
  children,
}: PrivateRouteVerifiedProps) => {
  const {currentUser} = useAuthContext()

  if (!currentUser?.email) {
    return <Navigate to="/login" />
  }

  if (!currentUser?.emailVerified) {
    return <Navigate to="/check-email" />
  }
  // children is onley update profile component
  return <> {children}</>
}

export default PrivateRouteUpdateProfile
