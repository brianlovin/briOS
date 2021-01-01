import Link from 'next/link'
import * as React from 'react'
import { Layers, Plus, Zap } from 'react-feather'
import { BlogPost } from '../BlogPost'
import { ButtonSet, DateEntry, Notes, TimelineEntry } from '../Entry'

export function December() {
  return (
    <>
      <DateEntry title="December, 2020" />

      <TimelineEntry
        title="Shut down Spec.fm"
        timestamp="December 26, 2020"
        Icon={Plus}
      >
        <>
          <Notes>
            <p>
              This week we shut down{' '}
              <a
                href="https://spec.fm"
                target="_blank"
                rel="noopener noreferrer"
              >
                Spec.fm
              </a>
              , a podcast network I co-founded in 2015. Sarah wrote a reflection
              on the last five years of operating the network, lessons we
              learned, and how much money the company made.
            </p>
            <p>
              <a
                href="https://designdetails.fm"
                target="_blank"
                rel="noopener noreferrer"
              >
                Design Details
              </a>{' '}
              will continue as an independent podast – new episodes coming in
              2021!
            </p>
          </Notes>
          <ButtonSet>
            <a
              href="https://medium.com/@sarahberus/a09fa8390000"
              target="_blank"
              rel="noopener noreferrer"
              className="btn"
            >
              Read the blog post
            </a>
          </ButtonSet>
        </>
      </TimelineEntry>

      <TimelineEntry
        title="Published my stack"
        timestamp="December 21, 2020"
        Icon={Layers}
      >
        <>
          <Notes>
            <p>
              Over the years, I’ve been curating my list of favorite tools,
              apps, and independent software. Let me know what else I should
              try!
            </p>
          </Notes>
          <ButtonSet>
            <Link href="/stack" passHref>
              <a className="btn">View my stack &nbsp; &rarr;</a>
            </Link>
          </ButtonSet>
        </>
      </TimelineEntry>

      <BlogPost
        timestamp="December 20, 2020"
        slug="reasons-you-arent-updating-your-personal-site"
        title="Reasons You Aren't Updating Your Personal Site"
        description="Tips and strategies to painlessly manage a personal website."
      />

      <TimelineEntry
        title="Announced Staff.design"
        timestamp="December 6, 2020"
        Icon={Zap}
        tint={'purple'}
        divider={false}
      >
        <a
          target="_blank"
          rel="noopener noreferrer"
          href="https://staff.design"
        >
          <div className="flex flex-col overflow-hidden transition-shadow bg-white rounded-md shadow md:flex-row dark:bg-gray-900 hover:shadow-cardHover">
            <div className="flex flex-col justify-center px-3 py-3 space-y-1 md:items-center">
              <svg
                width="128"
                height="128"
                viewBox="0 0 500 500"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <g clipPath="url(#clip0)">
                  <path
                    fillRule="evenodd"
                    clipRule="evenodd"
                    d="M403.36 176.493C367.564 112.586 325.099 39.4122 243.297 45.4248C144.848 52.6609 57.2017 117.366 38.1151 203.339C18.8348 290.184 75.0497 371.385 162.051 411.385C249.734 451.698 364.971 451.96 433.593 385.164C490.225 330.038 447.85 255.156 410.552 189.245C408.124 184.954 405.717 180.7 403.36 176.493ZM333.448 266.754C338.534 302.943 309.649 330.487 254.543 338.232C209.544 344.556 181.511 333.958 170.512 317.984C167.87 314.254 166.319 310.248 165.753 306.227C164.007 293.798 173.469 283.77 188.007 281.727C199.084 280.17 206.988 282.166 216.25 290.805C224.389 298.483 236.516 300.382 249.67 298.534C267.253 296.062 277.163 288.208 275.947 279.557C274.782 271.271 266.532 268.827 243.605 268.446L223.084 268.1C182.474 267.47 158.253 252.857 154.417 225.562C149.451 190.226 180.931 163.063 228.422 156.389C268.02 150.823 298.133 159.141 311.6 179.615C313.758 182.915 315.051 186.088 315.616 190.109C317.26 201.807 308.682 211.089 294.022 213.273C281.561 215.025 273.138 212.356 264.758 203.966C257.018 196.108 247.279 194.122 234.679 195.892C218.342 198.189 210.925 205.692 212.038 213.612C213.151 221.533 222.266 224.104 242.649 224.47L263.171 224.816C307.051 225.607 329.441 238.241 333.448 266.754Z"
                    fill="currentColor"
                    fillOpacity="0.7"
                    className="blob-pink"
                  />
                  <path
                    fillRule="evenodd"
                    clipRule="evenodd"
                    d="M409.561 213.952C395.797 134.635 378.722 43.3982 304.274 26.7794C214.678 6.77897 118.439 52.0583 77.1571 139.75C35.4563 228.332 62.4895 332.148 128.55 400.058C195.129 468.5 297.536 501.366 377.447 448.443C443.397 404.766 426.885 311.706 412.352 229.793C411.405 224.46 410.467 219.174 409.561 213.952ZM321.867 291.917C316.158 332.54 282.683 354.197 231.487 347.001C189.682 341.126 167.748 321.725 162.483 301.318C161.188 296.533 160.941 291.757 161.576 287.243C163.536 273.292 174.787 265.109 188.293 267.008C198.583 268.454 205.049 272.849 210.843 284.822C215.91 295.437 226.158 300.922 238.378 302.639C254.714 304.935 265.747 299.233 267.112 289.522C268.419 280.221 261.773 275.242 241.492 268.347L223.34 262.17C187.403 250.006 169.995 227.335 174.301 196.697C179.876 157.032 215.551 136.521 259.672 142.722C296.461 147.892 320.889 165.413 327.076 191.388C328.062 195.572 328.315 199.373 327.681 203.887C325.835 217.017 315.582 224.642 301.927 222.863C290.35 221.236 283.614 215.965 278.534 204.511C273.873 193.814 265.773 188.91 254.068 187.265C238.889 185.131 230.172 191.159 228.922 200.05C227.673 208.94 235.052 214.301 253.075 220.46L271.227 226.638C310.026 239.901 326.365 259.912 321.867 291.917Z"
                    fill="currentColor"
                    fillOpacity="0.6"
                    className="blob-orange"
                  />
                  <path
                    fillRule="evenodd"
                    clipRule="evenodd"
                    d="M274.98 50.5534C347.007 55.9841 375.052 134.355 398.421 202.622C399.959 207.117 401.536 211.663 403.126 216.251L403.126 216.252C427.559 286.712 455.316 366.763 399.21 413.471C331.226 470.066 230.83 453.769 159.352 401.645C88.431 349.926 49.3858 261.692 76.8252 178.375C103.989 95.8951 188.297 44.0177 274.98 50.5534Z"
                    className="blob"
                    fill="currentColor"
                  />
                  <path
                    d="M249.25 340.125C299 340.125 328 316.5 328 279.375C328 250.125 309.75 234.25 271 227.25L252.875 224C234.875 220.75 227.125 216.875 227.125 208.75C227.125 200.625 234.625 194.125 249.375 194.125C260.75 194.125 269.125 197.5 275 206.5C281.375 216.125 288.5 220 299.75 220C313 219.875 321.75 211.75 321.75 199.75C321.75 195.625 321 192.25 319.5 188.625C310.125 166.125 284.5 153.5 248.75 153.5C205.875 153.5 174.625 176.375 174.625 212.625C174.625 240.625 194.25 258.75 230.125 265.125L248.25 268.375C268.5 272 275.5 275.625 275.5 284.125C275.5 293 265.75 299.5 249.875 299.5C238 299.5 227.5 295.875 221.25 287C214.125 277 207.375 273.875 197.375 273.875C184.25 273.875 174.625 282.625 174.625 295.375C174.625 299.5 175.5 303.75 177.375 307.875C185.125 325.5 208.625 340.125 249.25 340.125Z"
                    className="s-mark"
                    fill="currentColor"
                  />
                </g>
                <defs>
                  <clipPath id="clip0">
                    <rect width="500" height="500" fill="white" />
                  </clipPath>
                </defs>
              </svg>
              <h5 className="px-2 pt-2">Staff Design</h5>
              <p className="flex-1 px-2 font-normal md:text-center">
                Conversations with high-impact individual contributors in
                product design.
              </p>
              <p className="flex-1 px-2 py-4 text-xs font-normal tracking-wider text-gray-700 uppercase dark:text-gray-300 md:text-center">
                Coming January, 2021.
              </p>
              <span />
              <div className="btn btn-primary">View the project</div>
            </div>
          </div>
        </a>
      </TimelineEntry>
    </>
  )
}
