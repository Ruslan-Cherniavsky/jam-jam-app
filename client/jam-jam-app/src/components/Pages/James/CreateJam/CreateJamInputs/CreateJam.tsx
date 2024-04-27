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
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome"
import {
  faCalendarCheck,
  faEnvelopeOpenText,
  faPlus,
} from "@fortawesome/free-solid-svg-icons"

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
  const [instruments, setInstruments] = useState<string[]>([])
  const [jammers, setJammers] = useState<any[]>([])
  const [audience, setAudience] = useState<string[]>([])
  const [reports, setReports] = useState<any[]>([])
  const [imageURL, setImageURL] = useState(jam?.img || "")

  const [error, setError] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)
  const [message, setMessage] = useState<string | null>(null)
  const [instrumentRoleId, setInstrumentRoleId] = useState<any>("")
  const [numberOfRoles, setNumberOfRoles] = useState<any>(1)
  const [jemmerDisplayRoles, setJemmerDisplayRoles] = useState<any>([])

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
        setInstruments(data.instruments)
      })
    } catch (error) {
      console.error(error)
    }
  }, [])

  const handleCountryChange = (e: InputChangeEvent) => {
    const selectedCountryCode = e.target.value
    const selectedCountry = Country.getAllCountries().find(
      (country) => country.isoCode === selectedCountryCode
    )

    setCountry(selectedCountry?.name || "")
    setIsoCode(selectedCountry?.isoCode || "")
    setRegion("")
    setCity("")
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
  const handleInstrumentRoleChange = (e: SelectChangeEvent) => {
    setInstrumentRoleId(e.target.value || "")
  }
  const handleNumberOfRolesChange = (e: SelectChangeEvent) => {
    setNumberOfRoles(e.target.value || "")
  }
  const addJammerRole = () => {
    const jammerRole = {
      instrument: instrumentRoleId,
      maxNumberOfJammers: numberOfRoles,
      jammersId: [],
    }

    if (!instrumentRoleId) {
      setError("select instrument")
      return
    }
    // const jammers = []

    const instrumentExists = jammers.some(
      (jammer) => jammer.instrument === instrumentRoleId
    )

    if (instrumentExists) {
      setError("You cannot add the same instrument more than once.")
      return
    }

    jammers.push(jammerRole)

    setJammers(jammers)

    console.log(jammers)

    const fullInstrumentObject = instruments.find(
      (instrument: any) => instrument._id === instrumentRoleId
    )

    const jammerDisplayRole = {
      instrument: fullInstrumentObject,
      maxNumberOfJammers: numberOfRoles,
    }

    jemmerDisplayRoles.push(jammerDisplayRole)

    setJemmerDisplayRoles(jemmerDisplayRoles)

    console.log(jemmerDisplayRoles)

    setInstrumentRoleId("")
    setNumberOfRoles(1)

    setError("")
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

  const deleteJammerRole = (index: number) => {
    // Remove the role from jammers array
    const updatedJammers = [...jammers]
    updatedJammers.splice(index, 1)
    setJammers(updatedJammers)

    // Remove the role from jemmerDisplayRoles array
    const updatedDisplayRoles = [...jemmerDisplayRoles]
    updatedDisplayRoles.splice(index, 1)
    setJemmerDisplayRoles(updatedDisplayRoles)
  }
  function handleSubmit(e: FormEvent) {
    e.preventDefault()
    try {
      setLoading(true)
      setError("")

      // console.log(jamDate)
      // console.log(new Date())

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
        jammers: jammers,
        // audience,
        // reports,
        img: imageURL,
      }

      setError("")

      if (!jamDate) {
        setError("Please select the date of the jam.")
        return
      }

      if (imageURL === "") {
        setError("Please upload an image for the jam.")
        return
      }

      if (!jamName) {
        setError("Please enter the jam name.")
        setLoading(false)
        return
      }

      if (!jamDate || jamDate <= new Date()) {
        setError("Please select a valid future date for the jam.")
        setLoading(false)
        return
      }

      if (!country || !region || !city) {
        setError("Please select the country, region, and city.")
        setLoading(false)
        return
      }

      if (!type) {
        setError("Please select the type of jam.")
        setLoading(false)
        return
      }

      if (selectedGenres.length === 0) {
        setError("Please select at least one genre.")
        setLoading(false)
        return
      }

      if (selectedInstruments.length === 0) {
        setError("Please select at least one instrument.")
        setLoading(false)
        return
      }

      if (!jamDescription) {
        setError("Please enter the jam description.")
        setLoading(false)
        return
      }

      const response = dataAxios.createJam(newJam)
      console.log(newJam)
      console.log(response)
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
      <div className="container mt-4">
        <h5
          style={{
            backgroundColor: "#f8f9fc",
            color: "#929292",
            textAlign: "center",
            paddingBottom: "6px",
            paddingTop: "2px",
            marginBottom: "20px",
          }}>
          Jam Requests
        </h5>

        <Container className="selectContainer border rounded">
          <Row>
            {/* <Col md={4}>
        <ToggleButtonGroup
          type="checkbox"
          className="w-100"
          style={{marginBottom: "20px"}}
          value={value}
          onChange={handleChange}>
          <ToggleButton id="tbg-btn-1" value={1} variant="outline-dark">
            <FontAwesomeIcon
              style={{
                color: "#BCBCBC",
                marginRight: "12px",
              }}
              icon={faMap}
              className="mr-1"
            />{" "}
            {value[1] === 1 ? " Cards Vew" : "Map Vew"}
          </ToggleButton>
    
        </ToggleButtonGroup>
      </Col> */}

            <Col xl={2} sm={6} xs={6}>
              <Button
                variant="outline-dark"
                disabled={loading}
                onClick={() => {
                  navigate("/jam-events")
                }}
                style={{marginBottom: "20px", marginTop: "20px"}}
                className="w-100">
                <FontAwesomeIcon
                  style={{
                    color: "#BCBCBC",
                    marginRight: "3px",
                  }}
                  icon={faPlus}
                  className="mr-1"
                />
                Explore Jams
              </Button>
            </Col>
            <Col xl={2} sm={6} xs={6}>
              <Button
                variant="outline-dark"
                disabled={loading}
                onClick={() => {
                  navigate("/joined-jams")
                }}
                style={{marginBottom: "20px", marginTop: "20px"}}
                className="w-100">
                <FontAwesomeIcon
                  style={{
                    color: "#BCBCBC",
                    marginRight: "9px",
                  }}
                  icon={faCalendarCheck}
                  className="mr-1"
                />
                Joined Jams
              </Button>
            </Col>
            <Col xl={2} sm={6} xs={6}>
              <Button
                variant="outline-dark"
                disabled={loading}
                onClick={() => {
                  navigate("/invites-to-jams")
                }}
                style={{marginBottom: "20px", marginTop: "20px"}}
                className="w-100">
                <FontAwesomeIcon
                  style={{
                    color: "#BCBCBC",
                    marginRight: "8px",
                  }}
                  icon={faEnvelopeOpenText}
                  className="mr-1"
                />
                Jam Invites
              </Button>
            </Col>
            <Col xl={2} sm={6} xs={6}>
              <Button
                variant="outline-dark"
                style={{marginBottom: "20px", marginTop: "20px"}}
                disabled={loading}
                onClick={() => {
                  navigate("/host-jam")
                }}
                className="w-100">
                Host Jam
              </Button>
            </Col>
            <Col xl={2} sm={6} xs={6}>
              <Button
                variant="outline-dark"
                style={{marginBottom: "20px", marginTop: "20px"}}
                disabled={loading}
                onClick={() => {
                  navigate("/hosted-jams")
                }}
                className="w-100">
                Hosted Jams
              </Button>
            </Col>
            <Col xl={2} sm={6} xs={6}>
              <Button
                variant="outline-dark"
                style={{marginBottom: "20px", marginTop: "20px"}}
                disabled={loading}
                onClick={() => {
                  navigate("/jam-requests")
                }}
                className="w-100">
                Jam Requests
              </Button>
            </Col>
          </Row>
        </Container>
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
                  <Col xl={3} lg={3} md={3} sm={12}></Col>

                  <Col xl={5} lg={6} md={6} sm={12}>
                    <ImageUploaderCrop
                      handleImageURL={handleImageURL}
                      currentURL={jam?.img}
                    />
                  </Col>

                  <Col xl={3} lg={3} md={3} sm={12}></Col>

                  <Col xl={5} lg={6} md={9} sm={12}>
                    <br></br>
                    <Form.Group id="jamName">
                      <Form.Label>Jam Name</Form.Label>
                      <Form.Control
                        placeholder="Jam Name"
                        type="text"
                        value={jamName}
                        onChange={handleJamNameChange}
                        required
                      />
                    </Form.Group>

                    <br />

                    <Row>
                      <Col xl={5} lg={7} md={5} sm={5} xs={5}>
                        <Form.Label>Jam Date</Form.Label>
                        <Form.Group controlId="jamDate">
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
                      </Col>

                      <br />
                      <Col xl={6} lg={7} md={6} sm={6} xs={6}>
                        <Form.Group controlId="type">
                          <Form.Label>Jam Type</Form.Label>
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
                    </Row>
                    <br />
                    <hr />
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
                    <br></br>

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
                    <br></br>

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

                    <br></br>
                    <hr />
                    {/* <br></br> */}
                    <MultiSelect
                      ifRequired={true}
                      dataArray={genres}
                      selectionName="genre"
                      selectedDB={jam?.genres || []}
                      selectedCallbackFn={selectedGenresCB}
                    />

                    <br></br>
                    <br></br>

                    {/* <div className="d-none d-md-block">
                <div style={{marginTop: "8px"}}></div>
              </div> */}

                    <MultiSelect
                      ifRequired={true}
                      dataArray={instruments}
                      selectionName="instrument"
                      selectedDB={jam?.sharedInstruments || []}
                      selectedCallbackFn={selectedInstrumentsCB}
                    />

                    <br></br>
                    <br></br>

                    <div
                      style={{
                        border: "gray solid 1px ",

                        borderRadius: "15px",
                        padding: "12px",
                      }}>
                      <Row>
                        <Col xl={6} lg={6} md={6} sm={6} xs={6}>
                          <Form.Group controlId="instrument">
                            <Form.Label>instrument Role</Form.Label>
                            <Form.Select
                              value={instrumentRoleId}
                              onChange={handleInstrumentRoleChange}>
                              <option value="" disabled>
                                Instrument Role
                              </option>
                              {instruments.map((instrument: any) => (
                                <option
                                  key={instrument._id}
                                  value={instrument._id}>
                                  {instrument.instrument}{" "}
                                </option>
                              ))}
                            </Form.Select>
                          </Form.Group>
                        </Col>
                        <Col xl={3} lg={3} md={3} sm={3} xs={3}>
                          <Form.Group controlId="number of jammers">
                            <Form.Label>Jammers</Form.Label>
                            <Form.Select
                              value={numberOfRoles}
                              onChange={handleNumberOfRolesChange}>
                              <option value="" disabled>
                                Select Max Number of Jammers
                              </option>
                              {Array.from({length: 10}, (_, index) => (
                                <option key={index + 1} value={index + 1}>
                                  {index + 1}
                                </option>
                              ))}
                            </Form.Select>
                          </Form.Group>
                        </Col>

                        <Col xl={3} lg={3} md={3} sm={3} xs={3}>
                          <Button
                            variant="outline-dark"
                            style={{marginTop: "32px"}}
                            disabled={loading}
                            className="w-100"
                            // href="#"
                            // type="submit"
                            onClick={addJammerRole}>
                            Add
                          </Button>
                        </Col>
                      </Row>

                      <br></br>

                      {jemmerDisplayRoles &&
                        jemmerDisplayRoles.length > 0 &&
                        jemmerDisplayRoles.map(
                          (jammersDisplayRole: any, index: any) => (
                            <Row key={index}>
                              <hr></hr>
                              <Col xl={7} lg={7} md={7} sm={7} xs={7}>
                                <p>
                                  {jammersDisplayRole.instrument.instrument}
                                </p>
                              </Col>
                              <Col xl={2} lg={2} md={2} sm={2} xs={2}>
                                <p>{jammersDisplayRole.maxNumberOfJammers}</p>
                              </Col>
                              <Col xl={3} lg={3} md={3} sm={3} xs={3}>
                                <Button
                                  variant="outline-dark"
                                  // style={{marginTop: "32px"}}
                                  disabled={loading}
                                  className="w-100"
                                  size="sm"
                                  // href="#"
                                  // type="submit"
                                  onClick={() => deleteJammerRole(index)}>
                                  {" "}
                                  Delete
                                </Button>
                              </Col>
                            </Row>
                          )
                        )}
                    </div>

                    <br></br>

                    <Form.Group controlId="jamDescription">
                      <Form.Label>Jam Description</Form.Label>
                      <Form.Control
                        value={jamDescription}
                        style={{height: "150px", marginBottom: "7px"}}
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
                      {loading ? "Creating Jam..." : "Create Jam"}
                    </Button>
                  </Col>
                </Row>
              </Form>
            </Card.Body>
          </Card>
        </Container>
      </div>
    </>
  )
}
