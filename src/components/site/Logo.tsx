import Image from 'next/image'
import Link from 'next/link'

export function Logo({
  tone = 'ink',
  href = '/',
  priority = false,
}: {
  tone?: 'ink' | 'ivory'
  href?: string
  priority?: boolean
}) {
  const onDark = tone === 'ivory'
  const lockup = onDark ? '/brand/transparent/lockup-horizontal-dark.png' : '/brand/transparent/lockup-horizontal-light.png'
  const icon = '/brand/transparent/icon.png'
  return (
    <Link href={href} className="inline-flex items-center" aria-label="Chateaux Rouge, home">
      <Image src={icon} alt="" width={36} height={36} priority={priority} sizes="36px" className="h-9 w-9 sm:hidden" />
      <Image
        src={lockup}
        alt=""
        width={170}
        height={40}
        sizes="(max-width: 639px) 0px, 170px"
        className="hidden h-8 w-auto sm:block md:h-10"
      />
    </Link>
  )
}
