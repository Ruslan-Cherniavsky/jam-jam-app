import React from "react"
import {MapContainer, TileLayer, Marker, Popup} from "react-leaflet"
import "leaflet/dist/leaflet.css"

import L from "leaflet"
import {faDrum} from "@fortawesome/free-solid-svg-icons"

const customMarker = new L.Icon({
  iconUrl: "https://pic.onlinewebfonts.com/thumbnails/icons_328285.svg",
  iconSize: [38, 38],
  // iconAnchor: [22, 94],
  // popupAnchor: [-3, -76],
})

const MapDisplay = ({coordinates}: {coordinates: any}) => {
  return (
    <MapContainer
      center={coordinates}
      zoom={13}
      style={{height: "400px", width: "100%"}}>
      <TileLayer
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />

      <Marker position={coordinates} icon={customMarker}>
        {" "}
        <Popup>
          A pretty CSS3 popup. <br /> Easily customizable.
        </Popup>
      </Marker>
    </MapContainer>
  )
}

export default MapDisplay
