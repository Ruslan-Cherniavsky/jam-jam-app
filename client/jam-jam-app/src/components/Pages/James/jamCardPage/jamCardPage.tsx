import * as React from "react"
import Loader from "../../../../components_UI/Loaders/Loader"
import {useParams} from "react-router-dom"
import dataAxios from "../../../../server/data.axios"
import {useEffect, useState} from "react"
import {Col} from "react-bootstrap"
import JamCard from "../JamCard/JamCard"

import {Jam} from "../JamCard/JamCard"
function JamCardPage() {
  const [jemCardId, setJemCardId] = useState<any>(null)
  const [jemDataLocal, setJemDataLocal] = useState<Jam | null>(null)
  const params = useParams()

  useEffect(() => {
    setJemCardId(params.jamId)
  }, [params])

  useEffect(() => {
    if (jemCardId) {
      dataAxios.jemCardDataFetch(jemCardId).then((data) => {
        setJemDataLocal(data.jam)
      })
    } else {
      return
    }
  }, [jemCardId])

  return (
    <>
      <Col>{jemDataLocal ? <JamCard jam={jemDataLocal} /> : <Loader />}</Col>
    </>
  )
}

export default JamCardPage
