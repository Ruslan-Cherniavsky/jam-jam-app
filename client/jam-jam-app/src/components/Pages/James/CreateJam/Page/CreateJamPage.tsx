import React, {useEffect, useState} from "react"
import UpdateProfileFirebase from "../../../Auth/UpdateProfileFirebase/UpdateProfileFirebase"
import CreateJam from "../CreateJamInputs/CreateJam"
import {useAuthContext} from "../../../../../context/AuthContext"
import {useSelector} from "react-redux"
import {RootState} from "../../../../../redux/store"

export default function CreateJamPage() {
  const {currentUser} = useAuthContext()
  // const [error, setError] = useState<string | null>(null)
  // const [loading, setLoading] = useState<boolean>(false)
  // const [ifGoogleUser, setifGoogleUser] = useState<boolean>(false)

  const userDataDB = useSelector(
    (state: RootState) => state.userDataMongoDB.allUserData
  )

  // useEffect(() => {
  //   if (
  //     currentUser &&
  //     currentUser.providerData[0].providerId === "google.com"
  //   ) {
  //     setifGoogleUser(true)
  //   } else {
  //     setifGoogleUser(false)
  //   }
  // }, [currentUser])

  return (
    <>
      {/* {userDataDB && <UpdateProfile userDataDB={userDataDB} />} */}
      <CreateJam />
      {/* {!ifGoogleUser ? <UpdateProfileFirebase /> : null} */}
    </>
  )
}
