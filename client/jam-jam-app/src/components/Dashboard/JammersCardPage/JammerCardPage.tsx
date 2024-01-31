import * as React from "react"
import Grid from "@mui/material/Grid"
import Loader from "../../../components_UI/Loaders/Loader"
import Box from "@mui/material/Box"
import {useParams} from "react-router-dom"
import dataAxios from "../../../server/data.axios"
import Card from "../../../components_UI/Profile/Profile"
import {useEffect, useState} from "react"

function JamerCardPage() {
  const [jemerCardId, setJemerCardId] = useState<any>(null)
  const [jemerDataLocal, setJemerDataLocal] = useState<any>(null)
  const params = useParams()

  useEffect(() => {
    setJemerCardId(params.jamerId)
  }, [params])

  useEffect(() => {
    if (jemerCardId) {
      dataAxios.jemerCardDataFetch(jemerCardId).then((data) => {
        setJemerDataLocal(data.user)
      })
    } else {
      return
    }
  }, [jemerCardId])

  return (
    <>
      <Box sx={{flexGrow: 1}}>
        <Grid container spacing={2}>
          <Grid item xl={3} lg={3} md={2} sm={1} xs={0}></Grid>

          <Grid item xl={6} lg={6} md={8} sm={10} xs={12}>
            {jemerDataLocal ? (
              <Card jemerDataLocal={jemerDataLocal} jemerCardId={jemerCardId} />
            ) : (
              <Loader />
            )}
          </Grid>

          <Grid item xl={3} lg={3} md={2} sm={1} xs={0}></Grid>
        </Grid>
      </Box>
    </>
  )
}

export default JamerCardPage
