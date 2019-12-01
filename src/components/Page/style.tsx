 
import styled from 'styled-components';

export const Container = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: flex-start;
  align-items: center;
  height: 100%;
  max-width: 100%;
`;

export const ContentContainer = styled.div`
  width: 100%;
  max-width: 768px;

  @media (max-width: 968px) {
    padding: 0 16px;
  }
`

export const InnerContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: flex-start;
  flex: 1 0 auto;
  padding-top: 64px;
  position: relative;
  width: 100%;

  @media (max-width: 968px) {
    max-width: 100%;
    padding-top: 48px;
  }
`;

export const SectionHeading = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: flex-start;
  align-items: flex-start;
  align-self: flex-start;
  margin: 128px 0 0;

  @media (max-width: 968px) {
    align-items: flex-start;
    max-width: 100%;
  }
`;

export const Heading = styled.h3`
  font-size: 32px;
  font-weight: 800;
  color: ${props => props.theme.text.default};
  letter-spacing: -0.6px;

  @media (max-width: 968px) {
    max-width: 100%;
  }
`;

export const Subheading = styled.h4`
  font-size: 22px;
  font-weight: 500;
  color: ${props => props.theme.text.secondary};

  & + & {
    margin-top: 24px;
  }

  a {
    color: ${props => props.theme.text.default};
    font-weight: 500;
    text-decoration: underline solid ${props => props.theme.border.active};
  }

  a:hover {
    text-decoration: underline solid ${props => props.theme.text.active};
  }

  @media (max-width: 968px) {
    max-width: 100%;
  }
`;

export const Paragraph = styled.p`
  font-size: 18px;
  font-weight: 400;
  color: ${props => props.theme.text.tertiary};
  margin-bottom: 16px;

  a {
    color: ${props => props.theme.text.default};
    font-weight: 500;
  }

  @media (max-width: 968px) {
    max-width: 100%;
  }
`;

export const LargeHeading = styled(Heading)`
  font-size: 44px;
`;

export const LargeSubheading = styled(Subheading)`
  font-size: 20px;
`;