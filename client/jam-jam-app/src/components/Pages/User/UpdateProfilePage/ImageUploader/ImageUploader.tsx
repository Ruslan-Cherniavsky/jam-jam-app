import React, {useState} from "react"
import {ProgressBar, Form, Button} from "react-bootstrap"
import {
  ref as storageRef,
  uploadBytesResumable,
  getDownloadURL,
} from "firebase/storage"
import {getStorage} from "firebase/storage"

const storage = getStorage()
const placeholder =
  "https://i.pinimg.com/736x/0d/64/98/0d64989794b1a4c9d89bff571d3d5842.jpg"

const ImageUpload = ({
  handleImageURL,
  currentURL,
}: {
  handleImageURL: Function
  currentURL: string | void
}) => {
  const [isUploading, setIsUploading] = useState(false)
  const [progress, setProgress] = useState(0)

  const [imageURL, setImageURL] = useState(currentURL || "")

  const handleUpload = async (event: any) => {
    try {
      const file = event.target.files[0]
      const storageReference = storageRef(storage, `images/${file.name}`)
      const uploadTask = uploadBytesResumable(storageReference, file)

      uploadTask.on(
        "state_changed",
        (snapshot) => {
          const progress =
            (snapshot.bytesTransferred / snapshot.totalBytes) * 100
          setProgress(progress)
        },
        (error) => {
          console.error(error)
        },
        () => {
          getDownloadURL(uploadTask.snapshot.ref)
            .then((downloadURL) => {
              setImageURL(downloadURL)
              handleImageURL(downloadURL)
            })
            .catch((error) => {
              console.error("Error getting download URL:", error)
            })
          setIsUploading(true)
        }
      )
    } catch (error) {
      console.error("Error uploading image:", error)
    }
  }

  return (
    <div className="mt-4">
      <label htmlFor="fileInput" style={{cursor: "pointer"}}>
        <input
          type="file"
          id="fileInput"
          style={{display: "none"}}
          onChange={handleUpload}
        />
        <button
          type="button"
          onClick={() => document.getElementById("fileInput")?.click()}
          style={{border: "none", background: "none", padding: 0}}>
          {isUploading && progress > 100 ? (
            // <ProgressBar
            //   now={progress}
            //   label={`${progress.toFixed(2)}%`}
            //   className="mt-2"
            // />
            <img
              src={imageURL}
              alt="Upload"
              className="img-fluid rounded"
              style={{maxWidth: "250px", opacity: "50%"}}
            />
          ) : (
            <img
              src={imageURL ? imageURL : currentURL || placeholder}
              alt="Upload"
              className="img-fluid rounded"
              style={{maxWidth: "250px"}}
            />
          )}
        </button>
      </label>

      {/* <Form.Group controlId="formFile" className="mb-3">
        <Form.Label>Choose an image to upload:</Form.Label>
        <Form.Control
          required={imageURL == ""}
          type="file"
          onChange={handleUpload}
        />
      </Form.Group> */}

      {/* {isUploading && (
        <ProgressBar
          now={progress}
          label={`${progress.toFixed(2)}%`}
          className="mt-2"
        />
      )} */}

      {/* {imageURL && (
        <div className="mt-2">
          <img
            src={imageURL}
            alt="Uploaded"
            className="img-fluid rounded"
            style={{maxWidth: "250px"}}
          />
        </div>
      )} */}
      {/* <Button variant="primary" className="mt-2" disabled={isUploading}>
        Upload Image
      </Button> */}
    </div>
  )
}

export default ImageUpload
