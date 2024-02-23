import {useEffect, useState} from "react"

import Loader from "../../../../components_UI/Loaders/Loader"
import {useSelector, useDispatch} from "react-redux"
import {RootState, AppDispatch} from "../../../../redux/store"
import {setUsersData} from "../../../../redux/reducers/JammersDataSliceMongoDB"
import dataAxios from "../../../../server/data.axios"
import JammersCardList from "../CardList/JammersCardList"
import {useAuthContext} from "../../../../context/AuthContext"
import {Col, Container, Pagination, Row} from "react-bootstrap"
import Sidebar from "../../../SideBar/SideBar"
import Filter from "../../../../components_UI/Filter/Filter/Filter"
import ReactPaginate from "react-paginate"
import axios from "axios"

function JammersCardListPage() {
  const useAppDispatch: () => AppDispatch = useDispatch
  const dispatch = useAppDispatch()
  const [ifFiltering, setIfFiltering] = useState(false)
  const [jammers, setJammers] = useState([])
  const [loading, setLoading] = useState(true)
  const [currentPage, setCurrentPage] = useState(1)
  const [ifFiltered, setIfFiltered] = useState(false)
  const [params, setParams] = useState<Object | any>({})

  const [totalPages, setTotalPages] = useState(0)

  function ifFilteringCB(ifFilteringProp: boolean) {
    setIfFiltering(ifFilteringProp)
  }

  const fetchFilteredCB = async (params: Object | any) => {
    // const {data} = await axios.get(
    //   `http://localhost:3500/users/jammersfetchfiltered?page=${currentPage}`,
    //   {params}
    // )
    setLoading(true)

    // const data = await dataAxios.jammersFetchFiltered(params, 1)

    // console.log(params)
    setParams(params)
    setIfFiltered(true)
    // setTotalPages(data.totalPages)
    // setJammers(data.users)
    setCurrentPage(1)
    // setLoading(false)
  }

  useEffect(() => {
    const fetchJammers = async () => {
      try {
        if (!ifFiltered) {
          setLoading(true)

          // const {data} = await axios.get(
          //   `http://localhost:3500/users/getallusers?page=${currentPage}`
          // )

          const data = await dataAxios.dataFetch(currentPage)
          setTotalPages(data.totalPages)
          setJammers(data.users)
        }
        if (ifFiltered && params) {
          setLoading(true)

          console.log("this is current params", params)

          // const {data} = await axios.get(
          //   `http://localhost:3500/users/jammersfetchfiltered?page=${currentPage}`,
          //   {params}
          // )
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

    // const data = await dataAxios.dataFetch(currentPage)
    // setJammers(data.users)
    // setTotalPages(data.totalPages)
    setParams({})

    setCurrentPage(1)
    setIfFiltered(false)
    setLoading(false)
  }

  return (
    <>
      <div className="container mt-4">
        <Filter
          filteredStatusChange={filteredStatusChange}
          setIfFilteringCB={ifFilteringCB}
          fetchFilteredCB={fetchFilteredCB}
          currentPage={currentPage}
        />
        <Pagination>
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
