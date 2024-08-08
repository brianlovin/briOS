import Image from 'next/image'
import Link from 'next/link'

export function Campsite({ referrer }: { referrer?: string }) {
  return (
    <Link
      href={`https://campsite.co?ref=brianlovin${referrer}`}
      className="flex gap-2 md:gap-3 md:justify-center items-start md:items-center rounded-lg w-full px-4 bg-gray-50 dark:bg-gray-900 dark:border-gray-800 py-3 hover:bg-gray-100 text-tertiary text-balance text-[15px] dark:hover:bg-gray-800"
    >
      <Image
        src="/static/img/desktop-app-icon.png"
        alt="Campsite app icon"
        width={200}
        height={200}
        quality={100}
        className="flex-none w-7 h-7 self-start"
      />
      <span>
        <span className="text-primary font-medium">Campsite</span> — your team’s
        posts, calls, docs, and chat in one app. Try it for free.
      </span>
    </Link>
  )
}
