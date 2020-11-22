import styled from 'styled-components'

export const DetailContainer = styled.div`
  display: flex;
  flex-direction: column;
  min-height: 480px;
`

export const MediaContainer = styled.div`
  border-radius: 8px;
  margin: 32px -32px 16px;
  padding: 16px;
  width: calc(100% + 64px);
  display: flex;
  align-items: center;
  justify-content: center;

  @media (max-width: 968px) {
    width: calc(100% + 32px);
    margin-left: -16px;
    border-radius: 0;
    padding: 8px;
  }
`

export const Video = styled.video`
  width: 100%;
  height: 100%;
  min-height: ${(props) => (props.landscape ? '320px' : '680px')};
  max-width: ${(props) => (props.landscape ? '100%' : '400px')};
  border-radius: 8px;
  overflow: hidden;

  @media (max-width: 968px) {
    min-height: ${(props) => (props.landscape ? '320px' : '630px')};
  }
`

export const DetailTitle = styled.h5`
  font-size: 24px;
  font-weight: 700;

  @media (max-width: 968px) {
    max-width: 100%;
  }
`
