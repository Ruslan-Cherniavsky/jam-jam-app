import * as React from "react"
import Grid from "@mui/material/Grid"
import Loader from "../../../../components_UI/Loaders/Loader"
import Box from "@mui/material/Box"
import {useParams} from "react-router-dom"
import dataAxios from "../../../../server/data.axios"
import Profile from "../../Jammers/Profile/Profile"
import {useEffect, useState} from "react"
import {Col} from "react-bootstrap"
import {useAuthContext} from "../../../../context/AuthContext"
import {useSelector} from "react-redux"
import {RootState} from "../../../../redux/store"

function ProfilePage() {
  const [jemerCardId, setJemerCardId] = useState<any>(null)
  const [jemerDataLocal, setJemerDataLocal] = useState<any>(null)

  const dataLocal = useSelector(
    (state: RootState) => state.userDataMongoDB.allUserData
  )

  useEffect(() => {
    console.log(dataLocal)
    setJemerDataLocal(dataLocal)
  }, [jemerCardId])

  return (
    <>
      <Col>
        {jemerDataLocal ? <Profile jammer={jemerDataLocal} /> : <Loader />}
      </Col>
    </>
  )
}

export default ProfilePage
