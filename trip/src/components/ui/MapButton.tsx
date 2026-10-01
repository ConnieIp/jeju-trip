interface MapButtonProps {
  platform: 'naver' | 'kakao'
  address: string
}

function MapButton({ platform, address }: MapButtonProps) {
  const isNaver = platform === 'naver'
  const bgColor = isNaver ? 'bg-teal-bright hover:bg-teal-mid' : 'bg-yellow hover:bg-yellow/90'
  const textColor = isNaver ? 'text-white' : 'text-ink'

  const searchQuery = encodeURIComponent(address)
  const url = isNaver
    ? `https://map.naver.com/v5/search/${searchQuery}`
    : `https://map.kakao.com/?q=${searchQuery}`

  return (
    <a
      href={url}
      target="_blank"
      rel="noopener noreferrer"
      className={`flex items-center justify-center gap-2 w-full h-[46px] rounded-[13px] font-semibold text-[12px] transition-colors no-underline ${bgColor} ${textColor}`}
    >
      <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
        <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z" />
        <circle cx="12" cy="10" r="3" />
      </svg>
      {isNaver ? 'Naver Map' : 'Kakao Map'}
    </a>
  )
}

export default MapButton
