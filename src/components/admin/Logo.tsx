export default function Logo() {
  return (
    // Payload's admin graphic is a plain image, not a Next image.
    // eslint-disable-next-line @next/next/no-img-element
    <img
      src="/brand/transparent/lockup-horizontal-light.png"
      alt="Chateaux Rouge"
      width={1280}
      height={301}
      style={{ display: 'block', height: 28, width: 'auto' }}
    />
  )
}

export function AdminBrand() {
  return (
    // eslint-disable-next-line @next/next/no-img-element
    <img
      src="/brand/transparent/lockup-horizontal-light.png"
      alt="Chateaux Rouge"
      width={1280}
      height={301}
      style={{ display: 'block', height: 32, width: 'auto', margin: '0 0 12px' }}
    />
  )
}
