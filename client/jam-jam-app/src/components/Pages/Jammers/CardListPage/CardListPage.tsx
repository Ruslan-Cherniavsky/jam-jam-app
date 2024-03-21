import {useEffect, useState} from "react"
import Loader from "../../../../components_UI/Loaders/Loader"
import dataAxios from "../../../../server/data.axios"
import JammersCardList from "../../../../components_UI/CardList/CardList"
import {
  Button,
  Col,
  Container,
  Form,
  FormControl,
  Pagination,
  Row,
} from "react-bootstrap"
import Filter, {IParams} from "../Filter/Filter"
import {useLocation, useNavigate, useParams} from "react-router-dom"
import "./CardListPage.css"

function JammersCardListPage() {
  const navigate = useNavigate()
  const location = useLocation()
  const [ifFiltering, setIfFiltering] = useState(false)
  const [ifSearching, setIfSearching] = useState(false)
  const [jammers, setJammers] = useState([])
  const [loading, setLoading] = useState(true)
  const {page}: {page?: string} = useParams()
  const [currentPage, setCurrentPage] = useState(1)
  const [ifFiltered, setIfFiltered] = useState(false)
  const [gettingUrlParams, setGettingUrlParams] = useState(true)

  const [searchText, setSearchText] = useState<SearchText | any>({username: ""})

  const [params, setParams] = useState<IParams | SearchText | Object | any>({})
  const [totalPages, setTotalPages] = useState(0)

  const MAX_PAGES_DISPLAYED = 9
  const CARD_LIST_TYPE = "Browse Jammers"

  interface SearchText {
    username: string | null
  }

  useEffect(() => {
    const queryString = convertParamsToQueryString(params)
    const newUrl = `/jammersList?page=${currentPage}&${queryString}`

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
    setSearchText({username: ""})
    setIfSearching(false)
    setIfFiltered(true)
    setCurrentPage(1)
  }

  useEffect(() => {
    const fetchJammers = async () => {
      try {
        if (!ifFiltered && !gettingUrlParams && !ifSearching) {
          setSearchText({username: ""})

          setLoading(true)
          const data = await dataAxios.dataFetch(currentPage)
          setTotalPages(data.totalPages)
          setJammers(data.users)
        } else if (ifFiltered && !ifSearching) {
          setSearchText({username: ""})

          setLoading(true)
          const data = await dataAxios.jammersFetchFiltered(params, currentPage)
          setTotalPages(data.totalPages)
          setJammers(data.users)
        } else if (ifSearching) {
          setLoading(true)
          const data = await dataAxios.jammersFetchBySearch(params, currentPage)
          setTotalPages(data.totalPages)
          setJammers(data.users)
        }
        setLoading(false)
      } catch (error) {
        console.error("Error fetching jammers:", error)
        setLoading(false)
      }
    }

    fetchJammers()
  }, [currentPage, gettingUrlParams, params])

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

  async function filteredStatusChange() {
    setLoading(true)
    setIfFiltered(false)
    setParams({})
    setCurrentPage(1)
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
          Explore Jammers
        </h5>
        <Filter
          searching={ifSearching}
          filteredStatusChange={filteredStatusChange}
          setIfFilteringCB={ifFilteringCB}
          fetchFilteredCB={fetchFilteredCB}
        />

        <div className="d-none d-xl-block">
          <Container>
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

              <Col xl={4}>
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
              </Col>
            </Row>
          </Container>
        </div>

        <div className="d-block d-xl-none">
          <Container>
            <Row>
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

        {jammers && !ifFiltering && !loading ? (
          jammers.length > 0 ? (
            <JammersCardList
              updateListCB={handlePageChange}
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

export default JammersCardListPage
