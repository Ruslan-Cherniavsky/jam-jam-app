import React, {ReactNode, useState} from "react"
import {Navigate} from "react-router-dom"
import {useAuthContext} from "../../../context/AuthContext"

interface PrivateRouteVerifiedProps {
  children: ReactNode
}

const PrivateRouteVerified: React.FC<PrivateRouteVerifiedProps> = ({
  children,
}: PrivateRouteVerifiedProps) => {
  const {currentUser} = useAuthContext()

  if (!currentUser?.emailVerified) {
    return <Navigate to="/check-email" />
  }

  return <> {children}</>
}

export default PrivateRouteVerified
