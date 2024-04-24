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
  const [updatePage, setUpdatePage] = useState<Boolean>(false)
  const [ifPastEvent, setIfPastEvent] = useState<Boolean>(false)
  const params = useParams()

  const updateCBfunction = () => {
    setUpdatePage(!updatePage)
  }

  useEffect(() => {
    setJemCardId(params.jamId)
  }, [params])

  useEffect(() => {
    const currentDate = Date.now()

    if (jemCardId) {
      dataAxios.jemCardDataFetch(jemCardId).then((data) => {
        setJemDataLocal(data.jam)

        if (
          new Date(data.jam.jamDate).getTime() + 5 * 60 * 60 * 1000 <
          currentDate
        ) {
          setIfPastEvent(true)
        }
        // console.log(new Date(data.jam.jamDate).getTime())
        // console.log(new Date(data.jam.jamDate).getTime() + 5 * 60 * 60 * 1000)
        // console.log(currentDate)
        // console.log(data.jam.jamDate < currentDate)
      })
    } else {
      return
    }
  }, [jemCardId, updatePage])

  return (
    <>
      <Col>
        {jemDataLocal ? (
          <JamCard
            jam={jemDataLocal}
            ifPastEvent={ifPastEvent}
            updateCard={updateCBfunction}
          />
        ) : (
          <Loader />
        )}
      </Col>
    </>
  )
}

export default JamCardPage
