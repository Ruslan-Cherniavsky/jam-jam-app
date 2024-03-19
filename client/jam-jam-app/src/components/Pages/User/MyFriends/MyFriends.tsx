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
import JammersCardList from "../../../../components_UI/CardList/CardList"
import {
  faBackward,
  faUserPlus,
  faPlus,
  faUserFriends,
} from "@fortawesome/free-solid-svg-icons"
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome"
import {useSelector} from "react-redux"
import {RootState} from "../../../../redux/store"
import {Link} from "react-router-dom"

const CARD_LIST_TYPE = "My Friends"

export default function MyFriends() {
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
  const [reloadPage, setReloadPage] = useState(true)

  const [searchText, setSearchText] = useState<SearchText | any>({username: ""})

  const [params, setParams] = useState<IParams | SearchText | Object | any>({})
  const [totalPages, setTotalPages] = useState(0)

  const userId = useSelector(
    (state: RootState) => state.userDataMongoDB.allUserData?._id
  )

  const MAX_PAGES_DISPLAYED = 9

  interface SearchText {
    username: string | null
  }

  useEffect(() => {
    const queryString = convertParamsToQueryString(params)
    const newUrl = `/my-friends?page=${currentPage}&${queryString}`

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
        // if (!ifFiltered && !gettingUrlParams && !ifSearching) {
        //   setSearchText({username: ""})

        //   setLoading(true)
        //   const data = await dataAxios.dataFetch(currentPage)
        //   setTotalPages(data.totalPages)
        //   setJammers(data.users)
        // } else if (ifFiltered && !ifSearching) {
        //   setSearchText({username: ""})

        //   setLoading(true)
        //   const data = await dataAxios.jammersFetchFiltered(params, currentPage)
        //   setTotalPages(data.totalPages)
        //   setJammers(data.users)
        // } else if (ifSearching) {
        //   setLoading(true)
        //   const data = await dataAxios.jammersFetchBySearch(params, currentPage)
        //   setTotalPages(data.totalPages)
        //   setJammers(data.users)
        // }
        if (typeof userId === "string") {
          setLoading(true)

          const data = await dataAxios.getAllFriendsByUserIdPaginate(
            userId,
            currentPage
          )
          console.log(data)
          setTotalPages(data.totalPages)

          setJammers(data.friends)
          setLoading(false)
        }

        setLoading(false)
      } catch (error) {
        console.error("Error fetching jammers:", error)
        setLoading(false)
      }
    }

    fetchJammers()
  }, [currentPage, gettingUrlParams, params, userId, reloadPage])

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
        {/* <br />
        <br /> */}
        <div className="d-none d-xl-block">
          <Container>
            <h5
              style={{
                backgroundColor: "#f8f9fc",
                color: "#929292",
                textAlign: "center",
                paddingBottom: "6px",
                paddingTop: "2px",
                marginBottom: "20px",
              }}>
              My Friends
            </h5>

            <Row>
              <Col xl={3}>
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

              <Col xl={3}>
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
                    navigate("/friendRequests")
                  }}>
                  <FontAwesomeIcon
                    style={{color: "#BCBCBC", marginRight: "12px"}}
                    icon={faUserPlus}
                    className="mr-1"
                  />{" "}
                  Friend Requests{" "}
                </Button>
              </Col>
              <Col xl={4} md={8} sm={8} xs={8}>
                <Form className="mb-2">
                  <FormControl
                    style={{margin: " 0px 0px 15px 0px"}}
                    type="text"
                    placeholder="Search by Username"
                    className="mr-sm-2"
                    onChange={handleSearchInput}
                    value={searchText?.username}
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
              </Col>
            </Row>
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

              {/* <Col xl={4}>
                <Form className="mb-2">
                  <FormControl
                    type="text"
                    placeholder="Search by Username"
                    className="mr-sm-2"
                    onChange={handleSearchInput}
                    value={searchText?.username}
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
              My Friends
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
                    navigate("/friendRequests")
                  }}>
                  <FontAwesomeIcon
                    style={{color: "#BCBCBC", marginRight: "12px"}}
                    icon={faUserPlus}
                    className="mr-1"
                  />{" "}
                  Friend Requests{" "}
                </Button>
              </Col>
              <Col xl={2}></Col>

              <Col xl={4} md={8} sm={8} xs={8}>
                <Form className="mb-2">
                  <FormControl
                    style={{margin: " 0px 0px 15px 0px"}}
                    type="text"
                    placeholder="Search by Username"
                    className="mr-sm-2"
                    onChange={handleSearchInput}
                    value={searchText?.username}
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
            <JammersCardList
              updateListCB={handlePageUpdate}
              cardListType={CARD_LIST_TYPE}
              jammers={jammers}
            />
          ) : (
            <div className="container mt-4">
              <div className="row row-cols-2 row-cols-md-2 row-cols-lg-3 row-cols-xl-4">
                <p>Jammers not found =(</p>
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
