import * as React from "react"
import Grid from "@mui/material/Grid"
import Loader from "../../../components_UI/Loaders/Loader"
import Box from "@mui/material/Box"
import {useParams} from "react-router-dom"
import dataAxios from "../../../server/data.axios"
import Card from "../../../components_UI/Profile/Profile"
import {useEffect, useState} from "react"
import {useAuthContext} from "../../../context/AuthContext"
import {useSelector} from "react-redux"
import {RootState} from "../../../redux/store"

function Profile() {
  // const [jemerCardId, setJemerCardId] = useState<any>(null)
  // const [jemerDataLocal, setJemerDataLocal] = useState<any>(null)
  // const params = useParams()
  // const {currentUser} = useAuthContext()

  const userIdMongoDB: any = useSelector(
    (state: RootState) => state.userDataMongoDB.allUserData?.userId
  )

  const userDataMongoDB = useSelector(
    (state: RootState) => state.userDataMongoDB.allUserData
  )

  // useEffect(() => {
  //   setJemerCardId(params.jamerId)
  // }, [params])

  // useEffect(() => {
  //   if (currentUser!.email) {
  //     console.log(currentUser!.email)
  //     dataAxios
  //       .jemerCardDataFetchByEmail(currentUser!.email)
  //       .then((userData: any) => {
  //         setJemerDataLocal(userData.user)
  //         setJemerCardId(userData._id)
  //       })
  //   } else {
  //     return
  //   }
  // }, [jemerCardId])

  // useEffect(() => {
  //   console.log("useSelector userIdMongoDB ---- ", userIdMongoDB)
  //   console.log("useSelector userDataMongoDB ---- ", userIdMongoDB)
  // }, [])

  // useEffect(() => {
  //   if (jemerCardId) {
  //     console.log(jemerCardId)
  //     dataAxios.jemerCardDataFetch(jemerCardId).then((data: any) => {
  //       setJemerDataLocal(data.user)
  //     })
  //   } else {
  //     return
  //   }
  // }, [jemerCardId])

  return (
    <Box sx={{flexGrow: 1}}>
      <Grid container spacing={2}>
        <Grid item xl={3} lg={3} md={2} sm={1} xs={0}></Grid>

        <Grid item xl={6} lg={6} md={8} sm={10} xs={12}>
          {userDataMongoDB ? (
            <Card
              jemerDataLocal={userDataMongoDB}
              jemerCardId={userIdMongoDB}
            />
          ) : (
            <Loader />
          )}
        </Grid>

        <Grid item xl={3} lg={3} md={2} sm={1} xs={0}></Grid>
      </Grid>
    </Box>
  )
}

export default Profile
