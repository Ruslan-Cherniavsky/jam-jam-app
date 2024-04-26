import React, {useEffect, useState} from "react"
import {
  Button,
  Col,
  Container,
  Form,
  FormControl,
  Pagination,
  Row,
} from "react-bootstrap"

import {useLocation, useNavigate, useParams} from "react-router-dom"
import Loader from "../../../../components_UI/Loaders/Loader"
import {IParams} from "../../Jammers/Filter/Filter"
import dataAxios from "../../../../server/data.axios"
import JammersCardList from "../../../../components_UI/CardList_Jammers/CardList_Jammers"
import {
  faBackward,
  faCalendarCheck,
  faEnvelopeOpenText,
  faPlus,
  faUserFriends,
} from "@fortawesome/free-solid-svg-icons"
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome"
import {RootState} from "../../../../redux/store"
import {useDispatch, useSelector} from "react-redux"
import {
  setFriendRequestsNumber,
  setJamRequestsNumber,
} from "../../../../redux/reducers/UserNotifications"
import JammersRequestsCardList from "../../../../components_UI/CardList_Jammers_JamRequests/CardList_Jammers_JamRequests"

export default function JamRequests() {
  const navigate = useNavigate()
  const location = useLocation()
  const [ifFiltering, setIfFiltering] = useState(false)
  const [ifSearching, setIfSearching] = useState(false)
  const [jammers, setJammers] = useState([])
  const [loading, setLoading] = useState(true)
  // const {page}: {page?: string} = useParams()
  const [currentPage, setCurrentPage] = useState(1)
  const [ifFiltered, setIfFiltered] = useState(false)
  const [gettingUrlParams, setGettingUrlParams] = useState(true)
  const [jamRequests, setJamRequests] = useState([])

  const [searchText, setSearchText] = useState<SearchText | any>({username: ""})

  const [params, setParams] = useState<IParams | SearchText | Object | any>({})
  const [totalPages, setTotalPages] = useState(0)

  const [reloadPage, setReloadPage] = useState(true)

  const dispatch = useDispatch()

  const CARD_LIST_TYPE = "Friend Requests"

  const userId = useSelector(
    (state: RootState) => state.userDataMongoDB.allUserData?._id
  )

  const MAX_PAGES_DISPLAYED = 9

  interface SearchText {
    username: string | null
  }

  useEffect(() => {
    const queryString = convertParamsToQueryString(params)
    const newUrl = `/jam-requests?page=${currentPage}&${queryString}`

    navigate(newUrl)
    navigate(newUrl)
  }, [currentPage, params, navigate])

  const handleSearchInput = (event: any) => {
    const currentSearchText = {
      ...searchText,
      username: event.target.value,
    }

    setSearchText(currentSearchText)
  }

  useEffect(() => {
    setLoading(true)
    const searchParams = new URLSearchParams(location.search)
    const urlParams = {
      country: parseNullOrUndefined(searchParams.get("country")) || "",
      region: parseNullOrUndefined(searchParams.get("region")) || "",
      city: parseNullOrUndefined(searchParams.get("city")) || "",
      isoCode: parseNullOrUndefined(searchParams.get("isoCode")) || "",
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
      urlParams.genres.length > 0 ||
      urlParams.instruments.length > 0
    ) {
      setParams(urlParams)
      setIfFiltered(true)
    }

    const urlParamsSearch = {
      username: parseNullOrUndefined(searchParams.get("username")) || "",
    }

    if (urlParamsSearch.username) {
      setParams(urlParamsSearch)
      setIfSearching(true)
      setSearchText(urlParamsSearch)
    }

    setLoading(false)
    setGettingUrlParams(false)
  }, [])

  function ifFilteringCB(ifFilteringProp: boolean) {
    setIfSearching(false)
    setIfFiltering(ifFilteringProp)
  }

  const fetchFilteredCB = async (params: Object | any) => {
    setLoading(true)
    setParams(params)
    setSearchText({username: ""})
    setIfSearching(false)
    setIfFiltered(true)
    setCurrentPage(1)
  }

  useEffect(() => {
    const fetchJammers = async () => {
      try {
        if (typeof userId === "string" && currentPage) {
          setLoading(true)

          const dataPaginate =
            await dataAxios.getAllJammersFromJamRequestsByHostedIdPaginate(
              userId,
              currentPage
            )

          // const dataAll = await dataAxios.getAllFriendRequestsByReceiverId(
          //   userId
          // )

          // console.log(dataPaginate.data.jamRequests)

          const jamRequests = dataPaginate.data.jamRequests

          const jammers = jamRequests.map(
            (jamRequest: any) => (jamRequest = jamRequest.receiverId)
          )
          console.log(jammers)
          console.log(dataPaginate)

          setJammers(jammers)

          setJamRequests(dataPaginate.data.jamRequests)
          setTotalPages(dataPaginate.data.totalPages)

          // dispatch(setFriendRequestsNumber(dataAll.friendRequests.length))

          // if (dataPaginate.friendRequests.length > 0) {
          //   const friendRequestSenders = dataPaginate.friendRequests.map(
          //     (request: any) => request.senderId
          //   )
          //   setJammers(friendRequestSenders)
          //   setTotalPages(dataPaginate.totalPages)
          // } else {
          //   setJammers([])
          //   setTotalPages(1)
          //   setLoading(false)
          // }
        }
        setLoading(false)
      } catch (error) {
        console.error("Error fetching jammers:", error)
        setLoading(false)
      }
    }

    fetchJammers()
  }, [currentPage, gettingUrlParams, reloadPage, userId])

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

  const handlePageUpdate = () => {
    setReloadPage(!reloadPage)
  }

  async function filteredStatusChange() {
    setLoading(true)
    setIfFiltered(false)
    setParams({})
    setCurrentPage(1)
  }

  const handleSearch = () => {
    setLoading(true)
    setIfSearching(true)
    setIfFiltered(false)
    setParams({...searchText})
    setCurrentPage(1)
  }

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

  return (
    <>
      <div className="container mt-4">
        {/* <div className="d-none d-xl-block"> */}
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
        <Row>
          <Col xl={4}>
            {jammers.length > 0 && (
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
        </Row>

        <div className="d-block d-xl-none">
          <Container>
            <h5
              style={{
                backgroundColor: "#f8f9fc",
                color: "#929292",
                // textAlign: "center",
                paddingBottom: "6px",
                paddingTop: "2px",
                paddingLeft: "5px",
                marginBottom: "20px",
              }}>
              Friend Requests
            </h5>
            <Row>
              <Col md={6}>
                <Button
                  variant="outline-dark"
                  // size="sm"
                  className="mr-2"
                  style={{
                    borderColor: "#BCBCBC",
                    marginRight: "20px",
                    marginBottom: "20px",
                    width: "100%",
                  }}
                  onClick={() => {
                    navigate("/jammersList")
                  }}>
                  <FontAwesomeIcon
                    style={{color: "#BCBCBC", marginRight: "12px"}}
                    icon={faPlus}
                    className="mr-1"
                  />{" "}
                  Browse Jammers
                </Button>
              </Col>

              <Col md={6}>
                <Button
                  variant="outline-dark"
                  // size="sm"
                  className="mr-2"
                  style={{
                    borderColor: "#BCBCBC",
                    marginRight: "20px",
                    marginBottom: "20px",
                    width: "100%",
                  }}
                  onClick={() => {
                    navigate("/my-friends")
                  }}>
                  <FontAwesomeIcon
                    style={{color: "#BCBCBC", marginRight: "12px"}}
                    icon={faUserFriends}
                    className="mr-1"
                  />{" "}
                  My Friends{" "}
                </Button>
              </Col>

              <Col xl={4}>
                {jammers.length > 0 && (
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

        {jammers && !loading ? (
          jammers.length > 0 ? (
            <JammersRequestsCardList
              jamRequests={jamRequests}
              updateListCB={handlePageUpdate}
              cardListType={CARD_LIST_TYPE}
              jammers={jammers}
            />
          ) : (
            <div className="container mt-4">
              <div className="row row-cols-2 row-cols-md-2 row-cols-lg-3 row-cols-xl-4">
                <p>You don't have Friend Requests.</p>
              </div>
            </div>
          )
        ) : (
          <Loader />
        )}

        {jammers.length > 4 && !loading && (
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
