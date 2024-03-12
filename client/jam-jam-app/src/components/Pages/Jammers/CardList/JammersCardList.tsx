import React, {useState} from "react"
import {Navigate} from "react-router-dom"
import Card from "react-bootstrap/Card"
import ListGroup from "react-bootstrap/ListGroup"
import "bootstrap/dist/css/bootstrap.min.css"
import Button from "react-bootstrap/Button"
import "./JammersCardList.css"
import Loader from "../../../../components_UI/Loaders/Loader"

interface Jammer {
  _id: string
  userName: string
  city: string
  country: string
  instruments: Object[]
  genres: Object[]
  img?: string
}

interface JammersCardListProps {
  jammers: Jammer[]
}

const JammersCardList: React.FC<JammersCardListProps> = ({jammers}) => {
  const [selectedUserId, setSelectedUserId] = useState<string | null>(null)

  const handleCardClick = (userId: string) => {
    setSelectedUserId(userId)
  }

  return (
    <>
      <div className="row row-cols-2 row-cols-md-2 row-cols-lg-3 row-cols-xl-4">
        {jammers.map((jammer) => (
          <div key={jammer._id} className="col mb-4">
            <Card
              onClick={() => handleCardClick(jammer._id)}
              className={`custom-card ${
                selectedUserId === jammer._id ? "custom-selected" : ""
              }`}>
              {jammer.img ? (
                <Card.Img
                  variant="top"
                  src={jammer.img}
                  style={{
                    // maxHeight: "150px",
                    width: "100%",
                    objectFit: "cover",
                  }}
                  alt={`Profile image of ${jammer.userName}`}
                />
              ) : (
                <div
                  className="d-flex align-items-center justify-content-center"
                  style={{height: "150px"}}>
                  <span>No Image</span>
                </div>
              )}
              <Card.Body className=" text-center">
                <Card.Title
                  style={{
                    whiteSpace: "nowrap",
                    overflow: "hidden",
                    textOverflow: "ellipsis",
                  }}>
                  {jammer.userName || "- "}
                </Card.Title>
                <Card.Subtitle
                  className="mb-2 text-muted"
                  style={{
                    whiteSpace: "nowrap",
                    overflow: "hidden",
                    textOverflow: "ellipsis",
                  }}>{`${(jammer.city && jammer.city + ",") || " "} ${
                  jammer.country || " "
                }`}</Card.Subtitle>
                <ListGroup>
                  <div
                    style={{
                      whiteSpace: "nowrap",
                      overflow: "hidden",
                      textOverflow: "ellipsis",
                    }}>
                    {jammer.instruments
                      .map((instruments: any) => instruments.instrument)
                      .join(", ") || "- "}
                  </div>
                  <div
                    style={{
                      whiteSpace: "nowrap",
                      overflow: "hidden",
                      textOverflow: "ellipsis",
                    }}>
                    {jammer.genres
                      .map((genres: any) => genres.genre)
                      .join(", ") || "- "}
                  </div>
                </ListGroup>
              </Card.Body>
            </Card>
          </div>
        ))}
      </div>
      {selectedUserId && (
        <Navigate to={`/jamerCard/${selectedUserId}`} replace={true} />
      )}
    </>
  )
}

export default JammersCardList
