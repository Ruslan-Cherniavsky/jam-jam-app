import React, {ReactNode, useEffect, useState} from "react"
import {Navigate} from "react-router-dom"
import {useAuthContext} from "../../../../context/AuthContext"
import {useDispatch, useSelector} from "react-redux"
import {RootState} from "../../../../redux/store"
import dataAxios from "../../../../server/data.axios"
import {setUserDataMongoDB} from "../../../../redux/reducers/UserDataSliceMongoDB"
import {setFriendRequestsNumber} from "../../../../redux/reducers/UserNotifications"

interface PrivateRouteVerifiedProps {
  children: ReactNode
}

const PrivateRouteVerified: React.FC<PrivateRouteVerifiedProps> = ({
  children,
}: PrivateRouteVerifiedProps) => {
  const {currentUser} = useAuthContext()
  // const dispatch = useDispatch()
  const dispatch = useDispatch()

  const userName = useSelector(
    (state: RootState) => state.userDataMongoDB.allUserData?.userName
  )
  const [shouldRedirect, setShouldRedirect] = useState(false)

  useEffect(() => {
    if (!userName) {
      // console.log("working**********fetch to riderection")
      if (currentUser && currentUser.emailVerified) {
        dataAxios
          .jemerCardDataFetchByEmail(currentUser.email)
          .then((userData: any) => {
            if (
              !userData.data.user.userName ||
              !userData.data.user.country ||
              !userData.data.user.instruments ||
              !userData.data.user.genres
            ) {
              setShouldRedirect(true)
            }
          })
      }
    } else {
      setShouldRedirect(false)
      if (currentUser && currentUser.emailVerified) {
        dataAxios
          .jemerCardDataFetchByEmail(currentUser.email)
          .then((userData: any) => {
            if (userData.data.user._id) {
              dataAxios
                .getAllFriendRequestsByReceiverId(userData.data.user._id)
                .then((dataAll: any) => {
                  dispatch(
                    setFriendRequestsNumber(dataAll.friendRequests.length)
                  )
                })

              //dataAxios.jams requests + dispatch
              //dataAxios.jams invates + dispatch
            }
          })
      }
    }
  }, [userName])

  if (!currentUser?.emailVerified) {
    return <Navigate to="/check-email" />
  } else if (shouldRedirect) {
    return <Navigate to="/update-profile" />
  } else {
    return <>{currentUser.emailVerified && userName && children}</>
  }
}

export default PrivateRouteVerified
