import { photoUrl } from '../../lib/photoUrl'
import { useCoverPhoto } from '../../hooks/useCoverPhoto'

interface PhotoGalleryProps {
  photos: string[]
}

function PhotoGallery({ photos }: PhotoGalleryProps) {
  const { src: heroPhoto, ready } = useCoverPhoto(photos)

  if (photos.length === 0) {
    return (
      <div className="h-[430px] bg-border rounded-card flex items-center justify-center text-muted">
        No photos available
      </div>
    )
  }

  const sidePhotos = photos.slice(1, 3)

  return (
    <div className="grid grid-cols-[2fr_0.92fr] gap-3.5 h-[430px] mb-[26px] overflow-hidden max-[640px]:grid-cols-1 max-[640px]:grid-rows-[2fr_1fr] max-[640px]:h-[430px]">
      <div className="relative rounded-card overflow-hidden">
        {ready && <img src={photoUrl(heroPhoto)} alt="" className="w-full h-full object-cover block" />}
      </div>
      <div className="flex flex-col gap-3.5 max-[640px]:flex-row max-[640px]:min-h-0">
        {sidePhotos.map((photo, idx) => (
          <div key={idx} className="relative rounded-card overflow-hidden flex-1 max-[640px]:w-[calc(50%-7px)] max-[640px]:h-full">
            <img src={photoUrl(photo)} alt="" className="w-full h-full object-cover block" />
          </div>
        ))}
        {sidePhotos.length === 0 && (
          <div className="relative rounded-card overflow-hidden bg-border flex-1" />
        )}
      </div>
    </div>
  )
}

export default PhotoGallery
