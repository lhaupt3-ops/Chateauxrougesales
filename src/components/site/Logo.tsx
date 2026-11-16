import Image from 'next/image'
import Link from 'next/link'

export function Logo({ tone = 'ink', href = '/' }: { tone?: 'ink' | 'ivory'; href?: string }) {
  const onDark = tone === 'ivory'
  const lockup = onDark ? '/brand/transparent/lockup-horizontal-dark.png' : '/brand/transparent/lockup-horizontal-light.png'
  const icon = '/brand/transparent/icon.png'
  return (
    <Link href={href} className="inline-flex items-center" aria-label="Chateaux Rouge, home">
      <Image src={icon} alt="" width={64} height={64} priority className="h-9 w-9 sm:hidden" />
      <Image src={lockup} alt="" width={1280} height={301} priority className="hidden h-8 w-auto sm:block md:h-10" />
    </Link>
  )
}
