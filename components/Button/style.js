// @flow
import styled, { css } from 'styled-components';
import { hexa, tint } from '../globals';
import type { ButtonSize } from './types';
import { theme } from '../theme';

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
      return '18px';
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
  font-weight: 500;
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
      props.disabled ? 'none' : `${theme.shadows.button}`};
  }
`;

export const Button = styled.button`
  ${base}
  border: 1px solid ${theme.border.default};
  color: ${theme.text.secondary};
  background-color: ${theme.bg.default};
  background-image: ${props =>
    `linear-gradient(to bottom, ${props.theme.bg.default}, ${
      props.theme.bg.wash
    })`};
  
  &:hover {
    color: ${theme.text.default};
  }

  &:active {
    border: 1px solid ${theme.border.active};
    background-image: ${props =>
      `linear-gradient(to top, ${props.theme.bg.default}, ${
        props.theme.bg.wash
      })`};
  }

  &:focus {
    box-shadow: 0 0 0 1px ${props => props.theme.bg.default}, 0 0 0 3px ${
  theme.border.default
};
  }
`;

export const PrimaryButton = styled.button`
  ${base}
  border: 1px solid ${theme.brand.default};
  color: ${theme.bg.default};
  background-color: ${theme.brand.alt};
  background-image: ${props =>
    `linear-gradient(to bottom, ${props.theme.brand.alt}, ${
      props.theme.brand.default
    })`};
  text-shadow: 0 1px 1px rgba(0,0,0,0.08);

  &:hover {
    color: ${theme.text.reverse};
    background-image: ${props =>
      `linear-gradient(to bottom, ${tint(props.theme.brand.alt, 16)}, ${tint(
        props.theme.brand.default,
        16
      )})`};
    box-shadow: ${props => (props.disabled ? 'none' : theme.shadows.button)};
  }

  &:active {
    border: 1px solid ${theme.brand.default};
    background-image: ${props =>
      `linear-gradient(to top, ${props.theme.brand.alt}, ${
        props.theme.brand.default
      })`};
  }

  &:focus {
    box-shadow: 0 0 0 1px ${props =>
      props.theme.bg.default}, 0 0 0 3px ${props =>
  hexa(props.theme.brand.alt, 0.16)};
  }
`;

export const GhostButton = styled.button`
  ${base} border: none;
  color: ${theme.text.secondary};
  box-shadow: none;
  background-color: transparent;
  background-image: none;

  &:hover {
    background: ${props => tint(props.theme.bg.wash, -3)};
    color: ${theme.text.default};
    box-shadow: none;
  }

  &:focus {
    box-shadow: 0 0 0 1px ${theme.bg.default},
      0 0 0 3px ${props => hexa(props.theme.text.tertiary, 0.08)};
  }
`;

export const OutlineButton = styled.button`
  ${base}
  border: 1px solid ${theme.border.default};
  color: ${theme.text.secondary};
  background-color: transparent;
  background-image: none;

  &:hover {
    color: ${theme.text.default};
    border: 1px solid ${theme.border.active};
    box-shadow: none;
  }

  &:active {
    border: 1px solid ${theme.text.placeholder};
  }

  &:focus {
    box-shadow: 0 0 0 1px ${props => props.theme.bg.default}, 0 0 0 3px ${
  theme.border.default
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
      box-shadow: 0 0 0 1px ${theme.bg.default},
        0 0 0 3px ${props => hexa(props.theme.brand.alt, 0.16)};
    }
  }
`;

export const FacebookButton = styled.button`
  ${base}
  border: 1px solid ${theme.social.facebook};
  color: ${theme.bg.default};
  background-color: ${theme.social.facebook};
  background-image: ${props =>
    `linear-gradient(to bottom, ${props.theme.social.facebook}, ${
      props.theme.social.facebook
    })`};
  text-shadow: 0 1px 1px rgba(0,0,0,0.08);

  .icon {
    margin-right: 8px;
    margin-left: -4px;
  }

  &:hover {
    color: ${theme.text.reverse};
    background-image: ${props =>
      `linear-gradient(to bottom, ${tint(
        props.theme.social.facebook,
        16
      )}, ${tint(props.theme.social.facebook, 16)})`};
    box-shadow: ${props => (props.disabled ? 'none' : theme.shadows.button)};
  }

  &:active {
    border: 1px solid ${theme.social.facebook};
    background-image: ${props =>
      `linear-gradient(to top, ${props.theme.social.facebook}, ${
        props.theme.social.facebook
      })`};
  }

  &:focus {
    box-shadow: 0 0 0 1px ${props =>
      props.theme.bg.default}, 0 0 0 3px ${props =>
  hexa(props.theme.social.facebook, 0.16)};
  }
`;

export const TwitterButton = styled.button`
  ${base}
  border: 1px solid ${theme.social.twitter};
  color: ${theme.bg.default};
  background-color: ${theme.social.twitter};
  background-image: ${props =>
    `linear-gradient(to bottom, ${props.theme.social.twitter}, ${
      props.theme.social.twitter
    })`};
  text-shadow: 0 1px 1px rgba(0,0,0,0.08);

  .icon {
    margin-right: 8px;
    margin-left: -4px;
  }

  &:hover {
    color: ${theme.text.reverse};
    background-image: ${props =>
      `linear-gradient(to bottom, ${tint(
        props.theme.social.twitter,
        4
      )}, ${tint(props.theme.social.twitter, 4)})`};
    box-shadow: ${props => (props.disabled ? 'none' : theme.shadows.button)};
  }

  &:active {
    border: 1px solid ${theme.social.twitter};
    background-image: ${props =>
      `linear-gradient(to top, ${props.theme.social.twitter}, ${
        props.theme.social.twitter
      })`};
  }

  &:focus {
    box-shadow: 0 0 0 1px ${props =>
      props.theme.bg.default}, 0 0 0 3px ${props =>
  hexa(props.theme.social.twitter, 0.16)};
  }
`;

export const CopyLinkButton = styled.button`
  ${base}
  border: 1px solid ${props =>
    props.isClicked
      ? tint(props.theme.success.default, -10)
      : props.theme.border.default};
  color: ${props =>
    props.isClicked ? props.theme.bg.default : props.theme.text.secondary};
  background-color: ${props =>
    props.isClicked ? props.theme.success.default : props.theme.bg.default};
  background-image: ${props =>
    `linear-gradient(to bottom, ${
      props.isClicked ? props.theme.success.default : props.theme.bg.default
    }, ${
      props.isClicked
        ? tint(props.theme.success.default, -4)
        : props.theme.bg.wash
    })`};
  transition: border 0.2s ease-in-out, background-color 0.2s ease-in-out, background-image 0.2s ease-in-out;

  &:hover {
    transition: border 0.2s ease-in-out, background-color 0.2s ease-in-out, background-image 0.2s ease-in-out;
    color: ${props =>
      props.isClicked ? props.theme.bg.default : props.theme.text.default};
  }

  &:active {
    border: 1px solid ${props =>
      props.isClicked
        ? tint(props.theme.success.default, -10)
        : props.theme.border.active};
    background-image: ${props =>
      `linear-gradient(to bottom, ${
        props.isClicked
          ? tint(props.theme.success.default, -4)
          : props.theme.bg.default
      }, ${
        props.isClicked ? props.theme.success.default : props.theme.bg.wash
      })`};
  }

  .icon {
    margin-right: 8px;
    margin-left: -4px;
  }

  &:focus {
    box-shadow: 0 0 0 1px ${props =>
      props.theme.bg.default}, 0 0 0 3px ${props =>
  props.isClicked
    ? hexa(props.theme.success.default, 0.16)
    : props.theme.border.default};
  }
`;
