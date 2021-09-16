import * as React from 'react'
import Image from 'next/image'
import { staffDesignData } from '~/data/staffDesign'

export default function StaffDesign() {
  return (
    <div className="overflow-hidden transition-all rounded-lg dark:bg-gray-900">
      <a
        href="https://staff.design"
        className="relative z-0 block pt-40 overflow-hidden bg-gray-200 rounded-t-lg dark:bg-gray-800"
      >
        <div className="meta-wrap">
          <div className="meta"></div>
          <div className="meta"></div>
        </div>

        <div className="p-4 px-6 space-y-2">
          <p className="text-3xl font-bold text-primary">Staff Design</p>
          <p className="text-xl leading-snug text-black dark:text-white text-opacity-60 filter-saturate">
            A collection of interviews exploring how product designers navigate
            the individual contributor path to its highest levels.
          </p>
        </div>
      </a>

      <div className="relative z-10 grid gap-1 p-2 pt-2.5 bg-gray-200 bg-opacity-50 rounded-b-lg sm:grid-cols-2">
        {staffDesignData.map((person) => (
          <a
            href={`https://staff.design/${person.slug}`}
            key={person.slug}
            className="flex items-center transition-all transform-gpu hover:-translate-y-0.5 px-4 py-3 space-x-4 rounded-md shadow-none hover:bg-white hover:shadow-sm dark:hover:bg-gray-800"
          >
            <Image
              src={`/static/img/staff-design/${person.avatarUrl}`}
              width={32}
              height={32}
              alt={person.fullName}
              className="rounded-full"
            />
            <p className="font-medium text-primary">{person.fullName}</p>
          </a>
        ))}
      </div>
    </div>
  )
}
