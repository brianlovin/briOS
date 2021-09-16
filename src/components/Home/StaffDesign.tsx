import * as React from 'react'
import Image from 'next/image'
import { staffDesignData } from '~/data/staffDesign'

export default function StaffDesign() {
  return (
    <div className="relative z-0 flex flex-col items-center justify-center flex-none py-32 overflow-hidden bg-black">
      <div className="meta-wrap motion-reduce:hidden">
        <div className="meta motion-reduce:hidden"></div>
        <div className="meta motion-reduce:hidden"></div>
      </div>
      <div className="z-10 w-full mx-auto max-w-screen-2xl justify-content">
        <div className="flex flex-col items-center space-y-12 ">
          <div className="space-y-3 text-center">
            <p className="text-5xl font-bold text-white text-opacity-90 filter-saturate">
              Staff Design
            </p>
            <p className="text-2xl font-medium text-white text-opacity-70 filter-saturate">
              Interviews about navigating the individual contributor career
              path.
            </p>
          </div>

          <div className="grid grid-cols-2 gap-0 sm:gap-4 lg:grid-cols-4 md:grid-cols-3">
            {staffDesignData.map((person) => (
              <a
                key={person.fullName}
                href={`https://staff.design/${person.slug}`}
                className="relative flex flex-col items-center p-6 space-y-6 overflow-hidden transition-all bg-black rounded-lg person-card bg-opacity-5 sm:hover:bg-white sm:hover:bg-opacity-10 filter-saturate filter-blur transform-gpu sm:hover:-translate-y-1"
              >
                <Image
                  src={`/static/img/staff-design/${person.avatarUrl}`}
                  width={128}
                  height={128}
                  layout={'fixed'}
                  className={`rounded-full`}
                />

                <div className="relative flex flex-col items-center w-full space-y-1 overflow-hidden text-center">
                  <p
                    className={`text-2xl font-extrabold filter-bright-text text-white text-opacity-90 filter-saturate`}
                  >
                    {person.fullName}
                  </p>

                  <div className="flex w-full pt-4">
                    <div className="w-full p-4 font-mono text-center text-white bg-white rounded-md bg-opacity-5 hover:bg-opacity-10 filter-blur filter-saturate">
                      Read
                    </div>
                  </div>
                </div>
              </a>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
