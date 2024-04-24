import React, {useEffect, useState} from "react"
import MapDisplay from "./MapDisplay"
import axios from "axios"

const MapWithSearch = ({city, country}: {city: string; country: string}) => {
  // const [address, setAddress] = useState(city)
  const [coordinates, setCoordinates] = useState<any>(null)

  const adress = "1681 Broadway" // TODO ---- create street in jam model and in input

  const testCity = "Tel Aviv"
  const testCountry = "israel"
  const testAdress = "אשרמן יוסף 24"

  useEffect(() => {
    axios
      .get(
        `https://nominatim.openstreetmap.org/search?q=${testAdress},${testCity},${testCountry}&format=json`
      )
      .then((response) => {
        const {lat, lon} = response.data[0]
        setCoordinates({lat: parseFloat(lat), lng: parseFloat(lon)})
      })
      .catch((error) => {
        console.error("Error fetching coordinates: ", error)
      })
  }, [])

  // const handleSearch = () => {
  //   axios
  //     .get(
  //       `https://nominatim.openstreetmap.org/search?q=${address}&format=json`
  //     )
  //     .then((response) => {
  //       const {lat, lon} = response.data[0]
  //       setCoordinates({lat: parseFloat(lat), lng: parseFloat(lon)})
  //     })
  //     .catch((error) => {
  //       console.error("Error fetching coordinates: ", error)
  //     })
  // }

  return (
    <div>
      {/* <input
        type="text"
        placeholder="Enter an address"
        value={address}
        onChange={(e) => setAddress(e.target.value)}
      /> */}
      {/* <button onClick={handleSearch}>Search</button> */}

      {coordinates && (
        <MapDisplay coordinates={[coordinates.lat, coordinates.lng]} />
      )}
    </div>
  )
}

export default MapWithSearch
