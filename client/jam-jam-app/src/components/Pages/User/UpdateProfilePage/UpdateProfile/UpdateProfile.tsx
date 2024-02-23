import React, {useState, FormEvent, useEffect, ChangeEvent} from "react"
import {Form, Button, Card, Alert, Col, Container, Row} from "react-bootstrap"
import {useNavigate} from "react-router-dom"
import {auth, storage} from "../../../../../services/firebaseConfig"
import dataAxios from "../../../../../server/data.axios"
import {useDispatch, useSelector} from "react-redux"
import {RootState} from "../../../../../redux/store"
import MultiSelect from "../../../../../components_UI/MultiSelect/Multiselect"
import {
  UserDataSliceMongoDB,
  setUserDataMongoDB,
} from "../../../../../redux/reducers/UserDataSliceMongoDB"
import {Country, State, City} from "country-state-city"
import ImageUpload from "../ImageUploader/ImageUploader"

export default function UpdateProfile({
  userDataDB,
}: {
  userDataDB?: UserDataSliceMongoDB | null
}) {
  const navigate = useNavigate()

  const [userName, setUserName] = useState(userDataDB?.userName || "")
  const [firstName, setFirstName] = useState(userDataDB?.firstName || "")
  const [lastName, setLastName] = useState(userDataDB?.lastName || "")
  const [age, setAge] = useState(userDataDB?.age || "")
  const [gender, setGender] = useState(userDataDB?.gender || "")
  const [aboutMe, setAboutMe] = useState(userDataDB?.oboutMe || "")
  const [imageURL, setImageURL] = useState(userDataDB?.img || "")

  //------------------------- Links ------------------------------------

  const [link1, setLinks1] = useState(userDataDB?.links[0] || "")
  const [link2, setLinks2] = useState(userDataDB?.links[1] || "")
  const [link3, setLinks3] = useState(userDataDB?.links[2] || "")

  //------------ Array Selection Names ---------------------------------

  const [genres, setGenres] = useState<Array<Object>>([])
  const [instruments, setInstruments] = useState<Array<Object>>([])

  //------------ Array Selected from DB ---------------------------------

  const [selectedInstruments, setSelectedInstruments] = useState<Array<Object>>(
    userDataDB?.instruments || []
  )
  const [selectedGenres, setSelectedGenres] = useState<Array<Object>>(
    userDataDB?.genres || []
  )

  //----------------Select Countries----------------------------

  const [selectedCountry, setSelectedCountry] = useState<string | null>(
    userDataDB?.isoCode || ""
  )
  const [selectedRegion, setSelectedRegion] = useState<string | null>(
    userDataDB?.region || ""
  )
  const [selectedCity, setSelectedCity] = useState<string | null>(
    userDataDB?.city || ""
  )

  const [fullCountryName, setFullCountryName] = useState<string | null>(
    userDataDB?.country || ""
  )

  //---------------- Status -----------------------------------

  const [error, setError] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)
  const [message, setMessage] = useState<string | null>(null)

  const [ifUserHaveValidDataInDB, setIfUserHaveValidDataInDB] = useState(true)

  //---------------- Types ------------------------------------

  type InputChangeEvent = ChangeEvent<HTMLInputElement>
  type SelectChangeEvent = ChangeEvent<HTMLSelectElement>
  type InputChangeTextArea = React.ChangeEvent<HTMLTextAreaElement>

  //------------- On cklick handles----------------------------

  const handleUserNameChange = (e: InputChangeEvent) => {
    setUserName(e.target.value)
  }

  const handleFirstNameChange = (e: InputChangeEvent) => {
    setFirstName(e.target.value)
  }

  const handleLastNameChange = (e: InputChangeEvent) => {
    setLastName(e.target.value)
  }

  //-------countries

  const handleCountryChange = (e: InputChangeEvent) => {
    const selectedCountryCode = e.target.value
    const selectedCountry = Country.getAllCountries().find(
      (country) => country.isoCode === selectedCountryCode
    )

    setSelectedCountry(selectedCountry?.isoCode || "")
    setFullCountryName(selectedCountry?.name || "")
    setSelectedRegion(null)
    setSelectedCity(null)

    // console.log(selectedCountry?.name)
  }

  const handleRegionChange = (e: InputChangeEvent) => {
    setSelectedRegion(e.target.value || "")
    setSelectedCity(null)
  }

  const handleCityChange = (e: InputChangeEvent) => {
    setSelectedCity(e.target.value || "")
  }

  //-----------

  const ageOptions = Array.from({length: 82}, (_, index) => 18 + index)
  const handleAgeChange = (e: SelectChangeEvent) => {
    setAge(Number(e.target.value))
  }

  const handleGenderChange = (e: SelectChangeEvent) => {
    setGender(e.target.value)
  }

  const handleAboutMeChange = (e: InputChangeTextArea) => {
    setAboutMe(e.target.value)
  }

  const handleLinks1Change = (e: InputChangeEvent) => {
    setLinks1(e.target.value)
  }

  const handleLinks2Change = (e: InputChangeEvent) => {
    setLinks2(e.target.value)
  }

  const handleLinks3Change = (e: InputChangeEvent) => {
    setLinks3(e.target.value)
  }

  const dispatch = useDispatch()

  //--------------- Genres / Instruments Fetch (For Multiselect) -------

  useEffect(() => {
    try {
      dataAxios.genresFetch().then((data: any) => {
        setGenres(data.genres)
      })

      dataAxios.instrumentsFetch().then((data: any) => {
        console.log(data)
        setInstruments(data.instruments)
      })
    } catch (error) {
      console.error(error)
    }
  }, [])

  //--------------- user valid data in DB validation -------

  useEffect(() => {
    if (
      !userName ||
      !fullCountryName ||
      !selectedInstruments ||
      !selectedGenres ||
      !imageURL ||
      !fullCountryName
    ) {
      setIfUserHaveValidDataInDB(false)
      console.log(
        "***************curent setIfUserHaveValidDataInDB status is false"
      )
      setMessage("Please create your profile")
    }
  }, [])

  //------------------------ CallBack Functions -------------------------

  function selectedGenresCB(genres: Array<string>) {
    setSelectedGenres(genres)
  }
  function selectedInstrumentsCB(instrumrnts: Array<string>) {
    setSelectedInstruments(instrumrnts)
  }

  function handleImageURL(newImageURL: string) {
    return setImageURL(newImageURL)
  }

  //------------------------------SUBMIT---------------------------------

  async function handleSubmit(e: FormEvent) {
    e.preventDefault()
    try {
      setLoading(true)
      setError("")

      const linksArray = []
      linksArray.push(link1, link2, link3)

      const userData = {
        userName,
        firstName,
        lastName,
        country: fullCountryName,
        region: selectedRegion,
        city: selectedCity,
        isoCode: selectedCountry,
        age,
        genres: selectedGenres,
        instruments: selectedInstruments,
        links: [link1, link2, link3],
        oboutMe: aboutMe,
        img: imageURL,
        gender,
      }
      // ------------------- Usernames Validation ------------------------

      const usernamesFromDB = await dataAxios.usernamesDataFetch()

      if (
        usernamesFromDB.usernames.some(
          (result: any) =>
            result.userName === userName && result._id !== userDataDB?._id
        )
      ) {
        return setError("User name exist, please try different name.")
      }
      if (userName.length < 3) {
        setError("Username must have a minimum of 3 characters.")
      } else {
        // If the length requirement is met, clear any previous error
        setError("")
      }

      //----------------------UPDATE USER!--------------------

      if (userDataDB?.email === auth.currentUser?.email) {
        await dataAxios.userCardDataUpdate(userDataDB?._id, userData)
        const updatedUserData = await dataAxios.jemerCardDataFetchByEmail(
          userDataDB?.email
        )
        dispatch(setUserDataMongoDB(updatedUserData.user))
      }
      if (ifUserHaveValidDataInDB) {
        navigate("/my-profile")
      } else {
        navigate("/")
      }
    } catch (error: any) {
      console.log(error)

      if (error.code === "auth/email-already-in-use") {
        setError(
          "The email address is already in use. Please use a different email."
        )
      } else {
        setError("Failed to create an account. Please try again.")
      }
    } finally {
      setLoading(false)
    }
  }

  //--------------------------------------------------------

  return (
    <>
      <Container
        style={{minHeight: "20vh"}}
        className="d-flex align-items-center justify-content-center">
        <Card>
          <Card.Header>
            {!ifUserHaveValidDataInDB && <h2>Create Profile</h2>}

            {ifUserHaveValidDataInDB && <h2>Edit Profile</h2>}
          </Card.Header>
          <Card.Body>
            {error && <Alert variant="danger">{error}</Alert>}
            {message && <Alert variant="info">{message}</Alert>}

            <Form onSubmit={handleSubmit}>
              <Row>
                <Col xl={6} lg={6} md={6} sm={12}>
                  <div className="w-100" style={{maxWidth: "400px"}}>
                    <ImageUpload
                      handleImageURL={handleImageURL}
                      currentURL={userDataDB?.img}
                    />

                    <Form.Group id="userName">
                      <Form.Label style={{marginTop: "7%"}}>
                        User Name
                      </Form.Label>
                      <Form.Control
                        type="text"
                        value={userName}
                        onChange={handleUserNameChange}
                        required
                      />
                    </Form.Group>

                    <Form.Group id="firstName">
                      <Form.Label>First Name</Form.Label>
                      <Form.Control
                        type="text"
                        value={firstName}
                        onChange={handleFirstNameChange}
                        required
                      />
                    </Form.Group>

                    <Form.Group id="lastName">
                      <Form.Label>Last Name</Form.Label>
                      <Form.Control
                        type="text"
                        value={lastName}
                        onChange={handleLastNameChange}
                        required
                      />
                    </Form.Group>

                    {/* TODO--- create reusble component for locations select with CB functions */}

                    <Form.Group controlId="countries">
                      <Form.Label>Select Country:</Form.Label>
                      <Form.Control
                        as="select"
                        required
                        onChange={handleCountryChange}
                        value={selectedCountry || ""}>
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
                    <Form.Group controlId="regions">
                      <Form.Label>Select Region:</Form.Label>
                      <Form.Control
                        as="select"
                        onChange={handleRegionChange}
                        value={selectedRegion || ""}>
                        <option value="" disabled>
                          Select region
                        </option>
                        {State.getStatesOfCountry(selectedCountry || "").map(
                          (state) => (
                            <option key={state.isoCode} value={state.isoCode}>
                              {state.name}
                            </option>
                          )
                        )}
                      </Form.Control>
                    </Form.Group>

                    <Form.Group controlId="cities">
                      <Form.Label>Select City:</Form.Label>
                      <Form.Control
                        as="select"
                        onChange={handleCityChange}
                        value={selectedCity || ""}>
                        <option value="" disabled>
                          Select city
                        </option>
                        {City.getCitiesOfState(
                          selectedCountry || "",
                          selectedRegion || ""
                        ).map((city) => (
                          <option key={city.name} value={city.name}>
                            {city.name}
                          </option>
                        ))}
                      </Form.Control>
                    </Form.Group>

                    {/* TODO--- --------------------------------------- */}
                  </div>
                </Col>

                <Col xl={6} lg={6} md={6} sm={12}>
                  <div className="w-100" style={{maxWidth: "400px"}}>
                    <Form.Group id="age">
                      <Form.Label>Age</Form.Label>
                      <Form.Select value={age} onChange={handleAgeChange}>
                        <option value="" disabled>
                          Select age
                        </option>
                        {ageOptions.map((ageOption) => (
                          <option key={ageOption} value={ageOption}>
                            {ageOption}
                          </option>
                        ))}
                      </Form.Select>
                    </Form.Group>

                    <Form.Group id="gender">
                      <Form.Label>Gender</Form.Label>
                      <Form.Select value={gender} onChange={handleGenderChange}>
                        <option value="" disabled>
                          Select gender
                        </option>
                        <option value="male">Male</option>
                        <option value="female">Female</option>
                        <option value="other">Other</option>
                      </Form.Select>
                    </Form.Group>

                    {genres && userDataDB && (
                      <MultiSelect
                        ifRequired={true}
                        dataArray={genres}
                        selectionName="genre"
                        selectedDB={userDataDB?.genres}
                        selectedCallbackFn={selectedGenresCB}
                      />
                    )}

                    {instruments && userDataDB && (
                      <MultiSelect
                        ifRequired={true}
                        dataArray={instruments}
                        selectionName="instrument"
                        selectedDB={userDataDB?.instruments}
                        selectedCallbackFn={selectedInstrumentsCB}
                      />
                    )}

                    <Form.Group id="links1">
                      <Form.Label>Social Media Link #1</Form.Label>
                      <Form.Control
                        type="text"
                        value={link1}
                        onChange={handleLinks1Change}
                      />
                    </Form.Group>

                    <Form.Group id="links2">
                      <Form.Label>Social Media Link #2</Form.Label>
                      <Form.Control
                        type="text"
                        value={link2}
                        onChange={handleLinks2Change}
                      />
                    </Form.Group>

                    <Form.Group id="links3">
                      <Form.Label>Social Media Link #3</Form.Label>
                      <Form.Control
                        type="text"
                        value={link3}
                        onChange={handleLinks3Change}
                      />
                    </Form.Group>

                    <Form.Group id="aboutMe">
                      <Form.Label>About Me</Form.Label>
                      <Form.Control
                        value={aboutMe}
                        as="textarea"
                        onChange={handleAboutMeChange}
                      />
                    </Form.Group>

                    {ifUserHaveValidDataInDB && (
                      <Button
                        variant="outline-dark"
                        style={{marginTop: "4%"}}
                        disabled={loading}
                        className="w-100"
                        type="submit">
                        {loading
                          ? "Updating Profile Card..."
                          : "Update Profile Card"}
                      </Button>
                    )}

                    {!ifUserHaveValidDataInDB && (
                      <Button
                        variant="outline-dark"
                        style={{marginTop: "3%"}}
                        disabled={loading}
                        className="w-100"
                        type="submit">
                        {loading
                          ? "Creating Profile Card..."
                          : "Create Profile Card"}
                      </Button>
                    )}
                  </div>
                </Col>
              </Row>
            </Form>
          </Card.Body>
        </Card>
      </Container>
    </>
  )
}
