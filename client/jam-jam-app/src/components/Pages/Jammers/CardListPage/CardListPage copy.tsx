import {useEffect, useState} from "react"

import Loader from "../../../../components_UI/Loaders/Loader"
import {useSelector, useDispatch} from "react-redux"
import {RootState, AppDispatch} from "../../../../redux/store"
import {setUsersData} from "../../../../redux/reducers/JammersDataSliceMongoDB"
import dataAxios from "../../../../server/data.axios"
import JammersCardList from "../CardList/JammersCardList"
import {useAuthContext} from "../../../../context/AuthContext"
import {Col, Container, Row} from "react-bootstrap"
import Sidebar from "../../../SideBar/SideBar"
import Filter from "../../../../components_UI/Filter/Filter/Filter"

function JammersCardListPage() {
  const useAppDispatch: () => AppDispatch = useDispatch
  const dispatch = useAppDispatch()
  const [ifFiltering, setIfFiltering] = useState(false)

  function ifFilteringCB(ifFilteringProp: boolean) {
    setIfFiltering(ifFilteringProp)
  }

  const dataLocal = useSelector((state: RootState) => state.usersData.data)

  // useEffect(() => {
  //   dataAxios.dataFetch().then((data) => {
  //     dispatch(setUsersData(data.users))
  //   })
  // }, [])

  return (
    <>
      {/* <div className="container mt-4">
        <Filter setIfFilteringCB={ifFilteringCB} />

        {dataLocal && !ifFiltering ? (
          dataLocal.length > 0 ? (
            <JammersCardList jammers={dataLocal} />
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
      </div> */}
    </>
  )
}

export default JammersCardListPage
