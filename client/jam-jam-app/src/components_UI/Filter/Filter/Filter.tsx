import React, {ChangeEvent, FormEvent, useEffect, useState} from "react"
import {Form, Button, Col, Container, Row} from "react-bootstrap"
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
import {useLocation} from "react-router"

type InputChangeEvent = ChangeEvent<HTMLInputElement>
type SelectChangeEvent = ChangeEvent<HTMLSelectElement>
type InputChangeTextArea = React.ChangeEvent<HTMLTextAreaElement>

interface FilterProps {
  setIfFilteringCB: Function
  fetchFilteredCB: Function
  filteredStatusChange: Function
}

export interface IParams {
  country: string
  region: string
  city: string
  isoCode: string
  genres: []
  instruments: []
}

const Filter = (filterProps: FilterProps) => {
  const [selectedCountry, setSelectedCountry] = useState<string | null>("")
  const [selectedRegion, setSelectedRegion] = useState<string | null>("")
  const [selectedCity, setSelectedCity] = useState<string | null>("")
  const [fullCountryName, setFullCountryName] = useState<string | null>("")
  //------
  const [loading, setLoading] = useState(false)
  const [genres, setGenres] = useState<Array<Object>>([])
  const [instruments, setInstruments] = useState<Array<Object>>([])

  const [selectedInstrumentsObjects, setSelectedInstrumentsObjects] = useState<
    Array<Object>
  >([])
  const [selectedGenresObjects, setSelectedGenresObjects] = useState<
    Array<Object>
  >([])
  //------------------
  const [selectedInstrumentsStrings, setSelectedInstrumentsStrings] = useState<
    Array<string>
  >([])
  const [selectedGenresStrings, setSelectedGenresStrings] = useState<
    Array<string>
  >([])
  //-------------------

  function selectedGenresCB(genres: Array<string>) {
    setSelectedGenresStrings(genres)
  }
  function selectedInstrumentsCB(instrumrnts: Array<string>) {
    setSelectedInstrumentsStrings(instrumrnts)
  }

  const location = useLocation()
  useEffect(() => {
    const fetchData = async () => {
      try {
        const genresData = await dataAxios.genresFetch()
        setGenres(genresData.genres)

        const instrumentsData = await dataAxios.instrumentsFetch()
        setInstruments(instrumentsData.instruments)
      } catch (error) {
        console.error(error)
      }
    }

    fetchData()
  }, [])

  useEffect(() => {
    const searchParams = new URLSearchParams(location.search)
    const urlParams = {
      country: parseNullOrUndefined(searchParams.get("country")) || "",
      region: parseNullOrUndefined(searchParams.get("region")) || "",
      city: parseNullOrUndefined(searchParams.get("city")) || "",
      isoCode: parseNullOrUndefined(searchParams.get("isoCode")) || "",
      genres: searchParams.getAll("genres[]") || [],
      instruments: searchParams.getAll("instruments[]") || [],
    }

    setFullCountryName(urlParams.country)
    setSelectedCountry(urlParams.isoCode)
    setSelectedRegion(urlParams.region)
    setSelectedCity(urlParams.city)

    if (urlParams.genres.length) {
      const genresFromUrlArray = urlParams.genres
      // console.log("geners objects from url params", genresFromUrlArray)

      dataAxios.fetchGenresByIds(genresFromUrlArray).then((currentGenres) => {
        setSelectedGenresObjects(currentGenres.genres)
        setSelectedGenresStrings(urlParams.genres)

        // console.log(
        //   "geners objects from url params with names",
        //   currentGenres.genres
        // )
      })
    }
    if (urlParams.instruments.length) {
      const instrumentsFromUrlArray = urlParams.instruments
      // console.log("geners objects from url params", instrumentsFromUrlArray)

      dataAxios
        .fetchInstrumentsByIds(instrumentsFromUrlArray)
        .then((currentInstruments) => {
          setSelectedInstrumentsObjects(currentInstruments.instruments)
          setSelectedInstrumentsStrings(urlParams.instruments)

          // console.log(
          //   "geners objects from url params with names",
          //   currentInstruments.instruments
          // )
        })
    }

    // console.log(urlParams.genres)
    // console.log(urlParams.instruments)

    // setSelectedGenres(urlParams.genres)
    // setSelectedInstruments(urlParams.instruments)

    function parseNullOrUndefined(value: any) {
      return value === "null" ? null : value || null
    }
  }, [])

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
        selectedGenresStrings.length === 0 &&
        selectedInstrumentsStrings.length === 0
      ) {
        filterProps.filteredStatusChange()
      } else if (
        fullCountryName ||
        selectedRegion ||
        selectedCity ||
        selectedCountry ||
        selectedGenresStrings ||
        selectedInstrumentsStrings
      ) {
        const params = {
          country: fullCountryName,
          region: selectedRegion,
          city: selectedCity,
          isoCode: selectedCountry,
          genres: selectedGenresStrings,
          instruments: selectedInstrumentsStrings,
        }

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
      <Container className="selectContainer border rounded">
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
                selectedDB={selectedGenresObjects}
                selectedCallbackFn={selectedGenresCB}
              />
            </Col>
            {/* <Col></Col> */}

            <Col xl={2} lg={4} md={4}>
              <MultiSelect
                ifRequired={false}
                dataArray={instruments}
                selectionName="instrument"
                selectedDB={selectedInstrumentsObjects}
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
