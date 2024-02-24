import {useEffect, useState} from "react"
import Loader from "../../../../components_UI/Loaders/Loader"
import {useDispatch} from "react-redux"
import {AppDispatch} from "../../../../redux/store"
import dataAxios from "../../../../server/data.axios"
import JammersCardList from "../CardList/JammersCardList"
import {Pagination} from "react-bootstrap"
import Filter, {IParams} from "../../../../components_UI/Filter/Filter/Filter"
import {Navigate, useNavigate, useParams} from "react-router-dom"
import "./CardListPage.css"

function JammersCardListPage() {
  const useAppDispatch: () => AppDispatch = useDispatch
  const dispatch = useAppDispatch()
  const [ifFiltering, setIfFiltering] = useState(false)
  const [jammers, setJammers] = useState([])
  const [loading, setLoading] = useState(true)
  const {page, params: urlParams} = useParams()
  const [currentPage, setCurrentPage] = useState(Number(page) || 1) // Convert to number or default to 1

  const [ifFiltered, setIfFiltered] = useState(false)
  const [params, setParams] = useState<IParams | Object | any>({})
  const [totalPages, setTotalPages] = useState(0)

  const navigate = useNavigate()
  useEffect(() => {
    if (!params) {
      const newUrl = `/jammersList/${currentPage}`
      navigate(newUrl)
    }
    if (params) {
      const queryString = convertParamsToQueryString(params)

      const newUrl = `/jammersList/page=${currentPage}&${queryString}`
      navigate(newUrl)
      // console.log(convertQueryStringToParams(queryString))
      console.log(urlParams)
      // console.log("WORRRRKKK")
    }
  }, [params, currentPage])

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

  const convertQueryStringToParams = (
    queryString: string
  ): Record<string, string | string[]> => {
    const params: Record<string, string | string[]> = {}
    const pairs = queryString.split("&")

    for (const pair of pairs) {
      const [key, value] = pair.split("=")
      const decodedKey = decodeURIComponent(key)
      const decodedValue = decodeURIComponent(value.replace(/\+/g, " "))

      if (decodedKey.includes("[]")) {
        const arrayKey = decodedKey.slice(0, -2)
        params[arrayKey] = (params[arrayKey] as string[]) || []
        ;(params[arrayKey] as string[]).push(decodedValue)
      } else {
        params[decodedKey] = decodedValue
      }
    }

    return params
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
        // if (urlParams?.includes("&country=")) {
        //   console.log("paraaaaaaaaaaaaaaaaaaaaaaaaaaams", params)
        //   console.log(
        //     "paraaaaaaaaaaaaaaaaaaaaaaaaaaamseeeeeee",
        //     convertQueryStringToParams(urlParams)
        //   )
        // }

        if (!ifFiltered) {
          setLoading(true)
          const data = await dataAxios.dataFetch(currentPage)
          setTotalPages(data.totalPages)
          setJammers(data.users)
        }
        if (ifFiltered && params) {
          setLoading(true)
          const data = await dataAxios.jammersFetchFiltered(params, currentPage)

          setIfFiltered(true)
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
