import React, {useState} from "react"
import {
  ref as storageRef,
  uploadBytesResumable,
  getDownloadURL,
} from "firebase/storage"
import {getStorage} from "firebase/storage"

const storage = getStorage()
const placeholder =
  "https://i.pinimg.com/736x/0d/64/98/0d64989794b1a4c9d89bff571d3d5842.jpg"

interface ImageUploadProps {
  handleImageURL: (url: string) => void
  currentURL?: string | void
}

const ImageUpload2 = ({handleImageURL, currentURL}: ImageUploadProps) => {
  const [isUploading, setIsUploading] = useState(false)
  const [progress, setProgress] = useState(0)
  const [error, setError] = useState<string | null>(null)

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
              console.error("Error uploading image:", error)
              setError("Error uploading image. Please try again.")
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
      {error && <div className="text-danger">{error}</div>}
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
            />
          )}
        </button>
      </label>
    </div>
  )
}

export default ImageUpload2
