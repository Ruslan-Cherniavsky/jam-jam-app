import React, {useRef, useState} from "react"
import {
  ref as storageRef,
  uploadBytesResumable,
  getDownloadURL,
} from "firebase/storage"
import {getStorage} from "firebase/storage"
import Demo from "./croper"

import Cropper, {ReactCropperElement} from "react-cropper"
import "cropperjs/dist/cropper.css"
import {Col, Container, Row} from "react-bootstrap"

const storage = getStorage()
const placeholder =
  "https://i.pinimg.com/736x/0d/64/98/0d64989794b1a4c9d89bff571d3d5842.jpg"

interface ImageUploadProps {
  handleImageURL: (url: string) => void
  currentURL?: string | void
}

const ImageUploadCrop = ({handleImageURL, currentURL}: ImageUploadProps) => {
  const [isUploading, setIsUploading] = useState(false)
  const [progress, setProgress] = useState(0)
  const [error, setError] = useState<string | null>(null)
  const [uploadedImage, setUploadedImage] = useState<File | null>(null)

  const [imageURL, setImageURL] = useState(currentURL || "")

  const [imagePreview, setImagePreview] = useState<string | null>(null)

  const cropperRef = useRef<ReactCropperElement>(null)

  const onCrop = async (event: any) => {
    event.preventDefault() // Prevent the default form submission behavior

    console.log("croped")
    try {
      if (uploadedImage) {
        const cropper = cropperRef.current?.cropper
        if (cropper) {
          const croppedCanvas = cropper.getCroppedCanvas()
          croppedCanvas.toBlob(async (blob) => {
            if (blob) {
              const croppedFile = new File([blob], uploadedImage.name, {
                type: uploadedImage.type,
              })

              setUploadedImage(croppedFile)

              // const reader = new FileReader()
              // reader.onload = () => {
              //   setImagePreview(reader.result as string)
              // }
              // reader.readAsDataURL(croppedFile)

              const storageReference = storageRef(
                storage,
                `cropped-images/${croppedFile.name}`
              )
              const uploadTask = uploadBytesResumable(
                storageReference,
                croppedFile
              )

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
                      console.error("Error uploading cropped image:", error)
                      setError(
                        "Error uploading cropped image. Please try again."
                      )
                    })
                  setIsUploading(false)
                }
              )
            }
          })
        }
      }
    } catch (error) {
      console.error("Error cropping image:", error)
    }
  }

  const handleUpload = async (event: any) => {
    event.preventDefault()
    try {
      setIsUploading(true)
      const file = event.target.files[0]
      setUploadedImage(file)

      const reader = new FileReader()
      reader.onload = () => {
        setImagePreview(reader.result as string) // Set preview directly from the FileReader result
      }
      reader.readAsDataURL(file)
    } catch (error) {
      console.error("Error uploading image:", error)
    }
  }

  return (
    <Container>
      <Row>
        {error && <div className="text-danger">{error}</div>}

        {/* <Col md={3} lg={3}> */}

        <div style={{display: isUploading ? "none" : "block"}}>
          <img
            className="img-fluid rounded"
            src={imageURL || placeholder}
            style={{width: "300px"}}
            alt={placeholder}
          />
        </div>

        <div style={{display: isUploading ? "block" : "none"}}>
          <Cropper
            src={imagePreview || placeholder}
            style={{width: "300px"}}
            // Cropper.js options
            initialAspectRatio={16 / 9}
            aspectRatio={16 / 9} // Set the aspectRatio to make it unchangeable
            guides={false}
            crop={onCrop}
            ref={cropperRef}
          />
        </div>

        <input
          type="file"
          id="fileInput"
          style={{display: "none"}}
          onChange={handleUpload}
        />

        <div style={{display: isUploading ? "none" : "block"}}>
          <button
            type="button"
            onClick={() => document.getElementById("fileInput")?.click()}
            // style={{border: "none", background: "none", padding: 0}}
          >
            Upload
          </button>
        </div>

        <div style={{display: isUploading ? "block" : "none"}}>
          <button onClick={onCrop}>Crop</button>
        </div>
      </Row>
    </Container>
  )
}

export default ImageUploadCrop
