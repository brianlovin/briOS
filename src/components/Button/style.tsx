import styled, { css } from 'styled-components';
import { hexa, tint } from '~/components/utils';
import { ButtonSize } from './types';

const getPadding = (size: ButtonSize) => {
  switch (size) {
    case 'small':
      return '4px 8px';
    case 'default':
      return '10px 20px';
    case 'large':
      return '14px 28px';
    default: {
      return '10px 20px';
    }
  }
};

const getFontSize = (size: ButtonSize) => {
  switch (size) {
    case 'small':
      return '14px';
    case 'default':
      return '16px';
    case 'large':
      return '28px';
    default: {
      return '16px';
    }
  }
};

const base = css`
  -webkit-appearance: none;
  display: flex;
  flex: none;
  align-self: center;
  align-items: center;
  justify-content: center;
  border-radius: 4px;
  font-size: ${props => getFontSize(props.size)};
  font-weight: 700;
  white-space: nowrap;
  word-break: keep-all;
  transition: all 0.2s ease-in-out;
  cursor: pointer;
  line-height: 1;
  position: relative;
  text-align: center;
  padding: ${props => getPadding(props.size)};
  opacity: ${props => (props.disabled ? '0.64' : '1')};
  box-shadow: ${props =>
    props.disabled ? 'none' : `0 1px 2px rgba(0,0,0,0.04)`};

  &:disabled {
    cursor: not-allowed;
  }

  &:hover {
    transition: all 0.2s ease-in-out;
    box-shadow: ${props =>
      props.disabled ? 'none' : `${props => props.theme.shadows.button}`};
  }
`;

export const Button = styled.button`
  ${base}
  border: 1px solid ${props => props.theme.border.default};
  color: ${props => props.theme.text.secondary};
  background-color: ${props => props.theme.bg.secondary};
  background-image: ${props =>
    `linear-gradient(to bottom, ${props.theme.bg.secondary}, ${
      props.theme.bg.primary
    })`};
  
  &:hover {
    color: ${props => props.theme.text.primary};
  }

  &:active {
    border: 1px solid ${props => props.theme.border.opaque};
    background-image: ${props =>
      `linear-gradient(to top, ${props.theme.bg.secondary}, ${
        props.theme.bg.primary
      })`};
  }

  &:focus {
    box-shadow: 0 0 0 1px ${props => props.theme.bg.primary}, 0 0 0 3px ${
  props => props.theme.border.default
};
  }
`;

export const PrimaryButton = styled.button`
  ${base}
  border: 1px solid ${props => props.theme.accent.blue};
  color: ${props => props.theme.bg.secondary};
  background-color: ${props => props.theme.accent.blue};
  background-image: ${props =>
    `linear-gradient(to bottom, ${props.theme.accent.blue}, ${
      props.theme.accent.blue
    })`};

  &:hover {
    color: ${props => props.theme.text.onPrimary};
    background-image: ${props =>
      `linear-gradient(to bottom, ${tint(props.theme.accent.blue, 16)}, ${tint(
        props.theme.accent.blue,
        16
      )})`};
    box-shadow: ${props => (props.disabled ? 'none' : props.theme.shadows.button)};
  }

  &:active {
    border: 1px solid ${props => props.theme.accent.blue};
    background-image: ${props =>
      `linear-gradient(to top, ${props.theme.accent.blue}, ${
        props.theme.accent.blue
      })`};
  }

  &:focus {
    box-shadow: 0 0 0 1px ${props =>
      props.theme.bg.secondary}, 0 0 0 3px ${props =>
  hexa(props.theme.accent.blue, 0.16)};
  }
`;

export const GhostButton = styled.button`
  ${base} border: none;
  color: ${props => props.theme.text.secondary};
  box-shadow: none;
  background-color: transparent;
  background-image: none;

  &:hover {
    background: ${props => tint(props.theme.bg.primary, -3)};
    color: ${props => props.theme.text.primary};
    box-shadow: none;
  }

  &:focus {
    box-shadow: 0 0 0 1px ${props => props.theme.bg.primary},
      0 0 0 3px ${props => hexa(props.theme.text.tertiary, 0.08)};
  }
`;

export const OutlineButton = styled.button`
  ${base}
  border: 1px solid ${props => props.theme.border.default};
  color: ${props => props.theme.text.secondary};
  background-color: transparent;
  background-image: none;

  &:hover {
    color: ${props => props.theme.text.primary};
    border: 1px solid ${props => props.theme.border.opaque};
    box-shadow: none;
  }

  &:active {
    border: 1px solid ${props => props.theme.text.placeholder};
  }

  &:focus {
    box-shadow: 0 0 0 1px ${props => props.theme.bg.primary}, 0 0 0 3px ${
  props => props.theme.border.default
};
  }
`;

export const ButtonRow = styled.div`
  display: flex;
  align-items: center;

  @media (max-width: 968px) {
    flex-wrap: nowrap;

    button {
      margin-top: 8px;
    }
  }
`;

export const ButtonSegmentRow = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  position: relative;

  button {
    z-index: 1;
  }

  button:active,
  button:focus {
    z-index: 2;
  }

  button:first-of-type:not(:last-of-type) {
    border-top-right-radius: 0;
    border-bottom-right-radius: 0;
  }

  button:last-of-type:not(:first-of-type) {
    border-top-left-radius: 0;
    border-bottom-left-radius: 0;
  }

  button:not(:last-of-type):not(:first-of-type) {
    border-radius: 0;
    position: relative;
    margin: 0 -1px;
  }

  ${PrimaryButton} {
    &:focus {
      box-shadow: 0 0 0 1px ${props => props.theme.bg.primary},
        0 0 0 3px ${props => hexa(props.theme.accent.blue, 0.16)};
    }
  }
`;

export const FacebookButton = styled.button`
  ${base}
  border: 1px solid ${props => props.theme.social.facebook};
  color: ${props => props.theme.bg.secondary};
  background-color: ${props => props.theme.social.facebook};
  background-image: ${props =>
    `linear-gradient(to bottom, ${props.theme.social.facebook}, ${
      props.theme.social.facebook
    })`};

  .icon {
    margin-right: 8px;
    margin-left: -4px;
  }

  &:hover {
    color: ${props => props.theme.text.onPrimary};
    background-image: ${props =>
      `linear-gradient(to bottom, ${tint(
        props.theme.social.facebook,
        16
      )}, ${tint(props.theme.social.facebook, 16)})`};
    box-shadow: ${props => (props.disabled ? 'none' : props.theme.shadows.button)};
  }

  &:active {
    border: 1px solid ${props => props.theme.social.facebook};
    background-image: ${props =>
      `linear-gradient(to top, ${props.theme.social.facebook}, ${
        props.theme.social.facebook
      })`};
  }

  &:focus {
    box-shadow: 0 0 0 1px ${props =>
      props.theme.bg.secondary}, 0 0 0 3px ${props =>
  hexa(props.theme.social.facebook, 0.16)};
  }
`;

export const TwitterButton = styled.button`
  ${base}
  border: 1px solid ${props => props.theme.social.twitter};
  color: ${props => props.theme.bg.secondary};
  background-color: ${props => props.theme.social.twitter};
  background-image: ${props =>
    `linear-gradient(to bottom, ${props.theme.social.twitter}, ${
      props.theme.social.twitter
    })`};

  .icon {
    margin-right: 8px;
    margin-left: -4px;
  }

  &:hover {
    color: ${props => props.theme.text.onPrimary};
    background-image: ${props =>
      `linear-gradient(to bottom, ${tint(
        props.theme.social.twitter,
        4
      )}, ${tint(props.theme.social.twitter, 4)})`};
    box-shadow: ${props => (props.disabled ? 'none' : props.theme.shadows.button)};
  }

  &:active {
    border: 1px solid ${props => props.theme.social.twitter};
    background-image: ${props =>
      `linear-gradient(to top, ${props.theme.social.twitter}, ${
        props.theme.social.twitter
      })`};
  }

  &:focus {
    box-shadow: 0 0 0 1px ${props =>
      props.theme.bg.secondary}, 0 0 0 3px ${props =>
  hexa(props.theme.social.twitter, 0.16)};
  }
`;

export const CopyLinkButton = styled.button`
  ${base}
  border: 1px solid transparent;
  color: ${props =>
    props.isClicked ? props.theme.bg.secondary : props.theme.text.secondary};
  background-color: ${props =>
    props.isClicked ? props.theme.accent.green : props.theme.bg.secondary};
  transition: border 0.2s ease-in-out, background-color 0.2s ease-in-out, background-image 0.2s ease-in-out;

  &:hover {
    transition: border 0.2s ease-in-out, background-color 0.2s ease-in-out, background-image 0.2s ease-in-out;
    color: ${props =>
      props.isClicked ? props.theme.bg.secondary : props.theme.text.primary};
  }

  &:active {
    border: 1px solid transparent;
  }

  .icon {
    margin-right: 8px;
    margin-left: -4px;
  }

  &:focus {
    box-shadow: 0 0 0 1px ${props =>
      props.theme.bg.secondary}, 0 0 0 3px ${props =>
  props.isClicked
    ? hexa(props.theme.accent.green, 0.16)
    : props.theme.border.default};
  }
`;
