import {useEffect} from "react"
import MainTable from "../../../../components_UI/Table/Table"
import Grid from "@mui/material/Grid"
import Box from "@mui/material/Box"
import Loader from "../../../../components_UI/Loaders/Loader"
import {useSelector, useDispatch} from "react-redux"
import {RootState, AppDispatch} from "../../../../redux/store"
import {setUsersData} from "../../../../redux/reducers/JammersDataSliceMongoDB"
import dataAxios from "../../../../server/data.axios"

function JammersTablePage() {
  const useAppDispatch: () => AppDispatch = useDispatch
  const dispatch = useAppDispatch()

  const dataLocal = useSelector((state: RootState) => state.usersData.data)

  useEffect(() => {
    dataAxios.dataFetch().then((data) => {
      dispatch(setUsersData(data.users))
      console.log(data.users)
    })
  }, [])

  return (
    <>
      (
      <Box sx={{flexGrow: 1}}>
        <Grid container spacing={2}>
          <Grid item xl={2} lg={2} md={1} sm={0} xs={0}></Grid>

          <Grid
            item
            xl={8}
            lg={8}
            md={10}
            sm={12}
            xs={12}
            className="center-align">
            {dataLocal.length > 1 ? <MainTable rows={dataLocal} /> : <Loader />}
          </Grid>

          <Grid item xl={2} lg={2} md={1} sm={0} xs={0}></Grid>
        </Grid>
      </Box>
      )
    </>
  )
}

export default JammersTablePage
