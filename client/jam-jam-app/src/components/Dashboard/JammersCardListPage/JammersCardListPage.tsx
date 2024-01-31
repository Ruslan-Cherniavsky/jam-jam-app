import {useEffect} from "react"

import Loader from "../../../components_UI/Loaders/Loader"
import {useSelector, useDispatch} from "react-redux"
import {RootState, AppDispatch} from "../../../redux/store"
import {setUsersData} from "../../../redux/reducers/JammersDataSliceMongoDB"
import dataAxios from "../../../server/data.axios"
import JammersCardList from "../../../components_UI/JammersCardList/JammersCardList"
import {useAuthContext} from "../../../context/AuthContext"

function JammersCardListPage() {
  const useAppDispatch: () => AppDispatch = useDispatch
  const dispatch = useAppDispatch()

  const {currentUser} = useAuthContext()

  const dataLocal = useSelector((state: RootState) => state.usersData.data)

  useEffect(() => {
    dataAxios.dataFetch().then((data) => {
      dispatch(setUsersData(data.users))
      console.log(data.users)
      console.log(currentUser)
    })
  }, [])

  return (
    <>
      {/* <JammersFilter jammers={dataLocal} /> */}

      {dataLocal.length > 0 ? (
        <JammersCardList jammers={dataLocal} />
      ) : (
        <Loader />
      )}
    </>
  )
}

export default JammersCardListPage
