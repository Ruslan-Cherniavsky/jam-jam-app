import React, {ChangeEvent, FormEvent, useEffect, useState} from "react"
import {
  Form,
  Button,
  Card,
  Alert,
  Col,
  Container,
  Row,
  FormControl,
} from "react-bootstrap"
import {Country, State, City} from "country-state-city"
import MultiSelect from "../../MultiSelect/Multiselect"
import dataAxios from "../../../server/data.axios"
import {useDispatch, useSelector} from "react-redux"
import {
  clearUserDataMongoDB,
  setUserDataMongoDB,
} from "../../../redux/reducers/UserDataSliceMongoDB"
import {setUsersData} from "../../../redux/reducers/JammersDataSliceMongoDB"
import "./Filter.css"
import axios from "axios"

type InputChangeEvent = ChangeEvent<HTMLInputElement>
type SelectChangeEvent = ChangeEvent<HTMLSelectElement>
type InputChangeTextArea = React.ChangeEvent<HTMLTextAreaElement>

interface FilterProps {
  setIfFilteringCB: Function
  fetchFilteredCB: Function
  filteredStatusChange: Function
  currentPage: number
}

const Filter = (filterProps: FilterProps) => {
  const [selectedCountry, setSelectedCountry] = useState<string | null>("")
  const [selectedRegion, setSelectedRegion] = useState<string | null>("")
  const [selectedCity, setSelectedCity] = useState<string | null>("")
  const [loading, setLoading] = useState(false)
  const [genres, setGenres] = useState<Array<Object>>([])
  const [instruments, setInstruments] = useState<Array<Object>>([])

  const [selectedInstruments, setSelectedInstruments] = useState<Array<string>>(
    []
  )
  const [selectedGenres, setSelectedGenres] = useState<Array<string>>([])

  function selectedGenresCB(genres: Array<string>) {
    setSelectedGenres(genres)
  }
  function selectedInstrumentsCB(instrumrnts: Array<string>) {
    setSelectedInstruments(instrumrnts)
  }

  const dispatch = useDispatch()

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

  const [fullCountryName, setFullCountryName] = useState<string | null>("")
  const handleCountryChange = (e: InputChangeEvent) => {
    const selectedCountryCode = e.target.value

    if (selectedCountryCode === "") {
      setSelectedCountry(null)
      setFullCountryName(null)
      setSelectedRegion(null)
      setSelectedCity(null)
    } else {
      const selectedCountry = Country.getAllCountries().find(
        (country) => country.isoCode === selectedCountryCode
      )

      setSelectedCountry(selectedCountry?.isoCode || "")
      setFullCountryName(selectedCountry?.name || "")
      setSelectedRegion(null)
      setSelectedCity(null)
    }
  }

  const handleRegionChange = (e: InputChangeEvent) => {
    setSelectedRegion(e.target.value || "")
    setSelectedCity(null)
  }

  const handleCityChange = (e: InputChangeEvent) => {
    setSelectedCity(e.target.value || "")
  }

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault()

    try {
      setLoading(true)
      filterProps.setIfFilteringCB(true)
      if (
        !fullCountryName &&
        !selectedRegion &&
        !selectedCity &&
        !selectedCountry &&
        selectedGenres.length === 0 &&
        selectedInstruments.length === 0
      ) {
        console.log("Nothing is selected")

        filterProps.filteredStatusChange()

        // const userData = await dataAxios.dataFetch()
        // dispatch(setUsersData(userData.users))
        // setLoading(false)
        // return
      } else if (
        fullCountryName ||
        selectedRegion ||
        selectedCity ||
        selectedCountry ||
        selectedGenres ||
        selectedInstruments
      ) {
        const params = {
          country: fullCountryName,
          region: selectedRegion,
          city: selectedCity,
          isoCode: selectedCountry,
          genres: selectedGenres,
          instruments: selectedInstruments,
        }

        console.log("params ", params)

        filterProps.fetchFilteredCB(params)
      }
    } catch (error: any) {
      console.log(error)
    }

    setLoading(false)
    filterProps.setIfFilteringCB(false)
  }

  return (
    <>
      <Container
        className="selectContainer border rounded"
        // style={{minHeight: "10vh", maxWidth: "136vh"}}
        // style={{marginBottom: "20px"}}
        // className="d-flex align-items-center border justify-content-center"
        // className="d-flex align-items-center border justify-content-center"
      >
        <Form onSubmit={handleSubmit}>
          <Row>
            <Col xl={2} lg={4} md={4}>
              <Form.Group controlId="countries">
                {/* <Form.Label>Select Country:</Form.Label> */}
                <Form.Control
                  style={{marginTop: "22px"}}
                  as="select"
                  onChange={handleCountryChange}
                  value={selectedCountry || ""}>
                  <option value="" disabled>
                    Select country
                  </option>
                  <option value="">All countries</option>
                  {Country.getAllCountries().map((country) => (
                    <option key={country.isoCode} value={country.isoCode}>
                      {country.name}
                    </option>
                  ))}
                </Form.Control>
              </Form.Group>
            </Col>

            <Col xl={2} lg={4} md={4}>
              <Form.Group controlId="regions">
                {/* <Form.Label>Select Region:</Form.Label> */}
                <Form.Control
                  style={{marginTop: "22px"}}
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
            </Col>
            <Col xl={2} lg={4} md={4}>
              <Form.Group controlId="cities">
                {/* <Form.Label>Select City:</Form.Label> */}
                <Form.Control
                  style={{marginTop: "22px"}}
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
            </Col>

            <Col xl={2} lg={4} md={4}>
              <MultiSelect
                ifRequired={false}
                dataArray={genres}
                selectionName="genre"
                selectedDB={genres}
                selectedCallbackFn={selectedGenresCB}
              />
            </Col>
            {/* <Col></Col> */}

            <Col xl={2} lg={4} md={4}>
              <MultiSelect
                ifRequired={false}
                dataArray={instruments}
                selectionName="instrument"
                selectedDB={instruments}
                selectedCallbackFn={selectedInstrumentsCB}
              />
            </Col>
            {/* <Col></Col> */}

            <Col xl={2} lg={4} md={4}>
              <Button
                variant="outline-dark"
                disabled={loading}
                style={{margin: " 22px 0px 22px 0px"}}
                className="w-100"
                type="submit">
                Filter
              </Button>
            </Col>
          </Row>
        </Form>
      </Container>
    </>
  )
}

export default Filter
