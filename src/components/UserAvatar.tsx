import type { User } from '../types'

interface UserAvatarProps {
  user: User | null | undefined
  size?: number
  className?: string
}

export function UserAvatar({ user, size = 32, className = '' }: UserAvatarProps) {
  const isImage = !!user?.avatar && !user.avatar.startsWith('#')
  const bg      = user?.avatar?.startsWith('#') ? user.avatar : '#1E3A8A'
  const initial = user?.name?.charAt(0)?.toUpperCase() ?? 'U'
  const fontSize = Math.round(size * 0.38)

  const base = `flex-shrink-0 rounded-full overflow-hidden ${className}`

  if (isImage) {
    return (
      <img
        src={user!.avatar}
        alt={user?.name}
        width={size}
        height={size}
        className={`${base} object-cover`}
        style={{ width: size, height: size }}
      />
    )
  }

  return (
    <div
      className={`${base} flex items-center justify-center text-white font-semibold`}
      style={{ width: size, height: size, backgroundColor: bg, fontSize }}
    >
      {initial}
    </div>
  )
}
