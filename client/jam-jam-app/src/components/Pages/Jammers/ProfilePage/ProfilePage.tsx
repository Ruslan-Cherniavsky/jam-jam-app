import * as React from "react"
import Loader from "../../../../components_UI/Loaders/Loader"
import {useParams} from "react-router-dom"
import dataAxios from "../../../../server/data.axios"
import Profile from "../Profile/Profile"
import {useEffect, useState} from "react"
import {Col} from "react-bootstrap"

function JamerCardPage() {
  const [jemerCardId, setJemerCardId] = useState<any>(null)
  const [jemerDataLocal, setJemerDataLocal] = useState<any>(null)
  const params = useParams()

  useEffect(() => {
    setJemerCardId(params.jamerId)
  }, [params])

  useEffect(() => {
    if (jemerCardId) {
      dataAxios.jemerCardDataFetch(jemerCardId).then((data) => {
        setJemerDataLocal(data.user)
      })
    } else {
      return
    }
  }, [jemerCardId])

  return (
    <>
      <Col>
        {jemerDataLocal ? <Profile jammer={jemerDataLocal} /> : <Loader />}
      </Col>
    </>
  )
}

export default JamerCardPage
