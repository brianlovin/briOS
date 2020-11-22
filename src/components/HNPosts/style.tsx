import styled from 'styled-components'

export const StyledA = styled.a.attrs(({ active }) => ({
  className: `${
    active
      ? 'text-blue-500 bg-blue-500 bg-opacity-10'
      : 'text-gray-700 dark:text-gray-300 hover:bg-blue-500 hover:bg-opacity-10 '
  }`,
}))`
  padding: 4px 24px 6px;
  border-radius: 4px;
  font-size: 14px;
  font-weight: 600;
  cursor: pointer;
`
