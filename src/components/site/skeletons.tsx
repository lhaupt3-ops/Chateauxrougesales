function Block({ className }: { className: string }) {
  return <div className={`animate-pulse rounded-2xl bg-stone motion-reduce:animate-none ${className}`} />
}

function Frame({ children, className }: { children: React.ReactNode; className: string }) {
  return (
    <div className={className} aria-busy="true">
      <span className="sr-only">Loading</span>
      {children}
    </div>
  )
}

export function MarketingSkeleton() {
  return (
    <Frame className="mx-auto max-w-6xl px-4 py-16">
      <div className="grid items-start gap-12 md:grid-cols-[1.2fr_0.8fr]">
        <div>
          <Block className="h-3 w-40" />
          <Block className="mt-4 h-12 w-full max-w-xl" />
          <Block className="mt-3 h-12 w-4/5 max-w-lg" />
          <Block className="mt-5 h-5 w-full max-w-xl" />
          <Block className="mt-2 h-5 w-3/4 max-w-md" />
          <Block className="mt-8 h-12 w-56 rounded-xl" />
        </div>
        <Block className="h-64 rounded-3xl" />
      </div>
      <div className="mt-16 grid gap-4 md:grid-cols-3">
        <Block className="h-36" />
        <Block className="h-36" />
        <Block className="h-36" />
      </div>
    </Frame>
  )
}

export function JournalSkeleton() {
  return (
    <Frame className="mx-auto max-w-6xl px-4 py-12">
      <Block className="h-4 w-28" />
      <Block className="mt-8 h-12 w-48" />
      <Block className="mt-4 h-6 w-full max-w-2xl" />
      <div className="mt-10 grid gap-4 md:grid-cols-3">
        <Block className="h-40" />
        <Block className="h-40" />
        <Block className="h-40" />
      </div>
    </Frame>
  )
}

export function ArticleSkeleton({ width = 'max-w-3xl' }: { width?: string }) {
  return (
    <Frame className={`mx-auto px-4 py-12 ${width}`}>
      <Block className="h-4 w-40" />
      <Block className="mt-8 h-10 w-full" />
      <Block className="mt-3 h-10 w-4/5" />
      <Block className="mt-6 h-5 w-full" />
      <Block className="mt-2 h-5 w-11/12" />
      <Block className="mt-2 h-5 w-3/4" />
      <Block className="mt-8 h-48 rounded-3xl" />
      <Block className="mt-6 h-5 w-full" />
      <Block className="mt-2 h-5 w-5/6" />
    </Frame>
  )
}

export function ApplySkeleton() {
  return (
    <Frame className="mx-auto max-w-xl px-4 py-10">
      <Block className="h-1.5 w-full rounded-full" />
      <Block className="mt-8 h-10 w-4/5" />
      <Block className="mt-4 h-5 w-full" />
      <Block className="mt-6 h-12 w-full" />
      <Block className="mt-4 h-12 w-48 rounded-xl" />
    </Frame>
  )
}
