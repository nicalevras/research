import { useState } from 'react'

function vendorInitial(name: string) {
  return name.trim().charAt(0).toUpperCase() || '?'
}

interface VendorAvatarProps {
  vendor: {
    name: string
    logoUrl: string | null
  }
  loading?: 'eager' | 'lazy'
}

export function VendorAvatar({ vendor, loading = 'lazy' }: VendorAvatarProps) {
  const [imageUnavailable, setImageUnavailable] = useState(false)
  const fallback = (
    <span className="flex h-full w-full items-center justify-center text-2xl font-semibold text-neutral-400 dark:text-neutral-500">
      {vendorInitial(vendor.name)}
    </span>
  )

  if (!vendor.logoUrl || imageUnavailable) return fallback

  return (
    <img
      src={vendor.logoUrl}
      alt=""
      aria-hidden="true"
      className="h-full w-full object-cover"
      loading={loading}
      onError={() => {
        setImageUnavailable(true)
      }}
    />
  )
}
