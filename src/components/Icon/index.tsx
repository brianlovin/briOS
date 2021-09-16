import * as React from 'react'
import styled from 'styled-components'

type Props = {
  glyph: string
  size?: number
}

export const InlineSvg = styled.svg`
  position: absolute;
  top: 0;
  right: 0;
  bottom: 0;
  left: 0;
  height: 100%;
  width: 100%;
  color: inherit;
  fill: currentColor;
`

export const SvgWrapper = styled.div`
  display: inline-block;
  flex: 0 0 ${(props) => (props.size ? `${props.size}px` : '32px')};
  width: ${(props) => (props.size ? `${props.size}px` : '32px')};
  height: ${(props) => (props.size ? `${props.size}px` : '32px')};
  min-width: ${(props) => (props.size ? `${props.size}px` : '32px')};
  min-height: ${(props) => (props.size ? `${props.size}px` : '32px')};
  position: relative;
  color: inherit;
`

type GlyphProps = {
  glyph: string
}

export const Glyph = ({ glyph }: GlyphProps): any => {
  switch (glyph) {
    case 'facebook':
      return (
        <g>
          <path d="M19.491,27.944c7.731,-0.319 8.509,-2.242 8.509,-11.944c0,-11 -1,-12 -12,-12c-11,0 -12,1 -12,12c0,10.985 0.997,11.997 11.956,12l0,-7.667l-2.956,0l0,-3.377l2.956,0l0,-2.491c0,-2.891 1.789,-4.465 4.403,-4.465c1.251,0 2.327,0.092 2.641,0.133l0,3.021l-1.813,0.001c-1.421,0 -1.696,0.666 -1.696,1.644l0,2.157l3.39,0l-0.442,3.377l-2.948,0l0,7.611Z" />
        </g>
      )
    case 'link':
      return (
        <g>
          <path d="M16.693,16.664c0.376,-0.375 1.001,-0.413 1.377,-0.038l0.083,0.084c0.358,0.357 0.386,0.93 0.032,1.291c-0.026,0.026 -0.051,0.052 -0.077,0.078c-0.867,0.866 -1.671,1.438 -2.514,1.655c0,0 -0.001,0 -0.001,0c-0.078,0.02 -0.157,0.037 -0.236,0.051c0,0 0,0 0,0c-0.802,0.142 -1.646,-0.036 -2.616,-0.582l0,0c-0.907,-0.511 -1.923,-1.343 -3.119,-2.539c-3.959,-3.959 -3.939,-5.959 -1.414,-8.485c2.526,-2.525 4.526,-2.545 8.485,1.414c0.439,0.439 0.828,0.853 1.171,1.247c0.102,0.117 -0.009,0.3 -0.162,0.28c0,0 0,0 -0.001,0c-0.559,-0.074 -1.083,-0.035 -1.58,0.094c-0.299,0.078 -0.624,0.012 -0.842,-0.206c-1.958,-1.958 -3.035,-2.492 -3.63,-2.571c-0.366,-0.049 -0.902,0.032 -2.027,1.156c-1.124,1.125 -1.205,1.661 -1.156,2.027c0.079,0.595 0.613,1.672 2.571,3.63c0.432,0.433 0.822,0.796 1.173,1.1c0,0 0,0 0,0c0.046,0.04 0.091,0.079 0.136,0.117c0,0 0,0 0,0c0.841,0.712 1.45,1.073 1.891,1.24c0,0 0,0 0,0c0.166,0.062 0.308,0.098 0.429,0.114c0,0 0,0 0,0c0.367,0.049 0.903,-0.032 2.027,-1.157Zm3.07,-1.099c-0.912,-0.79 -1.563,-1.181 -2.027,-1.357c0,0 0,0 0,0c-0.166,-0.063 -0.308,-0.098 -0.43,-0.114c0,0 0,0 0,0c-0.367,-0.049 -0.902,0.032 -2.027,1.156c-0.375,0.376 -1.001,0.414 -1.376,0.038l-0.083,-0.083c-0.358,-0.358 -0.387,-0.931 -0.032,-1.291c0.025,-0.026 0.051,-0.052 0.077,-0.078c0.866,-0.866 1.671,-1.438 2.514,-1.655l0,0c0.873,-0.225 1.786,-0.07 2.853,0.531c0,0 0,0 0,0c0.906,0.51 1.923,1.343 3.118,2.538c3.96,3.96 3.94,5.96 1.414,8.486c-2.525,2.525 -4.525,2.545 -8.485,-1.415c-0.438,-0.438 -0.828,-0.852 -1.171,-1.246c-0.102,-0.117 0.009,-0.301 0.163,-0.28c0.559,0.074 1.083,0.035 1.581,-0.094c0.299,-0.078 0.623,-0.012 0.841,0.206c1.958,1.958 3.035,2.492 3.63,2.571c0.367,0.049 0.903,-0.032 2.027,-1.157c1.125,-1.124 1.206,-1.66 1.157,-2.027c-0.079,-0.595 -0.613,-1.672 -2.571,-3.63c-0.433,-0.432 -0.822,-0.795 -1.173,-1.099Z" />
        </g>
      )
    case 'share':
      return (
        <g fillRule="nonzero">
          <path d="M16.707,5.294c-0.39,-0.39 -1.024,-0.39 -1.414,0l-3,3c-0.391,0.391 -0.391,1.024 0,1.415c0.39,0.39 1.024,0.39 1.414,0l1.293,-1.293l0,9.585c0,0.553 0.448,1 1,1c0.552,0 1,-0.447 1,-1l0,-9.585l1.293,1.293c0.39,0.39 1.024,0.39 1.414,0c0.391,-0.391 0.391,-1.024 0,-1.415l-3,-3Zm-5.817,7.023c0.588,-0.114 1.11,0.36 1.11,0.959l0,0.426c0,0.265 -0.198,0.487 -0.459,0.531l-0.002,0c-1.042,0.17 -1.486,0.416 -1.706,0.612c-0.191,0.171 -0.42,0.489 -0.588,1.31l-0.007,0.03c-0.191,0.926 -0.238,2.106 -0.238,3.815l0,0.003c0,1.709 0.047,2.889 0.238,3.814l0.007,0.031c0.168,0.821 0.397,1.139 0.588,1.309c0.219,0.197 0.662,0.442 1.699,0.612l0.017,0.002c1.094,0.182 2.493,0.231 4.45,0.23l0.002,0c1.957,0.001 3.356,-0.048 4.45,-0.23l0.017,-0.002c1.037,-0.17 1.48,-0.415 1.699,-0.611c0.191,-0.171 0.42,-0.489 0.588,-1.31l0.007,-0.031c0.191,-0.925 0.238,-2.105 0.238,-3.814l0,-0.003c0,-1.709 -0.047,-2.889 -0.238,-3.815l-0.007,-0.03c-0.168,-0.821 -0.397,-1.139 -0.588,-1.31c-0.22,-0.196 -0.664,-0.442 -1.706,-0.612l-0.002,0c-0.262,-0.044 -0.459,-0.266 -0.459,-0.531l0,-0.426c0,-0.599 0.522,-1.073 1.11,-0.959c3.362,0.655 3.89,2.553 3.89,7.684c0,7.059 -1,8 -9,8c-8,0 -9,-0.941 -9,-8c0,-5.131 0.528,-7.029 3.89,-7.684Z" />
        </g>
      )
    case 'twitter':
      return (
        <g>
          <path d="M16,28c11,0 12,-1 12,-12c0,-11 -1,-12 -12,-12c-11,0 -12,1 -12,12c0,11 1,12 12,12Zm5.825,-13.901c0,3.669 -2.889,7.901 -8.172,7.901l0,0c-1.622,0 -3.132,-0.46 -4.403,-1.248c0.225,0.026 0.454,0.039 0.685,0.039c1.346,0 2.585,-0.444 3.568,-1.189c-1.258,-0.022 -2.318,-0.825 -2.684,-1.928c0.175,0.032 0.355,0.05 0.54,0.05c0.262,0 0.516,-0.034 0.758,-0.098c-1.315,-0.255 -2.305,-1.377 -2.305,-2.722c0,-0.013 0,-0.024 0.001,-0.036c0.387,0.208 0.829,0.333 1.301,0.348c-0.772,-0.498 -1.279,-1.348 -1.279,-2.312c0,-0.509 0.143,-0.985 0.389,-1.396c1.417,1.681 3.534,2.786 5.921,2.902c-0.049,-0.204 -0.074,-0.416 -0.074,-0.633c0,-1.533 1.286,-2.777 2.872,-2.777c0.826,0 1.573,0.338 2.097,0.877c0.654,-0.124 1.269,-0.356 1.824,-0.674c-0.215,0.649 -0.67,1.192 -1.263,1.536c0.581,-0.067 1.134,-0.216 1.649,-0.437c-0.384,0.557 -0.872,1.046 -1.433,1.438c0.006,0.119 0.008,0.239 0.008,0.359Z" />
        </g>
      )
    case 'github':
      return (
        <g>
          <path d="M18.837,27.966c8.342,-0.241 9.163,-1.997 9.163,-11.966c0,-11 -1,-12 -12,-12c-11,0 -12,1 -12,12c0,9.995 0.826,11.734 9.228,11.968c0.073,-0.091 0.1,-0.205 0.1,-0.321c0,-0.25 -0.01,-2.816 -0.015,-3.699c-3.037,0.639 -3.678,-1.419 -3.678,-1.419c-0.497,-1.222 -1.213,-1.548 -1.213,-1.548c-0.991,-0.656 0.075,-0.643 0.075,-0.643c1.096,0.075 1.673,1.091 1.673,1.091c0.974,1.617 2.556,1.15 3.178,0.879c0.099,-0.683 0.381,-1.15 0.693,-1.414c-2.425,-0.267 -4.974,-1.175 -4.974,-5.23c0,-1.155 0.426,-2.099 1.124,-2.839c-0.113,-0.268 -0.487,-1.344 0.107,-2.8c0,0 0.917,-0.285 3.003,1.084c0.871,-0.235 1.805,-0.352 2.734,-0.356c0.927,0.004 1.861,0.121 2.734,0.356c2.085,-1.369 3,-1.084 3,-1.084c0.596,1.456 0.221,2.532 0.108,2.8c0.7,0.74 1.123,1.684 1.123,2.839c0,4.065 -2.553,4.96 -4.986,5.221c0.392,0.327 0.741,0.973 0.741,1.96c0,0.946 -0.006,2.619 -0.01,3.728c-0.002,0.549 -0.003,0.959 -0.003,1.074c0,0.109 0.029,0.224 0.095,0.319Z" />
        </g>
      )
    default:
      return null
  }
}

export default function Icon(props: Props) {
  const { size = 32, glyph } = props

  return (
    <SvgWrapper size={size} className="icon">
      <InlineSvg
        fillRule="evenodd"
        clipRule="evenodd"
        strokeLinejoin="round"
        strokeMiterlimit="1.414"
        xmlns="http://www.w3.org/2000/svg"
        aria-label={glyph}
        viewBox="0 0 32 32"
        preserveAspectRatio="xMidYMid meet"
        fit
      >
        <title>{glyph}</title>
        <Glyph glyph={glyph} />
      </InlineSvg>
    </SvgWrapper>
  )
}

export function HomeIcon() {
  return (
    <svg
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <rect
        width="24"
        height="24"
        rx="6"
        fill="currentColor"
        className="text-black dark:text-gray-400 dark:text-opacity-30"
      />
      <path
        d="M12.5274 6.80838C12.3999 6.68096 12.2271 6.60938 12.0468 6.60938C11.8666 6.60938 11.6937 6.68096 11.5663 6.80838L6.80847 11.5662C6.68466 11.6944 6.61615 11.8661 6.6177 12.0443C6.61925 12.2225 6.69073 12.393 6.81675 12.519C6.94277 12.645 7.11325 12.7165 7.29146 12.718C7.46967 12.7196 7.64136 12.6511 7.76955 12.5273L7.9687 12.3281V16.8045C7.9687 16.9848 8.04031 17.1577 8.16778 17.2852C8.29524 17.4126 8.46812 17.4842 8.64839 17.4842H10.0078C10.188 17.4842 10.3609 17.4126 10.4884 17.2852C10.6158 17.1577 10.6875 16.9848 10.6875 16.8045V15.4452C10.6875 15.2649 10.7591 15.092 10.8865 14.9646C11.014 14.8371 11.1869 14.7655 11.3671 14.7655H12.7265C12.9068 14.7655 13.0797 14.8371 13.2071 14.9646C13.3346 15.092 13.4062 15.2649 13.4062 15.4452V16.8045C13.4062 16.9848 13.4778 17.1577 13.6053 17.2852C13.7327 17.4126 13.9056 17.4842 14.0859 17.4842H15.4453C15.6255 17.4842 15.7984 17.4126 15.9259 17.2852C16.0533 17.1577 16.125 16.9848 16.125 16.8045V12.3281L16.3241 12.5273C16.4523 12.6511 16.624 12.7196 16.8022 12.718C16.9804 12.7165 17.1509 12.645 17.2769 12.519C17.4029 12.393 17.4744 12.2225 17.476 12.0443C17.4775 11.8661 17.409 11.6944 17.2852 11.5662L12.5274 6.80838V6.80838Z"
        fill="currentColor"
        className="text-white"
      />
    </svg>
  )
}

export function WritingIcon() {
  return (
    <svg
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <rect
        width="24"
        height="24"
        rx="6"
        fill="currentColor"
        className="text-purple-700 dark:text-gray-400 dark:text-opacity-30"
      />
      <g clip-path="url(#clip0)">
        <path
          fillRule="evenodd"
          clipRule="evenodd"
          d="M6.60938 8.64844C6.60938 8.28791 6.75259 7.94215 7.00753 7.68721C7.26246 7.43228 7.60822 7.28906 7.96875 7.28906H13.4062C13.7668 7.28906 14.1125 7.43228 14.3675 7.68721C14.6224 7.94215 14.7656 8.28791 14.7656 8.64844V15.4453C14.7656 15.8058 14.9088 16.1516 15.1638 16.4065C15.4187 16.6615 15.7645 16.8047 16.125 16.8047H7.96875C7.60822 16.8047 7.26246 16.6615 7.00753 16.4065C6.75259 16.1516 6.60938 15.8058 6.60938 15.4453V8.64844ZM8.64844 9.32812H12.7266V12.0469H8.64844V9.32812ZM12.7266 13.4062H8.64844V14.7656H12.7266V13.4062Z"
          fill="white"
        />
        <path
          d="M15.4453 10.0078H16.125C16.4855 10.0078 16.8313 10.151 17.0862 10.406C17.3412 10.6609 17.4844 11.0067 17.4844 11.3672V15.1055C17.4844 15.3759 17.377 15.6352 17.1858 15.8264C16.9946 16.0176 16.7352 16.125 16.4648 16.125C16.1944 16.125 15.9351 16.0176 15.7439 15.8264C15.5527 15.6352 15.4453 15.3759 15.4453 15.1055V10.0078Z"
          fill="white"
        />
      </g>
      <defs>
        <clipPath id="clip0">
          <rect
            width="13.5938"
            height="13.5938"
            fill="white"
            transform="translate(5.25 5.25)"
          />
        </clipPath>
      </defs>
    </svg>
  )
}

export function PodcastIcon() {
  return (
    <svg
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <rect
        width="24"
        height="24"
        rx="6"
        fill="currentColor"
        className="text-design-details dark:text-gray-400 dark:text-opacity-30"
      />
      <path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M10.2327 8.4188C10.2327 7.93768 10.4238 7.47627 10.764 7.13606C11.1042 6.79586 11.5657 6.60474 12.0468 6.60474C12.5279 6.60474 12.9893 6.79586 13.3295 7.13606C13.6697 7.47627 13.8608 7.93768 13.8608 8.4188V10.8375C13.8608 11.3187 13.6697 11.7801 13.3295 12.1203C12.9893 12.4605 12.5279 12.6516 12.0468 12.6516C11.5657 12.6516 11.1042 12.4605 10.764 12.1203C10.4238 11.7801 10.2327 11.3187 10.2327 10.8375V8.4188ZM12.6515 15.028C13.659 14.8825 14.5804 14.3787 15.2467 13.6091C15.913 12.8395 16.2797 11.8555 16.2796 10.8375C16.2796 10.6772 16.2159 10.5234 16.1025 10.41C15.9891 10.2966 15.8353 10.2329 15.6749 10.2329C15.5145 10.2329 15.3607 10.2966 15.2473 10.41C15.1339 10.5234 15.0702 10.6772 15.0702 10.8375C15.0702 11.6394 14.7517 12.4084 14.1847 12.9754C13.6177 13.5424 12.8486 13.861 12.0468 13.861C11.2449 13.861 10.4759 13.5424 9.90888 12.9754C9.34188 12.4084 9.02334 11.6394 9.02334 10.8375C9.02334 10.6772 8.95963 10.5234 8.84623 10.41C8.73283 10.2966 8.57903 10.2329 8.41865 10.2329C8.25828 10.2329 8.10447 10.2966 7.99107 10.41C7.87767 10.5234 7.81396 10.6772 7.81396 10.8375C7.81383 11.8555 8.18053 12.8395 8.84686 13.6091C9.5132 14.3787 10.4346 14.8825 11.4421 15.028V16.2797H9.62803C9.46765 16.2797 9.31385 16.3434 9.20045 16.4568C9.08705 16.5702 9.02334 16.724 9.02334 16.8844C9.02334 17.0448 9.08705 17.1986 9.20045 17.312C9.31385 17.4254 9.46765 17.4891 9.62803 17.4891H14.4655C14.6259 17.4891 14.7797 17.4254 14.8931 17.312C15.0065 17.1986 15.0702 17.0448 15.0702 16.8844C15.0702 16.724 15.0065 16.5702 14.8931 16.4568C14.7797 16.3434 14.6259 16.2797 14.4655 16.2797H12.6515V15.028Z"
        fill="currentColor"
        className="text-white"
      />
    </svg>
  )
}

export function NewsletterIcon() {
  return (
    <svg
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <rect
        width="24"
        height="24"
        rx="6"
        fill="currentColor"
        className="text-black dark:text-gray-400 dark:text-opacity-30"
      />
      <path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M12.0469 17.4844C13.489 17.4844 14.872 16.9115 15.8918 15.8918C16.9115 14.872 17.4844 13.489 17.4844 12.0469C17.4844 10.6048 16.9115 9.22171 15.8918 8.20198C14.872 7.18225 13.489 6.60938 12.0469 6.60938C10.6048 6.60938 9.22171 7.18225 8.20198 8.20198C7.18225 9.22171 6.60938 10.6048 6.60938 12.0469C6.60938 13.489 7.18225 14.872 8.20198 15.8918C9.22171 16.9115 10.6048 17.4844 12.0469 17.4844V17.4844ZM12.7266 10.0078C12.7266 9.82755 12.655 9.65467 12.5275 9.5272C12.4 9.39973 12.2271 9.32812 12.0469 9.32812C11.8666 9.32812 11.6937 9.39973 11.5663 9.5272C11.4388 9.65467 11.3672 9.82755 11.3672 10.0078V11.3672H10.0078C9.82755 11.3672 9.65467 11.4388 9.5272 11.5663C9.39973 11.6937 9.32812 11.8666 9.32812 12.0469C9.32812 12.2271 9.39973 12.4 9.5272 12.5275C9.65467 12.655 9.82755 12.7266 10.0078 12.7266H11.3672V14.0859C11.3672 14.2662 11.4388 14.4391 11.5663 14.5665C11.6937 14.694 11.8666 14.7656 12.0469 14.7656C12.2271 14.7656 12.4 14.694 12.5275 14.5665C12.655 14.4391 12.7266 14.2662 12.7266 14.0859V12.7266H14.0859C14.2662 12.7266 14.4391 12.655 14.5665 12.5275C14.694 12.4 14.7656 12.2271 14.7656 12.0469C14.7656 11.8666 14.694 11.6937 14.5665 11.5663C14.4391 11.4388 14.2662 11.3672 14.0859 11.3672H12.7266V10.0078Z"
        fill="currentColor"
        className="text-white"
      />
    </svg>
  )
}

export function BookmarksIcon() {
  return (
    <svg
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <rect
        width="24"
        height="24"
        rx="6"
        fill="currentColor"
        className="text-blue-500 dark:text-gray-400 dark:text-opacity-30"
      />
      <path
        d="M8.64844 7.96875C8.64844 7.60822 8.79166 7.26246 9.04659 7.00753C9.30152 6.75259 9.64728 6.60938 10.0078 6.60938H14.0859C14.4465 6.60938 14.7922 6.75259 15.0472 7.00753C15.3021 7.26246 15.4453 7.60822 15.4453 7.96875V17.4844L12.0469 15.7852L8.64844 17.4844V7.96875Z"
        fill="currentColor"
        className="text-white"
      />
    </svg>
  )
}

export function AMAIcon() {
  return (
    <svg
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <rect
        width="24"
        height="24"
        rx="6"
        fill="currentColor"
        className="text-purple-500 dark:text-gray-400 dark:text-opacity-30"
      />
      <path
        d="M6.60938 8.64844C6.60938 8.28791 6.75259 7.94215 7.00753 7.68721C7.26246 7.43228 7.60822 7.28906 7.96875 7.28906H12.7266C13.0871 7.28906 13.4329 7.43228 13.6878 7.68721C13.9427 7.94215 14.0859 8.28791 14.0859 8.64844V11.3672C14.0859 11.7277 13.9427 12.0735 13.6878 12.3284C13.4329 12.5833 13.0871 12.7266 12.7266 12.7266H11.3672L9.32812 14.7656V12.7266H7.96875C7.60822 12.7266 7.26246 12.5833 7.00753 12.3284C6.75259 12.0735 6.60938 11.7277 6.60938 11.3672V8.64844Z"
        fill="currentColor"
        className="text-white"
      />
      <path
        d="M15.4454 10.0078V11.3672C15.4454 12.0882 15.159 12.7798 14.6491 13.2896C14.1392 13.7995 13.4477 14.0859 12.7267 14.0859H11.9301L10.7297 15.2869C10.92 15.3882 11.1369 15.4453 11.3673 15.4453H12.7267L14.7657 17.4844V15.4453H16.1251C16.4856 15.4453 16.8314 15.3021 17.0863 15.0472C17.3413 14.7922 17.4845 14.4465 17.4845 14.0859V11.3672C17.4845 11.0067 17.3413 10.6609 17.0863 10.406C16.8314 10.151 16.4856 10.0078 16.1251 10.0078H15.4454Z"
        fill="currentColor"
        className="text-white"
      />
    </svg>
  )
}

export function StackIcon() {
  return (
    <svg
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <rect
        width="24"
        height="24"
        rx="6"
        fill="currentColor"
        className="text-yellow-500 dark:text-gray-400 dark:text-opacity-30"
      />
      <path
        d="M10.0078 7.28906C9.82755 7.28906 9.65467 7.36067 9.5272 7.48814C9.39973 7.6156 9.32812 7.78849 9.32812 7.96875C9.32812 8.14901 9.39973 8.3219 9.5272 8.44936C9.65467 8.57683 9.82755 8.64844 10.0078 8.64844H14.0859C14.2662 8.64844 14.4391 8.57683 14.5665 8.44936C14.694 8.3219 14.7656 8.14901 14.7656 7.96875C14.7656 7.78849 14.694 7.6156 14.5665 7.48814C14.4391 7.36067 14.2662 7.28906 14.0859 7.28906H10.0078ZM7.96875 10.0078C7.96875 9.82755 8.04036 9.65467 8.16783 9.5272C8.29529 9.39973 8.46817 9.32812 8.64844 9.32812H15.4453C15.6256 9.32812 15.7985 9.39973 15.9259 9.5272C16.0534 9.65467 16.125 9.82755 16.125 10.0078C16.125 10.1881 16.0534 10.361 15.9259 10.4884C15.7985 10.6159 15.6256 10.6875 15.4453 10.6875H8.64844C8.46817 10.6875 8.29529 10.6159 8.16783 10.4884C8.04036 10.361 7.96875 10.1881 7.96875 10.0078ZM6.60938 12.7266C6.60938 12.366 6.75259 12.0203 7.00753 11.7653C7.26246 11.5104 7.60822 11.3672 7.96875 11.3672H16.125C16.4855 11.3672 16.8313 11.5104 17.0862 11.7653C17.3412 12.0203 17.4844 12.366 17.4844 12.7266V15.4453C17.4844 15.8058 17.3412 16.1516 17.0862 16.4065C16.8313 16.6615 16.4855 16.8047 16.125 16.8047H7.96875C7.60822 16.8047 7.26246 16.6615 7.00753 16.4065C6.75259 16.1516 6.60938 15.8058 6.60938 15.4453V12.7266Z"
        fill="currentColor"
        className="text-white"
      />
    </svg>
  )
}

export function StaffDesignIcon() {
  return (
    <svg
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <rect
        width="24"
        height="24"
        rx="6"
        fill="currentColor"
        className="text-pink-500 dark:text-gray-400 dark:text-opacity-30"
      />
      <path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M17.8007 10.3552C16.9661 7.95984 15.9645 5.20997 13.3921 5.01942C10.2963 4.79009 7.28532 6.61035 6.31519 9.50438C5.33521 12.4278 6.72968 15.5237 9.26258 17.3384C11.8154 19.1673 15.4009 19.7392 17.8289 17.7534C19.8327 16.1145 18.8414 13.3057 17.9688 10.8334C17.912 10.6724 17.8557 10.5129 17.8007 10.3552ZM15.2299 13.15C15.2299 14.4323 14.2104 15.2483 12.4614 15.2483C11.0331 15.2483 10.207 14.7431 9.9345 14.1344C9.86858 13.9919 9.83782 13.8451 9.83782 13.7026C9.83782 13.2623 10.1762 12.96 10.6376 12.96C10.9892 12.96 11.2265 13.068 11.477 13.4134C11.6967 13.7199 12.0658 13.8451 12.4833 13.8451C13.0414 13.8451 13.3842 13.6206 13.3842 13.3141C13.3842 13.0205 13.1381 12.8953 12.4262 12.7701L11.789 12.6578C10.5278 12.4376 9.83782 11.8116 9.83782 10.8445C9.83782 9.59245 10.9365 8.80236 12.4438 8.80236C13.7006 8.80236 14.6015 9.23842 14.9311 10.0156C14.9838 10.1408 15.0102 10.2573 15.0102 10.3998C15.0102 10.8143 14.7026 11.0949 14.2367 11.0992C13.8412 11.0992 13.5908 10.9654 13.3666 10.6329C13.1601 10.3221 12.8657 10.2055 12.4658 10.2055C11.9472 10.2055 11.6835 10.43 11.6835 10.7107C11.6835 10.9913 11.956 11.1251 12.5888 11.2374L13.226 11.3496C14.5883 11.5914 15.2299 12.1397 15.2299 13.15Z"
        fill="currentColor"
        className="text-white"
      />
    </svg>
  )
}

export function SecurityChecklistIcon() {
  return (
    <svg
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <rect
        width="24"
        height="24"
        rx="6"
        fill="currentColor"
        className="text-black dark:text-gray-400 dark:text-opacity-30"
      />
      <path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M6.62635 9.47797C6.65735 8.9951 7.0754 8.65033 7.55605 8.59466C8.92338 8.43631 10.2282 7.93296 11.3473 7.13266C11.7625 6.83573 12.3312 6.83576 12.7464 7.13275C13.8659 7.93355 15.1713 8.43715 16.5393 8.59544C17.0192 8.65098 17.4367 8.99487 17.4675 9.47705C17.4787 9.65293 17.4844 9.83026 17.4844 10.0087C17.4844 13.5601 15.2142 16.5813 12.0469 17.7007C8.87953 16.5806 6.60938 13.5594 6.60938 10.008C6.60938 9.8299 6.6151 9.65317 6.62635 9.47797ZM14.5665 11.1683C14.6903 11.0401 14.7588 10.8684 14.7572 10.6902C14.7557 10.512 14.6842 10.3415 14.5582 10.2155C14.4322 10.0894 14.2617 10.018 14.0835 10.0164C13.9053 10.0149 13.7336 10.0834 13.6054 10.2072L11.3672 12.4454L10.4884 11.5666C10.3602 11.4427 10.1885 11.3742 10.0103 11.3758C9.83205 11.3773 9.66157 11.4488 9.53555 11.5748C9.40953 11.7009 9.33805 11.8713 9.3365 12.0495C9.33495 12.2278 9.40346 12.3994 9.52727 12.5276L10.8866 13.887C11.0141 14.0144 11.187 14.086 11.3672 14.086C11.5474 14.086 11.7203 14.0144 11.8477 13.887L14.5665 11.1683Z"
        fill="currentColor"
        className="text-white"
      />
    </svg>
  )
}

export function AppDissectionIcon() {
  return (
    <svg
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <rect
        width="24"
        height="24"
        rx="6"
        fill="currentColor"
        className="text-green-500 dark:text-gray-400 dark:text-opacity-30"
      />
      <path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M12.8817 6.2967C13.0121 6.3377 13.126 6.41922 13.2068 6.5294C13.2877 6.63958 13.3313 6.77268 13.3312 6.90934V10.1203H15.9C16.0175 10.1202 16.1327 10.1524 16.2331 10.2133C16.3336 10.2742 16.4154 10.3614 16.4697 10.4656C16.524 10.5698 16.5487 10.6868 16.5411 10.8041C16.5335 10.9213 16.4939 11.0342 16.4266 11.1304L11.9313 17.5523C11.853 17.6644 11.7411 17.7486 11.6117 17.7927C11.4823 17.8367 11.3422 17.8383 11.2118 17.7973C11.0814 17.7562 10.9676 17.6747 10.8868 17.5644C10.8059 17.4542 10.7624 17.321 10.7625 17.1843V13.9734H8.19374C8.07627 13.9735 7.96104 13.9413 7.86059 13.8804C7.76013 13.8195 7.6783 13.7322 7.624 13.6281C7.5697 13.5239 7.54501 13.4068 7.55262 13.2896C7.56023 13.1724 7.59984 13.0595 7.66715 12.9632L12.1625 6.54137C12.2408 6.42949 12.3528 6.34551 12.4821 6.30163C12.6115 6.25774 12.7515 6.25624 12.8817 6.29734V6.2967Z"
        fill="currentColor"
        className="text-white"
      />
    </svg>
  )
}

export function HackerNewsIcon() {
  return (
    <svg
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <rect
        width="24"
        height="24"
        rx="6"
        fill="currentColor"
        className="text-hacker-news dark:text-gray-400 dark:text-opacity-30"
      />
      <path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M17.4844 12.0469C17.4844 14.6745 15.0497 16.8047 12.0469 16.8047C11.0818 16.8087 10.1299 16.5803 9.27171 16.1386L6.60938 16.8047L7.5188 14.682C6.94446 13.9276 6.60938 13.0215 6.60938 12.0469C6.60938 9.4192 9.04402 7.28906 12.0469 7.28906C15.0497 7.28906 17.4844 9.4192 17.4844 12.0469ZM10.0078 12.0469C10.0078 11.6715 9.70351 11.3672 9.32812 11.3672V11.3672C8.95274 11.3672 8.64844 11.6715 8.64844 12.0469V12.0469C8.64844 12.4223 8.95274 12.7266 9.32812 12.7266V12.7266C9.70351 12.7266 10.0078 12.4223 10.0078 12.0469V12.0469ZM15.4453 12.0469C15.4453 11.6715 15.141 11.3672 14.7656 11.3672V11.3672C14.3902 11.3672 14.0859 11.6715 14.0859 12.0469V12.0469C14.0859 12.4223 14.3902 12.7266 14.7656 12.7266V12.7266C15.141 12.7266 15.4453 12.4223 15.4453 12.0469V12.0469ZM11.3672 12.0469C11.3672 11.6715 11.6715 11.3672 12.0469 11.3672V11.3672C12.4223 11.3672 12.7266 11.6715 12.7266 12.0469V12.0469C12.7266 12.4223 12.4223 12.7266 12.0469 12.7266V12.7266C11.6715 12.7266 11.3672 12.4223 11.3672 12.0469V12.0469Z"
        fill="currentColor"
        className="text-white"
      />
    </svg>
  )
}

export function TwitterIcon() {
  return (
    <svg
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <rect
        width="24"
        height="24"
        rx="6"
        fill="currentColor"
        className="text-twitter dark:text-gray-400 dark:text-opacity-30"
      />
      <g clip-path="url(#clip0)">
        <path
          d="M17.0194 9.49538C17.0249 9.60548 17.0269 9.71695 17.0269 9.82706C17.0269 13.2187 14.4461 17.1283 9.72705 17.1283C8.27728 17.1283 6.92946 16.7035 5.7937 15.9748C6.46549 16.0561 7.1467 16.0041 7.7984 15.822C8.4501 15.6398 9.05951 15.331 9.5918 14.9132C9.05649 14.903 8.53772 14.7259 8.10802 14.4065C7.67833 14.0871 7.35919 13.6414 7.19522 13.1317C7.57996 13.2037 7.97593 13.1886 8.35408 13.0875C7.77337 12.9698 7.25122 12.6549 6.87614 12.1962C6.50105 11.7375 6.29609 11.1632 6.29599 10.5706V10.5387C6.65228 10.7369 7.05076 10.8471 7.45826 10.8602C6.91442 10.4976 6.52945 9.9412 6.38191 9.30445C6.23438 8.66771 6.33541 7.99867 6.66438 7.43388C7.30858 8.22671 8.11235 8.87516 9.02349 9.33711C9.93463 9.79906 10.9328 10.0642 11.953 10.1153C11.9089 9.92332 11.8868 9.72698 11.8871 9.53004C11.8871 9.19321 11.9535 8.85969 12.0824 8.54851C12.2113 8.23733 12.4002 7.95459 12.6385 7.71645C12.8767 7.47831 13.1594 7.28943 13.4707 7.16059C13.7819 7.03176 14.1154 6.96549 14.4522 6.96558C14.8033 6.96501 15.1507 7.03657 15.4729 7.17582C15.7951 7.31507 16.0853 7.51904 16.3255 7.77509C16.8999 7.66137 17.4508 7.45084 17.9547 7.15249C17.763 7.74668 17.3621 8.25102 16.8264 8.57168C17.335 8.51139 17.8317 8.3753 18.3 8.16795C17.9559 8.68345 17.5222 9.13304 17.0194 9.49538V9.49538Z"
          fill="currentColor"
          className="text-white"
        />
      </g>
      <defs>
        <clipPath id="clip0">
          <rect
            width="13.5938"
            height="13.5938"
            fill="currentColor"
            className="text-white"
            transform="translate(5.25 5.25)"
          />
        </clipPath>
      </defs>
    </svg>
  )
}

export function GitHubIcon() {
  return (
    <svg
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <rect
        width="24"
        height="24"
        rx="6"
        fill="currentColor"
        className="text-black dark:text-gray-400 dark:text-opacity-30"
      />
      <g clip-path="url(#clip0)">
        <path
          fillRule="evenodd"
          clipRule="evenodd"
          d="M12.0597 4.92871C8.10667 4.92871 4.90112 8.18829 4.90112 12.2095C4.90112 15.4264 6.95228 18.1556 9.7966 19.1184C10.1544 19.1858 10.2857 18.9604 10.2857 18.7681C10.2857 18.5945 10.2791 18.021 10.276 17.4126C8.28447 17.853 7.86423 16.5535 7.86423 16.5535C7.5386 15.7119 7.0694 15.4882 7.0694 15.4882C6.4199 15.0363 7.11836 15.0456 7.11836 15.0456C7.83721 15.0968 8.21571 15.7959 8.21571 15.7959C8.85419 16.909 9.89037 16.5872 10.2989 16.4011C10.3631 15.9307 10.5487 15.6092 10.7534 15.4275C9.16335 15.2434 7.49189 14.6191 7.49189 11.8292C7.49189 11.0343 7.77153 10.3848 8.22946 9.87494C8.15514 9.69142 7.9101 8.95102 8.29881 7.94812C8.29881 7.94812 8.89994 7.75244 10.2679 8.69444C10.839 8.53314 11.4514 8.45221 12.0597 8.44946C12.6681 8.45221 13.281 8.53314 13.853 8.69444C15.2194 7.75244 15.8197 7.94812 15.8197 7.94812C16.2093 8.95102 15.9642 9.69142 15.8899 9.87494C16.3489 10.3848 16.6266 11.0343 16.6266 11.8292C16.6266 14.6257 14.952 15.2415 13.3579 15.4217C13.6147 15.6477 13.8435 16.0908 13.8435 16.7701C13.8435 17.7441 13.8351 18.5282 13.8351 18.7681C13.8351 18.9619 13.964 19.1889 14.3269 19.1174C17.1696 18.1536 19.2182 15.4253 19.2182 12.2095C19.2182 8.18829 16.0132 4.92871 12.0597 4.92871Z"
          fill="currentColor"
          className="text-white"
        />
        <path
          fillRule="evenodd"
          clipRule="evenodd"
          d="M7.61237 15.3825C7.59661 15.4188 7.54065 15.4295 7.48968 15.4047C7.43776 15.3809 7.40859 15.3316 7.42543 15.2953C7.44084 15.258 7.49691 15.2478 7.54871 15.2725C7.60075 15.2964 7.63039 15.3462 7.61237 15.3825Z"
          fill="currentColor"
          className="text-white"
        />
        <path
          fillRule="evenodd"
          clipRule="evenodd"
          d="M7.90258 15.7114C7.86842 15.7436 7.80168 15.7287 7.7564 15.6778C7.70958 15.627 7.70081 15.5591 7.73542 15.5265C7.77063 15.4943 7.83535 15.5093 7.88229 15.5601C7.92912 15.6115 7.93826 15.6789 7.90258 15.7114Z"
          fill="currentColor"
          className="text-white"
        />
        <path
          fillRule="evenodd"
          clipRule="evenodd"
          d="M8.18464 16.1306C8.14077 16.1616 8.06905 16.1326 8.0247 16.0678C7.98087 16.0031 7.98087 15.9254 8.02566 15.8943C8.07013 15.8632 8.14077 15.8912 8.18571 15.9555C8.22943 16.0212 8.22943 16.0989 8.18464 16.1306Z"
          fill="currentColor"
          className="text-white"
        />
        <path
          fillRule="evenodd"
          clipRule="evenodd"
          d="M8.57129 16.536C8.53205 16.58 8.44847 16.5681 8.3873 16.5081C8.32472 16.4494 8.3073 16.3661 8.34666 16.3221C8.38637 16.2779 8.4704 16.2903 8.53205 16.3499C8.59418 16.4085 8.61312 16.4924 8.57129 16.536Z"
          fill="currentColor"
          className="text-white"
        />
        <path
          fillRule="evenodd"
          clipRule="evenodd"
          d="M9.10486 16.7711C9.08756 16.8281 9.00705 16.854 8.92598 16.8298C8.84503 16.8049 8.79201 16.738 8.80839 16.6804C8.82521 16.623 8.90608 16.596 8.98775 16.622C9.06858 16.6468 9.12171 16.7131 9.10486 16.7711Z"
          fill="currentColor"
          className="text-white"
        />
        <path
          fillRule="evenodd"
          clipRule="evenodd"
          d="M9.69067 16.8148C9.69267 16.8748 9.62391 16.9246 9.53881 16.9255C9.45322 16.9276 9.38398 16.879 9.38306 16.8199C9.38306 16.7593 9.45026 16.71 9.53585 16.7085C9.62095 16.7068 9.69067 16.7551 9.69067 16.8148Z"
          fill="currentColor"
          className="text-white"
        />
        <path
          fillRule="evenodd"
          clipRule="evenodd"
          d="M10.2359 16.7205C10.2461 16.7791 10.1869 16.8392 10.1024 16.8551C10.0193 16.8707 9.94237 16.8345 9.93182 16.7764C9.92148 16.7164 9.98172 16.6562 10.0647 16.6406C10.1493 16.6257 10.2251 16.6609 10.2359 16.7205Z"
          fill="currentColor"
          className="text-white"
        />
      </g>
      <defs>
        <clipPath id="clip0">
          <rect
            width="14.3438"
            height="14.3438"
            fill="currentColor"
            className="text-white"
            transform="translate(4.875 4.875)"
          />
        </clipPath>
      </defs>
    </svg>
  )
}

export function FigmaIcon() {
  return (
    <svg
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <rect
        width="24"
        height="24"
        rx="6"
        fill="currentColor"
        className="text-black dark:text-gray-400 dark:text-opacity-30"
      />
      <path
        d="M9.63338 19.8C10.2522 19.8 10.8457 19.5541 11.2833 19.1166C11.7209 18.679 11.9667 18.0855 11.9667 17.4666V15.1333H9.63338C9.01454 15.1333 8.42105 15.3791 7.98347 15.8167C7.54588 16.2543 7.30005 16.8478 7.30005 17.4666C7.30005 18.0855 7.54588 18.679 7.98347 19.1166C8.42105 19.5541 9.01454 19.8 9.63338 19.8V19.8Z"
        fill="white"
      />
      <path
        d="M7.30005 12.4C7.30005 11.7811 7.54588 11.1877 7.98347 10.7501C8.42105 10.3125 9.01454 10.0667 9.63338 10.0667H11.9667V14.7333H9.63338C9.01454 14.7333 8.42105 14.4875 7.98347 14.0499C7.54588 13.6123 7.30005 13.0188 7.30005 12.4V12.4Z"
        fill="white"
      />
      <path
        d="M7.30005 7.33333C7.30005 6.71481 7.54563 6.12159 7.98282 5.68406C8.42001 5.24653 9.01304 5.00048 9.63156 5H11.9649V9.66667H9.63338C9.01454 9.66667 8.42105 9.42083 7.98347 8.98325C7.54588 8.54566 7.30005 7.95217 7.30005 7.33333V7.33333Z"
        fill="white"
      />
      <path
        d="M12.3999 5H14.7332C15.3521 5 15.9456 5.24583 16.3832 5.68342C16.8207 6.121 17.0666 6.71449 17.0666 7.33333C17.0666 7.95217 16.8207 8.54566 16.3832 8.98325C15.9456 9.42083 15.3521 9.66667 14.7332 9.66667H12.3999V5Z"
        fill="white"
      />
      <path
        d="M16.9667 12.4034C16.9667 13.0222 16.7209 13.6157 16.2833 14.0533C15.8457 14.4909 15.2522 14.7367 14.6334 14.7367C14.0145 14.7367 13.4211 14.4909 12.9835 14.0533C12.5459 13.6157 12.3 13.0222 12.3 12.4034C12.3 11.7846 12.5459 11.1911 12.9835 10.7535C13.4211 10.3159 14.0145 10.0701 14.6334 10.0701C15.2522 10.0701 15.8457 10.3159 16.2833 10.7535C16.7209 11.1911 16.9667 11.7846 16.9667 12.4034V12.4034Z"
        fill="white"
      />
    </svg>
  )
}

export function ExternalLinkIcon() {
  return (
    <svg
      width="10"
      height="9"
      viewBox="0 0 10 9"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        d="M9.00195 6.32617V0.824219C9.00195 0.490234 8.79102 0.267578 8.45117 0.267578L2.94922 0.279297C2.62109 0.279297 2.41016 0.519531 2.41016 0.794922C2.41016 1.07031 2.65039 1.30469 2.92578 1.30469H4.66602L7.45508 1.19922L6.39453 2.13672L1.16211 7.38086C1.05664 7.48633 0.998047 7.61523 0.998047 7.73828C0.998047 8.01367 1.24414 8.27734 1.53125 8.27734C1.66602 8.27734 1.78906 8.22461 1.89453 8.11914L7.13281 2.875L8.07617 1.81445L7.96484 4.48047V6.34961C7.96484 6.61914 8.19922 6.86523 8.48633 6.86523C8.76172 6.86523 9.00195 6.63672 9.00195 6.32617Z"
        fill="currentColor"
      />
    </svg>
  )
}
