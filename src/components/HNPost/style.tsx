import styled from 'styled-components'

export const LeftDivider = styled.div.attrs(({ level }) => ({
  className: `border-l-2 ${
    level > 0
      ? 'border-gray-300 dark:border-gray-800 hover:border-gray-400 dark:hover:border-gray-700'
      : 'border-blue-500'
  }`,
}))`
  position: absolute;
  left: ${(props) => (props.level > 0 ? 0 : '-20px')};
  height: 100%;
  width: 16px;
  cursor: pointer;
  opacity: 0.7;
`
