import React, {useEffect, useState} from "react"
import UpdateProfileFirebase from "../../../../Auth/UpdateProfileFirebase/UpdateProfileFirebase"
import UpdateProfile from "../UpdateProfile/UpdateProfile"
import {useAuthContext} from "../../../../../context/AuthContext"
import {useSelector} from "react-redux"
import {RootState} from "../../../../../redux/store"

export default function UbdateProfilePage() {
  const {
    currentUser,
    updateCurrentPassword,
    reauthenticateCurrentWithCredential,
  } = useAuthContext()
  const [error, setError] = useState<string | null>(null)
  const [loading, setLoading] = useState<boolean>(false)
  const [ifGoogleUser, setifGoogleUser] = useState<boolean>(false)

  const userDataDB = useSelector(
    (state: RootState) => state.userDataMongoDB.allUserData
  )

  useEffect(() => {
    if (
      currentUser &&
      currentUser.providerData[0].providerId === "google.com"
    ) {
      setifGoogleUser(true)
    } else {
      setifGoogleUser(false)
    }
  }, [currentUser])
  return (
    <>
      {userDataDB && <UpdateProfile userDataDB={userDataDB} />}
      {/* {!ifGoogleUser ? <UpdateProfileFirebase /> : null} */}
    </>
  )
}
