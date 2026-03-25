'use client'

export default function LogoImg() {
  return (
    <img
      src="/logo.png"
      alt="Andy's Mayotte"
      className="h-16 w-16 rounded-xl object-cover shrink-0"
      onError={e => { e.target.style.display = 'none' }}
    />
  )
}
