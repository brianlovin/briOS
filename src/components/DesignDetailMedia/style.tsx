import styled from 'styled-components';

export const DetailContainer = styled.div`
  display: flex;
  flex-direction: column;
  min-height: 680px;
`;

export const MediaContainer = styled.div`
  border-radius: 8px;
  background: ${props => props.theme.bg.inset};
  margin: 32px 0 64px;
  padding: 16px;
  width: 100%;
  display: flex;
  align-items: center;
  justify-content: center;

  @media (max-width: 968px) {
    width: calc(100% + 32px);
    margin-left: -16px;
    border-radius: 0;
    padding: 8px;
  }
`;

export const Video = styled.video`
  width: 100%;
  height: 100%;
  min-height: 680px;
  max-width: ${props => props.landscape ? '100%' : '400px'};
  border-radius: 4px;

  @media (max-width: 968px) {
    min-height: 630px;
  }
`;

export const DetailTitle = styled.h5`
  font-size: 24px;
  font-weight: 700;
  color: ${props => props.theme.text.default};
  margin-bottom: 16px;

  @media (max-width: 968px) {
    max-width: 100%;
  }
`;
