import type { VendorSummary } from '~/lib/types'

function vendorInitial(name: string) {
  return name.trim().charAt(0).toUpperCase() || '?'
}

interface VendorAvatarProps {
  vendor: VendorSummary
}

export function VendorAvatar({ vendor }: VendorAvatarProps) {
  const fallback = (
    <span className="flex h-full w-full items-center justify-center text-2xl font-semibold text-neutral-400 dark:text-neutral-500">
      {vendorInitial(vendor.name)}
    </span>
  )

  if (!vendor.logoUrl) return fallback

  return (
    <div className="relative h-full w-full">
      {fallback}
      <img
        src={vendor.logoUrl}
        alt={`${vendor.name} logo`}
        className="absolute inset-0 h-full w-full object-cover"
        loading="lazy"
        onError={(event) => {
          event.currentTarget.style.display = 'none'
        }}
      />
    </div>
  )
}
