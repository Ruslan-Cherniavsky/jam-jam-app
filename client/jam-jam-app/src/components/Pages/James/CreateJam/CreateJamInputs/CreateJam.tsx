import React, {useState, FormEvent, useEffect, ChangeEvent} from "react"
import {Form, Button, Card, Alert, Col, Container, Row} from "react-bootstrap"
import {useNavigate} from "react-router-dom"
import {auth} from "../../../../../services/firebaseConfig"
import dataAxios from "../../../../../server/data.axios"
import {useDispatch, useSelector} from "react-redux"
import MultiSelect from "../../../../../components_UI/MultiSelect/Multiselect"
import {
  UserDataSliceMongoDB,
  setUserDataMongoDB,
} from "../../../../../redux/reducers/UserDataSliceMongoDB"
import {Country, State, City} from "country-state-city"
import "./CreateJam.css"
import DatePicker from "react-datepicker"
import "react-datepicker/dist/react-datepicker.css"
import ImageUploaderCrop from "../ImageUploader/ImageUploaderCrop"
import {RootState} from "../../../../../redux/store"

interface Jam {
  _id: string
  img: string
  jamName: string
  hostedBy: string
  jamDate: string
  country: string
  isoCode: string
  city: string
  region: string
  type: string
  entrance: string
  tune: string
  jamDescription: string
  genres: Array<{
    _id: string
    genre: string
  }>
  sharedInstruments: Array<{
    _id: string
    instrument: string
  }>
  jammers: Array<{
    instrument: string
    maxNumberOfJammers: number
    jammersId: string[]
    _id: string
  }>
  audience: string[]
  reports: any[]
  createdAt: string
  __v: number
  ifCanceled: boolean
  jamTime: number
  status: string
}

export default function CreateJam({jam}: {jam?: Jam | null}) {
  const navigate = useNavigate()

  const [jamName, setJamName] = useState(jam?.jamName || "")
  const [jamDate, setJamDate] = useState(
    jam?.jamDate ? new Date(jam?.jamDate) : null
  )
  const [country, setCountry] = useState(jam?.country || "")
  const [isoCode, setIsoCode] = useState(jam?.isoCode || "")
  const [city, setCity] = useState(jam?.city || "")
  const [region, setRegion] = useState(jam?.region || "")
  const [type, setType] = useState(jam?.type || "")
  const [entrance, setEntrance] = useState(jam?.entrance || "")
  const [tune, setTune] = useState(jam?.tune || "")
  const [jamDescription, setJamDescription] = useState(
    jam?.jamDescription || ""
  )
  const [genres, setGenres] = useState<string[]>([])
  const [sharedInstruments, setSharedInstruments] = useState<string[]>([])
  const [jammers, setJammers] = useState<any[]>([])
  const [audience, setAudience] = useState<string[]>([])
  const [reports, setReports] = useState<any[]>([])
  const [imageURL, setImageURL] = useState(jam?.img || "")

  const [error, setError] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)
  const [message, setMessage] = useState<string | null>(null)

  const [selectedInstruments, setSelectedInstruments] = useState<Array<Object>>(
    jam?.sharedInstruments || []
  )
  const [selectedGenres, setSelectedGenres] = useState<Array<Object>>(
    jam?.genres || []
  )

  function selectedGenresCB(genres: Array<string>) {
    setSelectedGenres(genres)
  }
  function selectedInstrumentsCB(sharedInstruments: Array<string>) {
    setSelectedInstruments(sharedInstruments)
  }

  const dataLocal = useSelector(
    (state: RootState) => state.userDataMongoDB.allUserData
  )

  type InputChangeEvent = ChangeEvent<HTMLInputElement>
  type SelectChangeEvent = ChangeEvent<HTMLSelectElement>
  type InputChangeTextArea = ChangeEvent<HTMLTextAreaElement>

  const dispatch = useDispatch()

  useEffect(() => {
    try {
      dataAxios.genresFetch().then((data: any) => {
        setGenres(data.genres)
      })

      dataAxios.instrumentsFetch().then((data: any) => {
        setSharedInstruments(data.instruments)
      })
    } catch (error) {
      console.error(error)
    }
  }, [])

  // useEffect(() => {
  //   if (
  //     !jamName ||
  //     !country ||
  //     !sharedInstruments ||
  //     !genres ||
  //     !imageURL ||
  //     !country
  //   ) {
  //     setMessage("Please create your profile")
  //   }
  // }, [])

  const handleCountryChange = (e: InputChangeEvent) => {
    const selectedCountryCode = e.target.value
    const selectedCountry = Country.getAllCountries().find(
      (country) => country.isoCode === selectedCountryCode
    )

    setCountry(selectedCountry?.name || "")
    setIsoCode(selectedCountry?.isoCode || "")
    setRegion("")
    setCity("")

    // console.log(selectedCountry?.name);
  }

  const handleRegionChange = (e: InputChangeEvent) => {
    setRegion(e.target.value || "")
    setCity("")
  }

  const handleCityChange = (e: InputChangeEvent) => {
    setCity(e.target.value || "")
  }

  const handleTypeChange = (e: SelectChangeEvent) => {
    setType(e.target.value)
  }

  const handleJamNameChange = (e: InputChangeEvent) => {
    setJamName(e.target.value)
  }

  // const handleEntranceChange = (e: InputChangeEvent) => {
  //   setEntrance(e.target.value)
  // }

  // const handleTuneChange = (e: InputChangeEvent) => {
  //   setTune(e.target.value)
  // }

  const handleJamDescriptionChange = (e: InputChangeTextArea) => {
    setJamDescription(e.target.value)
  }

  function handleImageURL(newImageURL: string) {
    return setImageURL(newImageURL)
  }

  function handleSubmit(e: FormEvent) {
    e.preventDefault()
    try {
      setLoading(true)
      setError("")

      const newJam = {
        jamName,
        jamDate: jamDate?.toISOString() ?? "",
        country,
        isoCode,
        city,
        region,
        type,
        hostedBy: dataLocal?._id,
        // entrance,
        // tune,
        jamDescription,
        genres: selectedGenres,
        sharedInstruments: selectedInstruments,
        // jammers,
        // audience,
        // reports,
        img: imageURL,
      }

      if (!jamDate) {
        setError("Please select the date of the jam.")
        return
      }

      if (imageURL === "") {
        setError("Please upload an image for the jam.")
        return
      }

      const response = dataAxios.createJam(newJam)
      console.log(newJam)
      // Post newJamRequest to the backend
      // dataAxios.createJamRequest(newJamRequest)

      // navigate("/")
    } catch (error: any) {
      console.log(error)

      if (error.code === "auth/email-already-in-use") {
        setError(
          "The email address is already in use. Please use a different email."
        )
      } else {
        setError("Failed to create the jam request. Please try again.")
      }
    } finally {
      setLoading(false)
    }
  }

  return (
    <>
      <Container
        style={{padding: "0px 0px 20px 0px"}}
        className="container mt-4">
        <Card>
          <Card.Header>
            <h2>Create Jam</h2>
          </Card.Header>
          <Card.Body>
            {error && <Alert variant="danger">{error}</Alert>}
            {message && <Alert variant="info">{message}</Alert>}
            <Form onSubmit={handleSubmit}>
              <Row className="d-flex justify-content-center">
                <Col xl={4} lg={7} md={6} sm={12}>
                  <ImageUploaderCrop
                    handleImageURL={handleImageURL}
                    currentURL={jam?.img}
                  />
                  <br />
                </Col>

                <Col xl={4} lg={6} md={9} sm={12}>
                  <Form.Group id="jamName">
                    <Form.Label>Jam Name</Form.Label>
                    <Form.Control
                      type="text"
                      value={jamName}
                      onChange={handleJamNameChange}
                      required
                    />
                  </Form.Group>
                  <br />

                  <Form.Group controlId="jamDate">
                    <Form.Label>Jam Date</Form.Label>
                    <DatePicker
                      selected={jamDate}
                      onChange={(date: Date) => setJamDate(date)}
                      showTimeSelect
                      timeFormat="HH:mm"
                      timeIntervals={15}
                      timeCaption="time"
                      dateFormat="MMMM d, yyyy h:mm aa"
                      className="form-control"
                      required
                    />
                  </Form.Group>
                  <br />

                  <Form.Group controlId="countries">
                    <Form.Label>Select Country:</Form.Label>
                    <Form.Control
                      as="select"
                      required
                      onChange={handleCountryChange}
                      value={isoCode}>
                      <option value="" disabled>
                        Select country
                      </option>
                      {Country.getAllCountries().map((country) => (
                        <option key={country.isoCode} value={country.isoCode}>
                          {country.name}
                        </option>
                      ))}
                    </Form.Control>
                  </Form.Group>
                  <br />

                  <Form.Group controlId="regions">
                    <Form.Label>Select Region:</Form.Label>
                    <Form.Control
                      as="select"
                      onChange={handleRegionChange}
                      value={region}>
                      <option value="" disabled>
                        Select region
                      </option>
                      {State.getStatesOfCountry(isoCode).map((state) => (
                        <option key={state.isoCode} value={state.isoCode}>
                          {state.name}
                        </option>
                      ))}
                    </Form.Control>
                  </Form.Group>
                  <br />

                  <Form.Group controlId="cities">
                    <Form.Label>Select City:</Form.Label>
                    <Form.Control
                      as="select"
                      onChange={handleCityChange}
                      value={city}>
                      <option value="" disabled>
                        Select city
                      </option>
                      {City.getCitiesOfState(isoCode, region).map((city) => (
                        <option key={city.name} value={city.name}>
                          {city.name}
                        </option>
                      ))}
                    </Form.Control>
                  </Form.Group>

                  <br />
                  <Row>
                    <Col lg={6} sm={6} xs={6}>
                      <Form.Group controlId="type">
                        <Form.Label>Type</Form.Label>
                        <Form.Select
                          value={type}
                          onChange={handleTypeChange}
                          required>
                          <option value="" disabled>
                            Select Type
                          </option>
                          <option value="indoor">Indoor</option>
                          <option value="outdoor">Outdoor</option>
                        </Form.Select>
                      </Form.Group>
                    </Col>

                    {/* <Col lg={6} sm={6} xs={6}>
                      <Form.Group controlId="entrance">
                        <Form.Label>Entrance</Form.Label>
                        <Form.Control
                          type="text"
                          value={entrance}
                          onChange={handleEntranceChange}
                          required
                        />
                      </Form.Group>
                    </Col> */}
                  </Row>
                  <br />
                  {/* <Col lg={6} sm={6} xs={6}>
                      <Form.Group controlId="tune">
                        <Form.Label>Tune</Form.Label>
                        <Form.Control
                          type="text"
                          value={tune}
                          onChange={handleTuneChange}
                          required
                        />
                      </Form.Group>
                    </Col> */}

                  <Col md={12} lg={12} xl={12} xs={12} sm={12}>
                    {/* <hr /> */}
                    <MultiSelect
                      ifRequired={true}
                      dataArray={genres}
                      selectionName="genre"
                      selectedDB={jam?.genres || []}
                      selectedCallbackFn={selectedGenresCB}
                    />
                  </Col>

                  <div className="d-none d-md-block">
                    <div style={{marginTop: "8px"}}></div>
                  </div>

                  <Col md={12} lg={12} xl={12} xs={12} sm={12}>
                    <br></br>
                    <MultiSelect
                      ifRequired={true}
                      dataArray={sharedInstruments}
                      selectionName="instrument"
                      selectedDB={jam?.sharedInstruments || []}
                      selectedCallbackFn={selectedInstrumentsCB}
                    />
                  </Col>
                  <br />
                  <Row></Row>

                  <Form.Group controlId="jamDescription">
                    <Form.Label>Jam Description</Form.Label>
                    <Form.Control
                      value={jamDescription}
                      style={{height: "133px", marginBottom: "17px"}}
                      as="textarea"
                      onChange={handleJamDescriptionChange}
                      required
                    />
                  </Form.Group>

                  <Button
                    variant="outline-dark"
                    style={{marginTop: "14px"}}
                    disabled={loading}
                    className="w-100"
                    type="submit">
                    {loading ? "Creating Jam Request..." : "Create Jam Request"}
                  </Button>
                </Col>
              </Row>
            </Form>
          </Card.Body>
        </Card>
      </Container>
    </>
  )
}

// import React, {useState, FormEvent, useEffect, ChangeEvent} from "react"
// import {Form, Button, Card, Alert, Col, Container, Row} from "react-bootstrap"
// import {useNavigate} from "react-router-dom"
// import {auth} from "../../../../../services/firebaseConfig"
// import dataAxios from "../../../../../server/data.axios"
// import {useDispatch} from "react-redux"
// import MultiSelect from "../../../../../components_UI/MultiSelect/Multiselect"
// import {
//   UserDataSliceMongoDB,
//   setUserDataMongoDB,
// } from "../../../../../redux/reducers/UserDataSliceMongoDB"
// import {Country, State, City} from "country-state-city"
// import "./CreateJam.css"
// import DatePicker from "react-datepicker"
// import "react-datepicker/dist/react-datepicker.css"
// import ImageUploaderCrop from "../ImageUploader/ImageUploaderCrop"

// export default function CreateJam({
//   jam,
// }: {
//   jam?: UserDataSliceMongoDB | null
// }) {
//   const navigate = useNavigate()

//   const [userName, setUserName] = useState(jam?.userName || "")
//   const [firstName, setFirstName] = useState(jam?.firstName || "")
//   const [lastName, setLastName] = useState(jam?.lastName || "")
//   const [age, setAge] = useState(jam?.age || "")
//   const [gender, setGender] = useState(jam?.gender || "")
//   const [aboutMe, setAboutMe] = useState(jam?.oboutMe || "")
//   const [imageURL, setImageURL] = useState(jam?.img || "")

//   const [dob, setDob] = useState(
//     jam?.dob ? new Date(jam?.dob) : null
//   )

//   //------------ Array Selection Names ---------------------------------

//   const [genres, setGenres] = useState<Array<Object>>([])
//   const [instruments, setInstruments] = useState<Array<Object>>([])

//   //------------ Array Selected from DB ---------------------------------

//   const [selectedInstruments, setSelectedInstruments] = useState<Array<Object>>(
//     jam?.instruments || []
//   )
//   const [selectedGenres, setSelectedGenres] = useState<Array<Object>>(
//     jam?.genres || []
//   )

//   //----------------Select Countries----------------------------

//   const [selectedCountry, setSelectedCountry] = useState<string | null>(
//     jam?.isoCode || ""
//   )
//   const [selectedRegion, setSelectedRegion] = useState<string | null>(
//     jam?.region || ""
//   )
//   const [selectedCity, setSelectedCity] = useState<string | null>(
//     jam?.city || ""
//   )

//   const [fullCountryName, setFullCountryName] = useState<string | null>(
//     jam?.country || ""
//   )

//   //---------------- Status -----------------------------------

//   const [error, setError] = useState<string | null>(null)
//   const [loading, setLoading] = useState(false)
//   const [message, setMessage] = useState<string | null>(null)

//   const [ifUserHaveValidDataInDB, setIfUserHaveValidDataInDB] = useState(true)

//   //---------------- Types ------------------------------------

//   type InputChangeEvent = ChangeEvent<HTMLInputElement>
//   type SelectChangeEvent = ChangeEvent<HTMLSelectElement>
//   type InputChangeTextArea = React.ChangeEvent<HTMLTextAreaElement>

//   //------------- On cklick handles----------------------------

//   const handleUserNameChange = (e: InputChangeEvent) => {
//     setUserName(e.target.value)
//   }

//   const handleFirstNameChange = (e: InputChangeEvent) => {
//     setFirstName(e.target.value)
//   }

//   const handleLastNameChange = (e: InputChangeEvent) => {
//     setLastName(e.target.value)
//   }

//   //-------countries

//   const handleCountryChange = (e: InputChangeEvent) => {
//     const selectedCountryCode = e.target.value
//     const selectedCountry = Country.getAllCountries().find(
//       (country) => country.isoCode === selectedCountryCode
//     )

//     setSelectedCountry(selectedCountry?.isoCode || "")
//     setFullCountryName(selectedCountry?.name || "")
//     setSelectedRegion(null)
//     setSelectedCity(null)

//     // console.log(selectedCountry?.name)
//   }

//   const handleRegionChange = (e: InputChangeEvent) => {
//     setSelectedRegion(e.target.value || "")
//     setSelectedCity(null)
//   }

//   const handleCityChange = (e: InputChangeEvent) => {
//     setSelectedCity(e.target.value || "")
//   }

//   //-----------

//   const ageOptions = Array.from({length: 82}, (_, index) => 18 + index)
//   const handleAgeChange = (e: SelectChangeEvent) => {
//     setAge(Number(e.target.value))
//   }

//   const handleTypeChange = (e: SelectChangeEvent) => {
//     setGender(e.target.value)
//   }

//   const handleAboutMeChange = (e: InputChangeTextArea) => {
//     setAboutMe(e.target.value)
//   }

//   const dispatch = useDispatch()

//   //--------------- Genres / Instruments Fetch (For Multiselect) -------

//   useEffect(() => {
//     try {
//       dataAxios.genresFetch().then((data: any) => {
//         setGenres(data.genres)
//       })

//       dataAxios.instrumentsFetch().then((data: any) => {
//         console.log(data)
//         setInstruments(data.instruments)
//       })
//     } catch (error) {
//       console.error(error)
//     }
//   }, [])

//   //--------------- user valid data in DB validation -------

//   useEffect(() => {
//     if (
//       !userName ||
//       !fullCountryName ||
//       !selectedInstruments ||
//       !selectedGenres ||
//       !imageURL ||
//       !fullCountryName
//     ) {
//       setIfUserHaveValidDataInDB(false)
//       console.log(
//         "***************curent setIfUserHaveValidDataInDB status is false"
//       )
//       setMessage("Please create your profile")
//     }
//   }, [])

//   //------------------------ CallBack Functions -------------------------

//   function selectedGenresCB(genres: Array<string>) {
//     setSelectedGenres(genres)
//   }
//   function selectedInstrumentsCB(instrumrnts: Array<string>) {
//     setSelectedInstruments(instrumrnts)
//   }

//   function handleImageURL(newImageURL: string) {
//     return setImageURL(newImageURL)
//   }

//   //------------------------------SUBMIT---------------------------------

//   async function handleSubmit(e: FormEvent) {
//     console.log("current aray", jam?.instruments)

//     e.preventDefault()
//     try {
//       setLoading(true)
//       setError("")

//       const userData = {
//         userName,
//         firstName,
//         lastName,
//         country: fullCountryName,
//         region: selectedRegion,
//         city: selectedCity,
//         isoCode: selectedCountry,
//         genres: selectedGenres,
//         instruments: selectedInstruments,
//         oboutMe: aboutMe,
//         img: imageURL,
//         gender,
//         dob: dob?.toISOString() ?? "",
//       }

//       if (!dob) {
//         setError("Please select your date of birth.")
//         return
//       }
//       if (!aboutMe) {
//         setError("Please write something about yourself.")
//         return
//       }

//       if (imageURL === "") {
//         setError("Please upload your picture.")
//         return
//       }

//       const today = new Date()
//       const age = today.getFullYear() - dob.getFullYear()
//       const monthDiff = today.getMonth() - dob.getMonth()

//       if (age > 18 || (age === 18 && monthDiff >= 0)) {
//         setError("")
//       } else {
//         setError("You must be 18 years or older to register.")
//         return
//       }

//       // ------------------- Usernames Validation ------------------------

//       const usernamesFromDB = await dataAxios.usernamesDataFetch()

//       if (
//         usernamesFromDB.usernames.some(
//           (result: any) =>
//             result.userName === userName && result._id !== jam?._id
//         )
//       ) {
//         return setError("User name exist, please try different name.")
//       }
//       if (userName.length < 3) {
//         setError("Username must have a minimum of 3 characters.")
//       } else {
//         setError("")
//       }

//       //----------------------UPDATE USER!--------------------

//       if (jam?.email === auth.currentUser?.email) {
//         await dataAxios.userCardDataUpdate(jam?._id, userData)
//         const updatedUserData = await dataAxios.jemerCardDataFetchByEmail(
//           jam?.email
//         )
//         dispatch(setUserDataMongoDB(updatedUserData.data.user))
//       }
//       if (ifUserHaveValidDataInDB) {
//         navigate("/my-profile")
//       } else {
//         navigate("/")
//       }
//     } catch (error: any) {
//       console.log(error)

//       if (error.code === "auth/email-already-in-use") {
//         setError(
//           "The email address is already in use. Please use a different email."
//         )
//       } else {
//         setError("Failed to create an account. Please try again.")
//       }
//     } finally {
//       setLoading(false)
//     }
//   }

//   //--------------------------------------------------------

//   return (
//     <>
//       <Container
//         // className="container mt-4"
//         // style={{minHeight: "20vh"}}
//         style={{padding: "0px 0px 20px 0px"}}
//         className="container mt-4">
//         <Card>
//           <Card.Header>
//             <h2>Create Jam</h2>
//           </Card.Header>
//           <Card.Body>
//             {error && <Alert variant="danger">{error}</Alert>}
//             {message && <Alert variant="info">{message}</Alert>}

//             <Form onSubmit={handleSubmit}>
//               <Row className="d-flex justify-content-center">
//                 <Col xl={4} lg={7} md={6} sm={12}>
//                   <ImageUploaderCrop
//                     handleImageURL={handleImageURL}
//                     currentURL={jam?.img}
//                   />
//                   <br></br>
//                 </Col>

//                 <Col xl={4} lg={6} md={9} sm={12}>
//                   {/* <br></br> */}

//                   <Form.Group id="userName">
//                     <Form.Label
//                     // style={{marginTop: "7%"}}
//                     >
//                       User Name
//                     </Form.Label>
//                     <Form.Control
//                       type="text"
//                       value={userName}
//                       onChange={handleUserNameChange}
//                       required
//                     />
//                   </Form.Group>
//                   <br></br>

//                   <Form.Group id="firstName">
//                     <Form.Label>First Name</Form.Label>
//                     <Form.Control
//                       type="text"
//                       value={firstName}
//                       onChange={handleFirstNameChange}
//                       required
//                     />
//                   </Form.Group>
//                   <br></br>

//                   <Form.Group id="lastName">
//                     <Form.Label>Last Name</Form.Label>
//                     <Form.Control
//                       type="text"
//                       value={lastName}
//                       onChange={handleLastNameChange}
//                       required
//                     />
//                   </Form.Group>
//                   {/* <hr /> */}
//                   <br></br>
//                   {/* <hr /> */}
//                   {/* TODO--- create reusble component for locations select with CB functions */}

//                   <Form.Group controlId="countries">
//                     <Form.Label>Select Country:</Form.Label>
//                     <Form.Control
//                       as="select"
//                       required
//                       onChange={handleCountryChange}
//                       value={selectedCountry || ""}>
//                       <option value="" disabled>
//                         Select country
//                       </option>
//                       {Country.getAllCountries().map((country) => (
//                         <option key={country.isoCode} value={country.isoCode}>
//                           {country.name}
//                         </option>
//                       ))}
//                     </Form.Control>
//                   </Form.Group>
//                   <br></br>

//                   <Form.Group controlId="regions">
//                     <Form.Label>Select Region:</Form.Label>
//                     <Form.Control
//                       as="select"
//                       onChange={handleRegionChange}
//                       value={selectedRegion || ""}>
//                       <option value="" disabled>
//                         Select region
//                       </option>
//                       {State.getStatesOfCountry(selectedCountry || "").map(
//                         (state) => (
//                           <option key={state.isoCode} value={state.isoCode}>
//                             {state.name}
//                           </option>
//                         )
//                       )}
//                     </Form.Control>
//                   </Form.Group>
//                   <br></br>

//                   <Form.Group controlId="cities">
//                     <Form.Label>Select City:</Form.Label>
//                     <Form.Control
//                       as="select"
//                       onChange={handleCityChange}
//                       value={selectedCity || ""}>
//                       <option value="" disabled>
//                         Select city
//                       </option>
//                       {City.getCitiesOfState(
//                         selectedCountry || "",
//                         selectedRegion || ""
//                       ).map((city) => (
//                         <option key={city.name} value={city.name}>
//                           {city.name}
//                         </option>
//                       ))}
//                     </Form.Control>
//                   </Form.Group>

//                   <br></br>
//                   <Row>
//                     <Col lg={6} sm={6} xs={6}>
//                       <Form.Group controlId="datepicker">
//                         <div style={{margin: "0px 0px 0px 0px"}}>
//                           <Form.Label>Birthday</Form.Label>
//                         </div>

//                         <DatePicker
//                           selected={dob || null}
//                           onChange={(date) => setDob(date)}
//                           className="form-control"
//                           dateFormat="MM/dd/yyyy"
//                         />
//                       </Form.Group>
//                     </Col>

//                     <Col lg={6} sm={6} xs={6}>
//                       <Form.Group id="gender">
//                         {/* <br></br> */}
//                         <Form.Label>Type</Form.Label>
//                         <Form.Select value={gender} onChange={handleTypeChange}>
//                           <option value="" disabled>
//                             Select Type
//                           </option>
//                           <option value="male">Indoor</option>
//                           <option value="female">Outdoor</option>
//                         </Form.Select>
//                         <br></br>
//                       </Form.Group>
//                     </Col>
//                   </Row>

//                   {/* TODO--- --------------------------------------- */}
//                   {/* </div> */}
//                 </Col>

//                 <Col xl={4} lg={6} md={9} sm={12}>
//                   {/* <br></br> */}
//                   <div className="d-block d-md-none">
//                     <hr />
//                   </div>

//                   <Row>
//                     <div className="d-none d-lg-block">
//                       <div style={{marginTop: "12px"}}></div>
//                     </div>

//                     {genres && jam && (
//                       <Col md={12} lg={12} xl={12} xs={12} sm={12}>
//                         {/* <hr /> */}
//                         <MultiSelect
//                           ifRequired={true}
//                           dataArray={genres}
//                           selectionName="genre"
//                           selectedDB={jam?.genres}
//                           selectedCallbackFn={selectedGenresCB}
//                         />
//                       </Col>
//                     )}

//                     <div className="d-none d-md-block">
//                       <div style={{marginTop: "8px"}}></div>
//                     </div>

//                     {instruments && jam && (
//                       <Col md={12} lg={12} xl={12} xs={12} sm={12}>
//                         <br></br>
//                         <MultiSelect
//                           ifRequired={true}
//                           dataArray={instruments}
//                           selectionName="instrument"
//                           selectedDB={jam?.instruments}
//                           selectedCallbackFn={selectedInstrumentsCB}
//                         />
//                       </Col>
//                     )}

//                     <Form.Group id="aboutMe">
//                       <br></br>
//                       <Form.Label>About Me</Form.Label>
//                       <Form.Control
//                         value={aboutMe}
//                         style={{height: "133px", marginBottom: "17px"}}
//                         as="textarea"
//                         onChange={handleAboutMeChange}
//                       />
//                     </Form.Group>

//                     {ifUserHaveValidDataInDB && (
//                       <Col>
//                         <br></br>
//                         <Button
//                           variant="outline-dark"
//                           style={{marginTop: "14px"}}
//                           disabled={loading}
//                           className="w-100"
//                           type="submit">
//                           {loading
//                             ? "Updating Profile Card..."
//                             : "Update Profile Card"}
//                         </Button>
//                       </Col>
//                     )}

//                     {!ifUserHaveValidDataInDB && (
//                       <Col>
//                         <br></br>
//                         <Button
//                           variant="outline-dark"
//                           style={{marginTop: "14px"}}
//                           disabled={loading}
//                           className="w-100"
//                           type="submit">
//                           {loading
//                             ? "Creating Profile Card..."
//                             : "Create Profile Card"}
//                         </Button>
//                       </Col>
//                     )}
//                   </Row>
//                 </Col>
//               </Row>
//             </Form>
//           </Card.Body>
//         </Card>
//       </Container>
//     </>
//   )
// }
