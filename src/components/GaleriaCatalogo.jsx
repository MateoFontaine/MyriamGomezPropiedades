import Gallery from "react-photo-gallery"
import Lightbox from "react-image-lightbox"
import "react-image-lightbox/style.css"
import { useState } from "react"

export default function GaleriaCatalogo({ imagenes }) {
  const [index, setIndex] = useState(0)
  const [isOpen, setIsOpen] = useState(false)

  // Convertir imágenes a formato requerido por react-photo-gallery
  const fotos = imagenes.map((src) => ({
    src,
    width: 4,
    height: 3,
  }))

  return (
    <>
      <Gallery
        photos={fotos}
        onClick={(event, { index }) => {
          setIndex(index)
          setIsOpen(true)
        }}
      />

      {isOpen && (
        <Lightbox
          mainSrc={imagenes[index]}
          nextSrc={imagenes[(index + 1) % imagenes.length]}
          prevSrc={imagenes[(index + imagenes.length - 1) % imagenes.length]}
          onCloseRequest={() => setIsOpen(false)}
          onMovePrevRequest={() =>
            setIndex((index + imagenes.length - 1) % imagenes.length)
          }
          onMoveNextRequest={() =>
            setIndex((index + 1) % imagenes.length)
          }
        />
      )}
    </>
  )
}
