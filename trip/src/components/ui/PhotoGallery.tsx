interface PhotoGalleryProps {
  photos: string[]
}

function PhotoGallery({ photos }: PhotoGalleryProps) {
  if (photos.length === 0) {
    return (
      <div className="h-[430px] bg-border rounded-card flex items-center justify-center text-muted">
        No photos available
      </div>
    )
  }

  const heroPhoto = photos[0]
  const sidePhotos = photos.slice(1, 3)

  return (
    <div className="grid grid-cols-[2fr_0.92fr] gap-3 h-[430px] max-md:grid-cols-1 max-md:h-auto">
      <div className="relative rounded-card overflow-hidden">
        <img src={heroPhoto} alt="" className="w-full h-full object-cover" />
      </div>
      <div className="grid grid-rows-2 gap-3 max-md:grid-cols-2 max-md:grid-rows-1">
        {sidePhotos.map((photo, idx) => (
          <div key={idx} className="relative rounded-card overflow-hidden">
            <img src={photo} alt="" className="w-full h-full object-cover" />
          </div>
        ))}
        {sidePhotos.length === 0 && (
          <div className="relative rounded-card overflow-hidden bg-border" />
        )}
      </div>
    </div>
  )
}

export default PhotoGallery
