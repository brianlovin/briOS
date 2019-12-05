import styled from 'styled-components';
import theme from '../Theme';

export const StyledDismiss = styled.button`
  display: flex;
  width: 18px;
  height: 18px;
  background: none;
  align-items: center;
  justify-content: center;
  border-radius: 18px;
  color: ${props => (props.tint ? props.tint(theme) : props.theme.text.tertiary)};
  opacity: 0.5;
  cursor: pointer;

  &:hover {
    opacity: 1;
    background: ${props => props.theme.text.tertiary};
    color: ${props => props.theme.bg.secondary};
  }

  i {
    position: relative;
    top: -1px;
    font-style: normal;
    font-size: 18px;
    line-height: 1;
    font-weight: 600;
  }

  @media (max-width: 768px) {
    font-size: 20px;
  }
`;
