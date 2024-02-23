// Loader.tsx
import React from "react"
import "./JammingLoader.css"

const jamLoader: React.FC = () => {
  return (
    <div className="loader-container">
      <div className="loader-images">
        {/* {[1, 2, 3, 4, 5, 6, 7, 8].map((index) => ( */}
        <img
          key="1"
          className={`loader-image planet1}`}
          src={`https://www.svgrepo.com/show/423431/synthesizer.svg`} // Replace with actual image paths
          alt={`Image 1`}
        />
        {/* ))} */}
      </div>
      <p>text</p>
    </div>
  )
}

export default jamLoader
