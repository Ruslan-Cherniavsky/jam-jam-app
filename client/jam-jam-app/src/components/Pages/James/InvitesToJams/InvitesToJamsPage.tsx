import {useEffect, useState} from "react"
import Loader from "../../../../components_UI/Loaders/Loader"
import dataAxios from "../../../../server/data.axios"
import JammersCardList from "../../../../components_UI/CardList_Jams/CardList_Jams"
import {
  Button,
  Col,
  Container,
  Form,
  FormControl,
  Pagination,
  Row,
} from "react-bootstrap"
import {useDispatch, useSelector} from "react-redux"

import Filter, {IParams} from "../Filter/Filter"
import {useLocation, useNavigate, useParams} from "react-router-dom"
import "./InvitesToJamsPage.css"
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome"
import {
  faCalendarCheck,
  faEnvelopeOpenText,
  faPlus,
} from "@fortawesome/free-solid-svg-icons"
import {faNode} from "@fortawesome/free-brands-svg-icons"
import {RootState} from "../../../../redux/store"
import JamsInvitesCardList from "../../../../components_UI/CardList_JamRequests/CardList_JamRequests"

function InvitesToJamsCardListPage() {
  const navigate = useNavigate()
  const location = useLocation()
  const [ifFiltering, setIfFiltering] = useState(false)
  const [ifSearching, setIfSearching] = useState(false)
  const [jams, setJams] = useState([])
  const [loading, setLoading] = useState(true)
  const {page}: {page?: string} = useParams()
  const [currentPage, setCurrentPage] = useState(1)
  const [ifFiltered, setIfFiltered] = useState(false)
  const [gettingUrlParams, setGettingUrlParams] = useState(true)
  const [value, setValue] = useState([3])
  const [jamInvites, setJamsInvites] = useState([])
  const [pageUpdateStatus, setPageUpdateStatus] = useState(true)
  const [searchText, setSearchText] = useState<SearchText | any>({jamName: ""})

  const [params, setParams] = useState<IJamParams | SearchText | Object | any>(
    {}
  )
  const [totalPages, setTotalPages] = useState(0)

  const userId = useSelector(
    (state: RootState) => state.userDataMongoDB.allUserData?._id
  )

  const MAX_PAGES_DISPLAYED = 9
  const CARD_LIST_TYPE = "Jam Invites"

  interface SearchText {
    jamName: string | null
  }

  interface IJamParams {
    country: string
    region: string
    city: string
    isoCode: string
    jamDateFrom: any
    jamDateTo: any
    type: string
    genres: []
    sharedInstruments: []
  }

  useEffect(() => {
    const queryString = convertParamsToQueryString(params)
    const newUrl = `/invites-to-jams?page=${currentPage}&${queryString}`

    navigate(newUrl)
    navigate(newUrl)
  }, [currentPage, params, navigate])

  const handleSearchInput = (event: any) => {
    const currentSearchText = {
      ...searchText,
      jamName: event.target.value,
    }

    setSearchText(currentSearchText)
  }

  const handleSearch = () => {
    setLoading(true)
    setIfSearching(true)
    setIfFiltered(false)
    setParams({...searchText})
    setCurrentPage(1)
  }

  useEffect(() => {
    setLoading(true)
    const searchParams = new URLSearchParams(location.search)
    const urlParams = {
      country: parseNullOrUndefined(searchParams.get("country")) || "",
      region: parseNullOrUndefined(searchParams.get("region")) || "",
      city: parseNullOrUndefined(searchParams.get("city")) || "",
      isoCode: parseNullOrUndefined(searchParams.get("isoCode")) || "",
      jamDateTo: parseNullOrUndefined(searchParams.get("jamDateTo")) || "",
      jamDateFrom: parseNullOrUndefined(searchParams.get("jamDateFrom")) || "",
      type: parseNullOrUndefined(searchParams.get("type")) || "",
      genres: searchParams.getAll("genres[]") || [],
      instruments: searchParams.getAll("instruments[]") || [],
      username: parseNullOrUndefined(searchParams.get("username")) || "",
    }

    function parseNullOrUndefined(value: any) {
      return value === "null" ? null : value || null
    }

    setCurrentPage(Number(searchParams.get("page") || "1"))

    if (
      urlParams.country ||
      urlParams.city ||
      urlParams.region ||
      urlParams.isoCode ||
      urlParams.jamDateFrom ||
      urlParams.jamDateTo ||
      urlParams.type ||
      urlParams.genres.length > 0 ||
      urlParams.instruments.length > 0
    ) {
      setParams(urlParams)
      setIfFiltered(true)
    }

    const urlParamsSearch = {
      jamName: parseNullOrUndefined(searchParams.get("jamName")) || "",
    }

    if (urlParamsSearch.jamName) {
      setParams(urlParamsSearch)
      setIfSearching(true)
      setSearchText(urlParamsSearch)
    }

    setLoading(false)
    setGettingUrlParams(false)
  }, [])

  const convertParamsToQueryString = (params: any) => {
    return Object.keys(params)
      .map((key) => {
        if (Array.isArray(params[key])) {
          return params[key].map((value: any) => `${key}[]=${value}`).join("&")
        } else {
          return `${key}=${params[key]}`
        }
      })
      .join("&")
  }

  function ifFilteringCB(ifFilteringProp: boolean) {
    setIfSearching(false)
    setIfFiltering(ifFilteringProp)
  }

  const fetchFilteredCB = async (params: Object | any) => {
    setLoading(true)
    setParams(params)
    setSearchText({jamName: ""})
    setIfSearching(false)
    setIfFiltered(true)
    setCurrentPage(1)
  }

  useEffect(() => {
    const fetchJams = async () => {
      try {
        if (!ifFiltered && !gettingUrlParams && !ifSearching && userId) {
          setSearchText({jamName: ""})

          setLoading(true)
          const requestParams = {
            senderId: userId,
            receiverId: userId,
          }

          const data = await dataAxios.getAllJamInvites(
            requestParams,
            currentPage
          )

          const currentJams = data.data.jamRequests.map(
            (jamRequest: any) => (jamRequest = jamRequest.jamId)
          )

          console.log(userId)
          console.log(currentJams)
          console.log(data.data.jamRequests)

          setTotalPages(data.data.totalPages)
          setJams(currentJams)
          setJamsInvites(data.data.jamRequests)

          //Todo -------------------->>>>
        } else if (ifFiltered && !ifSearching) {
          setSearchText({jamName: ""})

          setLoading(true)
          const data = await dataAxios.getAllFilteredJamsPaginate(
            params,
            currentPage
          )

          // console.log(data)
          // console.log("filtering params", params)

          setTotalPages(data.totalPages)
          setJams(data.jams)
        } else if (ifSearching) {
          setLoading(true)
          const data = await dataAxios.getAllJamsPaginateBySearch(
            params,
            currentPage
          )
          setTotalPages(data.totalPages)
          setJams(data.jams)
        }
        setLoading(false)
      } catch (error) {
        console.error("Error fetching jammers:", error)
        setLoading(false)
      }
    }

    fetchJams()
  }, [currentPage, gettingUrlParams, params, userId, pageUpdateStatus])

  const renderPaginationItems = () => {
    const startPage = Math.max(
      1,
      currentPage - Math.floor(MAX_PAGES_DISPLAYED / 2)
    )
    const endPage = Math.min(totalPages, startPage + MAX_PAGES_DISPLAYED - 1)

    return Array.from({length: endPage - startPage + 1}).map((_, index) => (
      <Pagination.Item
        key={startPage + index}
        active={currentPage === startPage + index}
        onClick={() => handlePageChange(startPage + index - 1)}>
        {startPage + index}
      </Pagination.Item>
    ))
  }

  const handlePageChange = (page: number) => {
    if (page >= 0 && page < totalPages) {
      setCurrentPage(page + 1)
    }
  }

  const pageUpdater = () => {
    setPageUpdateStatus(!pageUpdateStatus)
  }

  async function filteredStatusChange() {
    setLoading(true)
    setIfFiltered(false)
    setParams({})
    setCurrentPage(1)
  }

  const handleChange = (val: any) => {
    console.log(val)
    setValue(val)
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
          Jam Invites
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
                onClick={handleSearch}
                className="w-100">
                Jam Requests
              </Button>
            </Col>
          </Row>
        </Container>

        {/* <Filter
          searching={ifSearching}
          filteredStatusChange={filteredStatusChange}
          setIfFilteringCB={ifFilteringCB}
          fetchFilteredCB={fetchFilteredCB}
        /> */}

        <div className="d-none d-xl-block">
          <Container>
            <Row>
              <Col xl={4}>
                {jams.length > 0 && (
                  <Pagination className="my-custom-pagination">
                    <Pagination.Prev
                      onClick={() => handlePageChange(currentPage - 2)}
                      disabled={currentPage === 1}
                    />
                    {renderPaginationItems()}
                    <Pagination.Next
                      onClick={() => handlePageChange(currentPage)}
                      disabled={currentPage === totalPages}
                    />
                  </Pagination>
                )}
              </Col>
              <Col xl={2}></Col>

              {/* <Col xl={4}>
                <Form className="mb-2">
                  <FormControl
                    type="text"
                    placeholder="Search By Jam Name"
                    className="mr-sm-2"
                    onChange={handleSearchInput}
                    value={searchText?.jamName}
                  />
                </Form>
              </Col>
              <Col xl={2}>
                <Button
                  variant="outline-dark"
                  disabled={loading}
                  onClick={handleSearch}
                  className="w-100">
                  Search
                </Button>
              </Col> */}
            </Row>
          </Container>
        </div>

        <div className="d-block d-xl-none">
          <Container>
            <Row>
              <Col xl={2}></Col>

              {/* <Col xl={4} md={8} sm={8} xs={8}>
                <Form className="mb-2">
                  <FormControl
                    style={{margin: " 0px 0px 15px 0px"}}
                    type="text"
                    placeholder="Search By Jam Name"
                    className="mr-sm-2"
                    onChange={handleSearchInput}
                    value={searchText?.jamName}
                  />
                </Form>
              </Col>
              <Col xl={2} md={4} sm={4} xs={4}>
                <Button
                  onClick={handleSearch}
                  variant="outline-dark"
                  disabled={loading}
                  style={{margin: " 0px 0px 15px 0px"}}
                  className="w-100">
                  Search
                </Button>
              </Col> */}

              <Col xl={4}>
                {jams.length > 0 && (
                  <Pagination className="my-custom-pagination">
                    <Pagination.Prev
                      onClick={() => handlePageChange(currentPage - 2)}
                      disabled={currentPage === 1}
                    />
                    {renderPaginationItems()}
                    <Pagination.Next
                      onClick={() => handlePageChange(currentPage)}
                      disabled={currentPage === totalPages}
                    />
                  </Pagination>
                )}
              </Col>
            </Row>
          </Container>
        </div>

        {jams && !ifFiltering && !loading ? (
          jams.length > 0 ? (
            <JamsInvitesCardList
              jamInvites={jamInvites}
              updateListCB={pageUpdater}
              cardListType={CARD_LIST_TYPE}
              jams={jams}
            />
          ) : (
            <div className="container mt-4">
              <div className="row row-cols-2 row-cols-md-2 row-cols-lg-3 row-cols-xl-4">
                <p>Jam Invites not found.</p>
              </div>
            </div>
          )
        ) : (
          <Loader />
        )}

        {jams.length > 4 && !loading && (
          <Pagination className="my-custom-pagination">
            <Pagination.Prev
              onClick={() => handlePageChange(currentPage - 2)}
              disabled={currentPage === 1}
            />
            {renderPaginationItems()}
            <Pagination.Next
              onClick={() => handlePageChange(currentPage)}
              disabled={currentPage === totalPages}
            />
          </Pagination>
        )}
      </div>
    </>
  )
}

export default InvitesToJamsCardListPage
