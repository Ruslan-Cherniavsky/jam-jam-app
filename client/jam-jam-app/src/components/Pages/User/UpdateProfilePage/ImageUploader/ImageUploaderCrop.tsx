import React, {useRef, useState} from "react"
import {
  ref as storageRef,
  uploadBytesResumable,
  getDownloadURL,
} from "firebase/storage"
import {getStorage} from "firebase/storage"

import Cropper, {ReactCropperElement} from "react-cropper"
import "cropperjs/dist/cropper.css"
import {Button, Col, Container, Row} from "react-bootstrap"

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
  const [loading, setLoading] = useState(false)

  const [imageURL, setImageURL] = useState(currentURL || "")

  const [imagePreview, setImagePreview] = useState<string | null>(null)

  const cropperRef = useRef<ReactCropperElement>(null)

  const onCrop = async (event: any) => {
    event.preventDefault() // Prevent the default form submission behavior
    setError("")

    console.log("croped")
    try {
      if (uploadedImage) {
        setLoading(true)

        const cropper = cropperRef.current?.cropper

        if (cropper) {
          const croppedCanvas = cropper.getCroppedCanvas()
          const croppedBlob = await new Promise<Blob | null>((resolve) =>
            croppedCanvas.toBlob((blob) => resolve(blob), "image/jpeg", 0.8)
          )

          if (croppedBlob) {
            const resizedBlob = await resizeImage(croppedBlob, 600, 600)

            if (resizedBlob) {
              const croppedFile = new File([resizedBlob], uploadedImage.name, {
                type: "image/jpeg",
              })

              setUploadedImage(croppedFile)

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
                  setLoading(false)
                }
              )
            }
          }
        }
      }
    } catch (error) {
      console.error("Error cropping image:", error)
    }
  }

  const resizeImage = async (
    blob: Blob,
    maxWidth: number,
    maxHeight: number
  ): Promise<Blob | null> => {
    return new Promise((resolve) => {
      const image = new Image()

      image.onload = () => {
        const canvas = document.createElement("canvas")
        const context = canvas.getContext("2d")!

        let width = image.width
        let height = image.height

        if (width > maxWidth || height > maxHeight) {
          const ratio = Math.min(maxWidth / width, maxHeight / height)
          width = width * ratio
          height = height * ratio
        }

        canvas.width = width
        canvas.height = height

        context.drawImage(image, 0, 0, width, height)

        canvas.toBlob(
          (resizedBlob) => {
            resolve(resizedBlob)
          },
          "image/jpeg",
          0.8
        )
      }

      image.src = URL.createObjectURL(blob)
    })
  }

  const handleUpload = async (event: any) => {
    event.preventDefault()
    setError("")
    try {
      setLoading(true)
      setIsUploading(true)
      const file = event.target.files[0]

      const allowedFormats = ["image/jpeg", "image/png"] // Add or remove formats as needed
      if (!allowedFormats.includes(file.type)) {
        setLoading(false)
        setIsUploading(false)
        setError("Invalid file format. Please choose a JPEG or PNG image.")
        return
      }

      const maxSizeInBytes = 5 * 1024 * 1024 // 5 MB as an example, adjust as needed
      if (file.size > maxSizeInBytes) {
        setLoading(false)
        setIsUploading(false)
        setError(
          "Image size exceeds the maximum allowed size (5 MB). Please choose a smaller image."
        )
        return
      }

      setUploadedImage(file)

      const reader = new FileReader()
      reader.onload = () => {
        setImagePreview(reader.result as string) // Set preview directly from the FileReader result
      }
      reader.readAsDataURL(file)
      setLoading(false)
    } catch (error) {
      console.error("Error uploading image:", error)
    }
  }

  return (
    <>
      {error && <div className="text-danger">{error}</div>}

      {/* <Col md={3} lg={3}> */}

      <div style={{display: isUploading ? "none" : "block"}}>
        <img
          // className="img-fluid rounded"
          className="w-100"
          src={imageURL || placeholder}
          style={{width: "300px"}}
          alt={placeholder}
        />
      </div>

      <div style={{display: isUploading ? "block" : "none"}}>
        <Cropper
          src={imagePreview || placeholder}
          style={{width: "300px"}}
          className="w-100"
          // Cropper.js options
          initialAspectRatio={1 / 1}
          aspectRatio={1 / 1} // Set the aspectRatio to make it unchangeable
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
        <Button
          variant="outline-dark"
          style={{marginTop: "16px"}}
          disabled={loading}
          className="w-100"
          type="button"
          onClick={() => document.getElementById("fileInput")?.click()}>
          Upload
        </Button>
      </div>

      <div style={{display: isUploading ? "block" : "none"}}>
        <Button
          variant="outline-dark"
          style={{marginTop: "16px"}}
          disabled={loading}
          className="w-100"
          type="button"
          // className="btn btn-success mt-2" // Add Bootstrap button classes
          onClick={onCrop}>
          Crop
        </Button>
      </div>
    </>
  )
}

export default ImageUploadCrop
