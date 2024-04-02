import React, {ReactNode} from "react"
import {Navigate} from "react-router-dom"
import {useAuthContext} from "../../../../context/AuthContext"

interface PrivateRouteUnverifiedProps {
  children: ReactNode
}

const PrivateRouteUnverified: React.FC<PrivateRouteUnverifiedProps> = ({
  children,
}: PrivateRouteUnverifiedProps) => {
  const {currentUser} = useAuthContext()

  if (!currentUser) {
    return <Navigate to="/login" />
  }

  return <>{children}</>
}

export default PrivateRouteUnverified
