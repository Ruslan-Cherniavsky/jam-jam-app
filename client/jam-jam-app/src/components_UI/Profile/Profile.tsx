import * as React from "react"
import Grid from "@mui/material/Grid"
import Box from "@mui/material/Box"
import Card from "@mui/material/Card"
import CardActions from "@mui/material/CardActions"
import CardContent from "@mui/material/CardContent"
import Button from "@mui/material/Button"
import Paper from "@mui/material/Paper"
import {styled} from "@mui/material/styles"
import capFirtsLett from "../../helpers/capFirstLett"
import {useSelector, useDispatch} from "react-redux"
import {RootState, AppDispatch} from "../../redux/store"
import {useState, useEffect} from "react"
import {Input} from "@mui/material"
import dataAxios from "../../server/data.axios"

import {setUserName, resetUserName} from "../../redux/reducers/UserDataSlice"
import {useAuthContext} from "../../context/AuthContext"

function JamerCard({
  jemerDataLocal,
  jemerCardId,
}: {
  jemerDataLocal: any
  jemerCardId: any
}) {
  const [currentMode, setCurrentMode] = useState("")
  const [nickName, setNickName] = useState(jemerDataLocal?.userName)
  const [fullName, setFullName] = useState(jemerDataLocal?.firstName)
  const [location, setLocation] = useState(capFirtsLett(jemerDataLocal?.city))
  const [age, setAge] = useState(jemerDataLocal?.age)
  const [gener, setGener] = useState(capFirtsLett(jemerDataLocal?.gender))

  const [musicGener, setMusicGener] = useState(
    capFirtsLett(jemerDataLocal?.musicalGaners[0])
  )
  const [instruments, setInstruments] = useState(
    capFirtsLett(jemerDataLocal?.musicalInstruments[0])
  )
  const [obout, setObout] = useState(jemerDataLocal?.oboutMe)
  const [references, setReferences] = useState(
    capFirtsLett(jemerDataLocal?.references)
  )

  const {currentUser} = useAuthContext()

  // const [currentJammerCardData, setCurrentJammerCardData] = useState<any>("")

  // const globalUserId: any = useSelector(
  //   (state: RootState) => state.userData.userId
  // )

  useEffect(() => {
    console.log(currentUser?.email)

    console.log(jemerDataLocal?._id)
  }, [])

  const useAppDispatch: () => AppDispatch = useDispatch
  const dispatch = useAppDispatch()

  const handleNickNameChange = (e: any) => {
    setNickName(e.target.value)
  }
  const handleFullNameChange = (e: any) => {
    setFullName(e.target.value)
  }
  const handleLocationChange = (e: any) => {
    setLocation(e.target.value)
  }
  const handleAgeChange = (e: any) => {
    setAge(e.target.value)
  }
  const handleGenderChange = (e: any) => {
    setGener(e.target.value)
  }
  const handleMusicGenerChange = (e: any) => {
    setMusicGener(e.target.value)
  }
  const handleInstrumentsChange = (e: any) => {
    setInstruments(e.target.value)
  }
  const handleOboutChange = (e: any) => {
    setObout(e.target.value)
  }
  const handleReferencesChange = (e: any) => {
    setReferences(e.target.value)
  }

  const Item = styled(Paper)(({theme}) => ({
    backgroundColor: theme.palette.mode === "dark" ? "#1A2027" : "#fff",
    ...theme.typography.body2,
    padding: theme.spacing(1),
    color: theme.palette.text.primary,
  }))

  const ItemImg = styled(Paper)(({theme}) => ({
    backgroundColor: theme.palette.mode === "dark" ? "#1A2027" : "#fff",
    ...theme.typography.body2,
    padding: theme.spacing(8),
    textAlign: "center",
    color: theme.palette.text.primary,
  }))

  const ItemOboutMe = styled(Paper)(({theme}) => ({
    backgroundColor: theme.palette.mode === "dark" ? "#1A2027" : "#fff",
    ...theme.typography.body2,
    padding: theme.spacing(1),
    height: "300px",
    textAlign: "left",
    color: theme.palette.text.primary,
  }))

  const ItemInflu = styled(Paper)(({theme}) => ({
    backgroundColor: theme.palette.mode === "dark" ? "#1A2027" : "#fff",
    ...theme.typography.body2,
    padding: theme.spacing(1),
    height: "300px",

    textAlign: "left",
    color: theme.palette.text.primary,
  }))

  const FriendsJams = styled(Paper)(({theme}) => ({
    backgroundColor: theme.palette.mode === "dark" ? "#1A2027" : "#fff",
    ...theme.typography.body2,
    padding: theme.spacing(0.3),

    textAlign: "left",
    color: theme.palette.text.primary,
  }))

  const editProfile = () => {
    setCurrentMode("Edit Mode")
  }
  const saveProfile = async () => {
    setCurrentMode("")

    const payload = {
      userName: nickName,
      firstName: fullName,
      country: location,
      age: age,
      gender: gener,
      musicalGaners: musicGener,
      musicalInstruments: instruments,
      references: references,
      oboutMe: obout,
    }

    const data = await dataAxios.userCardDataUpdate(
      jemerDataLocal?._id,
      payload
    )
    setCurrentMode("")

    // const jammerCardData = await dataAxios.jemerCardDataFetch(
    //   jemerDataLocal?._id
    // )
    // setCurrentJammerCardData(jammerCardData["user"])
  }

  // useEffect(() => {
  //   const usernameUpdate = async () => {
  //     console.log(currentJammerCardData.userName)
  //     const userData = await dataAxios.userDataFetch()
  //     const jammerCardData = await dataAxios.jemerCardDataFetch(userData._id)

  //     // if  (userData['user'].userName === jemerCardId) {
  //     setCurrentJammerCardData(jammerCardData["user"])

  //     dispatch(resetUserName())
  //     dispatch(setUserName(currentJammerCardData.userName))
  //     // } else {
  //     //   return
  //     // }
  //   }

  //   usernameUpdate()
  // }, [currentJammerCardData.userName])

  return (
    <>
      <Card sx={{minWidth: 275}}>
        {currentMode === "Edit Mode" ? (
          <CardContent>
            <Box sx={{flexGrow: 1}}>
              <Grid container spacing={2}>
                <Grid item xs={4}>
                  <ItemImg>IMG</ItemImg>
                </Grid>

                <Grid item xs={4}>
                  <div>
                    <span className="secTex">Nick Name: </span>
                    <Input
                      className="inputCard"
                      onChange={handleNickNameChange}
                      value={nickName}
                    />
                  </div>

                  <div className="itemConected">
                    <span className="secTex"> Full Name: </span>
                    <Input
                      className="inputCard"
                      onChange={handleFullNameChange}
                      value={fullName}
                    />
                  </div>

                  <div>
                    <span className="secTex">I'm from:</span>
                    <Input
                      className="inputCard"
                      onChange={handleLocationChange}
                      value={location}
                    />
                  </div>
                </Grid>

                <Grid item xs={4}>
                  <div>
                    <span className="secTex">Age:</span>
                    <Input
                      className="inputCard"
                      onChange={handleAgeChange}
                      value={age}
                    />
                  </div>

                  <div className="itemConected">
                    <span className="secTex">Gender: </span>
                    <Input
                      className="inputCard"
                      onChange={handleGenderChange}
                      value={gener}
                    />
                  </div>

                  <FriendsJams>
                    <span className="secTex">--See My:</span>
                    <Button size="small">Jam-Events</Button>
                    <Button size="small">Friends</Button>
                  </FriendsJams>
                </Grid>

                <Grid item xs={6}>
                  <div>
                    <span className="secTex"> Music Geners: </span>
                    <Input
                      className="inputCard"
                      onChange={handleMusicGenerChange}
                      value={musicGener}
                    />{" "}
                  </div>
                </Grid>

                <Grid item xs={6}>
                  <div>
                    <span className="secTex">I'm playing: </span>
                    <Input
                      className="inputCard"
                      onChange={handleInstrumentsChange}
                      value={instruments}
                    />{" "}
                  </div>
                </Grid>

                <Grid item xs={8}>
                  <div>
                    <span className="secTex">Obout Me:</span>
                    <br></br>
                    <br></br>
                    <Input
                      className="inputCard"
                      onChange={handleOboutChange}
                      value={obout}
                    />
                  </div>
                </Grid>

                <Grid item xs={4}>
                  <div>
                    <span className="secTex"> References: </span>
                    <br></br>
                    <br></br>
                    <Input
                      className="inputCard"
                      onChange={handleReferencesChange}
                      value={references}
                    />
                  </div>
                </Grid>
              </Grid>
            </Box>
          </CardContent>
        ) : (
          <CardContent>
            <Box sx={{flexGrow: 1}}>
              <Grid container spacing={2}>
                <Grid item xs={4}>
                  <ItemImg>IMG</ItemImg>
                </Grid>

                <Grid item xs={4}>
                  <Item>
                    <span className="secTex">Nick Name: </span>
                    {nickName}
                  </Item>

                  <Item className="itemConected">
                    <span className="secTex"> Full Name: </span>
                    {fullName} {capFirtsLett(jemerDataLocal?.lastName)}
                  </Item>

                  <Item>
                    <span className="secTex">I'm from:</span> {location}{" "}
                    {jemerDataLocal?.country}
                  </Item>
                </Grid>

                <Grid item xs={4}>
                  <Item>
                    <span className="secTex">Age:</span> {age}
                  </Item>

                  <Item className="itemConected">
                    <span className="secTex">Gender: </span> {gener}
                  </Item>

                  <FriendsJams>
                    <span className="secTex">--See My:</span>
                    <Button size="small">Jam-Events</Button>
                    <Button size="small">Friends</Button>
                  </FriendsJams>
                </Grid>

                <Grid item xs={6}>
                  <Item>
                    <span className="secTex"> Music Geners: </span>
                    {musicGener}{" "}
                  </Item>
                </Grid>

                <Grid item xs={6}>
                  <Item>
                    <span className="secTex">I'm playing: </span> {instruments}{" "}
                  </Item>
                </Grid>

                <Grid item xs={8}>
                  <ItemOboutMe>
                    <span className="secTex">Obout Me:</span>
                    <br></br>
                    <br></br>
                    {obout}
                  </ItemOboutMe>
                </Grid>

                <Grid item xs={4}>
                  <ItemInflu>
                    <span className="secTex"> References: </span>
                    <br></br>
                    <br></br>
                    {references}
                  </ItemInflu>
                </Grid>
              </Grid>
            </Box>
          </CardContent>
        )}

        {currentUser?.email != jemerDataLocal?.email ? (
          <CardActions>
            <Button size="small">Invite to jam-evant</Button>
            <Button size="small">Add to friends</Button>
            <Button size="small">Send Message</Button>
            <Button size="small">unfriend</Button>
          </CardActions>
        ) : (
          <CardActions>
            {currentMode != "Edit Mode" ? (
              <Button size="small" onClick={editProfile}>
                Edit Profile
              </Button>
            ) : null}

            {currentMode === "Edit Mode" ? (
              <Button size="small" onClick={saveProfile}>
                Seve Changes
              </Button>
            ) : null}
          </CardActions>
        )}
      </Card>
    </>
  )
}

export default JamerCard
