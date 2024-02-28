import {useEffect, useState} from "react"
import Loader from "../../../../components_UI/Loaders/Loader"
import {useDispatch} from "react-redux"
import {AppDispatch} from "../../../../redux/store"
import dataAxios from "../../../../server/data.axios"
import JammersCardList from "../CardList/JammersCardList"
import {Pagination} from "react-bootstrap"
import Filter, {IParams} from "../../../../components_UI/Filter/Filter/Filter"
import {Navigate, useLocation, useNavigate, useParams} from "react-router-dom"
import "./CardListPage.css"
import {Country} from "country-state-city"

function JammersCardListPage() {
  const navigate = useNavigate()
  const location = useLocation() // Use useLocation hook directly
  const useAppDispatch: () => AppDispatch = useDispatch
  const [ifFiltering, setIfFiltering] = useState(false)
  const [jammers, setJammers] = useState([])
  const [loading, setLoading] = useState(true)
  const {page}: {page?: string} = useParams()

  const [currentPage, setCurrentPage] = useState(1)
  const [ifFiltered, setIfFiltered] = useState(false)
  const [params, setParams] = useState<IParams | Object | any>({})
  const [totalPages, setTotalPages] = useState(0)
  const [urlSearchParams, setUrlSearchParams] = useState<IParams | any>({})

  //url from search params set by use navigate
  useEffect(() => {
    const queryString = convertParamsToQueryString(params)
    const newUrl = `/jammersList?page=${currentPage}&${queryString}`

    navigate(newUrl)
  }, [currentPage, params, navigate])

  useEffect(() => {
    setLoading(true)

    // Parse URL parameters and update state
    const searchParams = new URLSearchParams(location.search)
    const urlParams = {
      // page: parseInt(searchParams.get("page")) || 1,
      country: parseNullOrUndefined(searchParams.get("country")) || "",
      region: parseNullOrUndefined(searchParams.get("region")) || "",
      city: parseNullOrUndefined(searchParams.get("city")) || "",
      isoCode: parseNullOrUndefined(searchParams.get("isoCode")) || "",
      genres: searchParams.getAll("genres[]") || [],
      instruments: searchParams.getAll("instruments[]") || [],
    }
    setUrlSearchParams(urlParams)

    const urlParams2 = {
      page: searchParams.get("page") || "1",
    }

    function parseNullOrUndefined(value: any) {
      return value === "null" ? null : value || null
    }

    // Set initial currentPage based on the page parameter

    setCurrentPage(Number(urlParams2.page))

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

    // setIfFiltered(false)
    setLoading(false)

    // ... rest of the code
  }, [])

  const convertParamsToQueryString = (params: any) => {
    return Object.keys(params)
      .map((key) => {
        if (Array.isArray(params[key])) {
          // If the property is an array, format it as an array in the query string
          return params[key].map((value: any) => `${key}[]=${value}`).join("&")
        } else {
          // If the property is not an array, format it normally
          return `${key}=${params[key]}`
        }
      })
      .join("&")
  }

  function ifFilteringCB(ifFilteringProp: boolean) {
    setIfFiltering(ifFilteringProp)
  }

  const fetchFilteredCB = async (params: Object | any) => {
    setLoading(true)
    setParams(params)
    setIfFiltered(true)
    setCurrentPage(1)
  }

  useEffect(() => {
    const fetchJammers = async () => {
      try {
        if (!ifFiltered) {
          setLoading(true)
          const data = await dataAxios.dataFetch(currentPage)
          setTotalPages(data.totalPages)
          setJammers(data.users)
        }
        if (ifFiltered) {
          setLoading(true)
          const data = await dataAxios.jammersFetchFiltered(params, currentPage)

          // setIfFiltered(true)
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
  }, [currentPage, params])

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
        <Filter
          filteredStatusChange={filteredStatusChange}
          setIfFilteringCB={ifFilteringCB}
          fetchFilteredCB={fetchFilteredCB}
        />
        {jammers.length > 0 && (
          <Pagination className="my-custom-pagination">
            <Pagination.Prev
              onClick={() => handlePageChange(currentPage - 2)}
              disabled={currentPage === 1}
            />
            {Array.from({length: totalPages}).map((_, index) => (
              <Pagination.Item
                key={index + 1}
                active={currentPage === index + 1}
                onClick={() => handlePageChange(index)}>
                {index + 1}
              </Pagination.Item>
            ))}
            <Pagination.Next
              onClick={() => handlePageChange(currentPage)}
              disabled={currentPage === totalPages}
            />
          </Pagination>
        )}

        {jammers && !ifFiltering && !loading ? (
          jammers.length > 0 ? (
            <JammersCardList jammers={jammers} />
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
      </div>
    </>
  )
}

export default JammersCardListPage
