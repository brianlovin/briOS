// @flow
import styled, { css } from 'styled-components'
import Markdown from 'react-markdown'

export const CardContent = styled.div`
  padding: 24px 16px;
  display: flex;
  width: 100%;

  @media (max-width: 768px) {
    flex-direction: ${(props) => (props.isCollapsed ? 'row' : 'column')};
  }
`

export const Title = styled.h3`
  font-size: 18px;
  font-weight: 500;
  color: ${theme.text.default};
  display: flex;
  line-height: 1.4;
  justify-content: space-between;
  align-items: flex-start;
`

export const Description = styled(Markdown)`
  font-size: 16px;
  font-weight: 400;
  color: ${theme.text.secondary};
  margin-top: 8px;
  padding-right: 16px;

  p:first-of-type {
    margin-top: 0;
  }

  p {
    margin-top: 12px;
  }
`

export const SectionHeading = styled.h5`
  font-size: 12px;
  font-weight: 500;
  color: ${theme.text.tertiary};
  text-transform: uppercase;
  letter-spacing: 0.5px;

  @media (max-width: 768px) {
    margin-top: 24px;
    margin-bottom: 8px;
  }
`

export const CheckboxContainer = styled.div`
  display: flex;
  align-items: flex-start;
  width: 48px;
  justify-content: center;

  @media (max-width: 768px) {
    width: auto;
    margin-left: 8px;
    margin-top: 4px;
    width: 32px;
  }

  input[type='checkbox'] {
    position: absolute;
  }

  input[type='checkbox'] + label {
    width: 32px;
    height: 32px;
    border-radius: 4px;
    border: 1px solid ${theme.border.default};
    background: ${theme.bg.wash};
    cursor: pointer;
    position: relative;
    overflow: hidden;
    text-indent: -1000px;
  }

  input[type='checkbox'] + label:hover {
    ${Shadows.default};
    background: ${theme.bg.default};
  }

  input[type='checkbox'] + label::after {
    content: '';
    position: absolute;
    display: block;
    left: 11px;
    top: 6px;
    width: 6px;
    height: 12px;
    border: solid ${theme.border.active};
    border-width: 0 2px 2px 0;
    transform: rotate(45deg);
  }

  input[type='checkbox']:checked + label {
    border: 1px solid ${theme.bg.default};
  }

  input[type='checkbox']:checked + label::after {
    border: solid ${theme.bg.default};
    border-width: 0 2px 2px 0;
  }

  /* This ::before pseudo-element is used to animate the gradient
     which does not support transitions. */
  input[type='checkbox'] + label::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    transition: opacity ${theme.animations.default};
    opacity: 0;
    background-image: radial-gradient(circle at top right, #a913de, #6ac9ff);
    box-shadow: inset 0 0 1px rgba(0, 0, 0, 0.4);
  }

  input[type='checkbox']:checked + label::before {
    opacity: 1;
    background-color: ${theme.success.default};
  }

  input[type='checkbox']:active + label,
  input[type='checkbox']:focus + label {
    box-shadow: 0 0 0 1px ${theme.bg.default},
      0 0 0 3px ${(props) => hexa(props.theme.brand.default, 0.5)};
  }
  input[type='checkbox']:active:checked + label,
  input[type='checkbox']:focus:checked + label {
    box-shadow: 0 0 0 1px ${theme.bg.default},
      0 0 0 3px ${(props) => hexa(props.theme.spectrum.default, 0.5)};
  }
`

export const ResourceContent = styled.div`
  display: flex;
  flex-direction: column;
  margin-top: 2px;
  padding-left: 16px;
  width: 100%;
  justify-content: ${(props) => (props.isCollapsed ? 'center' : 'flex-start')};

  @media (max-width: 768px) {
    padding-left: ${(props) => (props.isCollapsed ? '16px' : '8px')};
    margin-top: ${(props) => (props.isCollapsed ? '0px' : '24px')};
    justify-content: ${(props) =>
      props.isCollapsed ? 'center' : 'flex-start'};
  }
`

export const AppsContainer = styled.div``

export const AppRowContainer = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-top: 8px;
  width: 100%;
  border-radius: 6px;
  padding: 4px 8px;
  padding-left: 16px;
  margin-left: -16px;
  padding-right: 4px;
  width: calc(100% + 12px);
  flex-wrap: wrap;

  @media (max-width: 768px) {
    border-top: 1px solid ${theme.bg.wash};
    border-radius: 0;
    margin-top: 0px;
    margin-left: -24px;
    width: calc(100% + 40px);
    padding: 12px 24px;

    &:last-of-type {
      border-bottom: 1px solid ${theme.bg.wash};
    }

    &:hover {
      background: ${theme.bg.default}!important;
    }
  }

  &:hover {
    background: ${theme.bg.wash};
  }
`

export const AppMeta = styled.a`
  display: flex;
  align-items: center;
  padding-right: 6px;
  border-radius: 4px;

  &:active,
  &:focus {
    box-shadow: 0 0 0 1px ${theme.bg.default},
      0 0 0 3px ${(props) => hexa(props.theme.text.tertiary, 0.25)};
  }
`

export const AppIcon = styled.img`
  width: 40px;
  height: 40px;
  border-radius: 8px;
  margin-right: 12px;

  @media (max-width: 768px) {
    width: 32px;
    height: 32px;
    border-radius: 6px;
  }
`

export const AppName = styled.p`
  font-size: 16px;
  font-weight: 400;
  color: ${theme.text.secondary};
`

export const AppSourcesList = styled.ul`
  list-style-type: none;
  display: flex;
  align-items: center;
  margin-right: 8px;

  @media (max-width: 768px) {
    margin-right: 0;
    justify-content: flex-start;
  }
`

export const AppSourcesListItem = styled.li`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  color: ${theme.text.tertiary};
  padding: 2px 8px;
  min-width: 56px;
  transition: all 0.1s ease-in-out;

  a {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    padding: 2px;
    border-radius: 4px;

    &:hover {
      color: ${theme.text.default};
    }

    &:active,
    &:focus {
      color: ${theme.text.default};
      box-shadow: 0 0 0 1px ${theme.bg.default},
        0 0 0 3px ${(props) => hexa(props.theme.text.tertiary, 0.25)};
    }
  }

  .icon {
    position: relative;
    top: 5px;
    left: 4px;
  }

  @media (max-width: 768px) {
    padding: 4px;
    min-width: 40px;

    .icon {
      position: relative;
      top: 3px;
      left: 5px;
    }

    &:hover {
      background: ${theme.bg.default}!important;
    }

    ${(props) =>
      props.hideOnMobile &&
      css`
        display: none;
      `}
  }
`

export const AppSourcesLabel = styled.span`
  font-size: 12px;
  font-weight: 400;
  margin-top: 4px;

  @media (max-width: 768px) {
    display: none;
  }
`

export const ResourceRowContainer = styled.a`
  display: flex;
  margin-top: 4px;
  width: 100%;
  border-radius: 6px;
  padding: 8px 20px 8px 12px;
  margin-left: -12px;
  color: ${theme.text.tertiary};
  width: calc(100% + 8px);
  line-height: 1.3;

  &:first-of-type {
    margin-top: 8px;
  }

  .icon {
    margin-right: 8px;
  }

  &:hover,
  &:active,
  &:focus {
    color: ${theme.text.default};
  }

  &:active,
  &:focus {
    box-shadow: 0 0 0 1px ${theme.bg.default},
      0 0 0 3px ${(props) => hexa(props.theme.text.tertiary, 0.25)};
  }

  @media (max-width: 768px) {
    width: calc(100% + 40px);
    border-radius: 4px;
    align-items: flex-start;
    margin-left: -24px;
    padding-left: 24px;

    &:hover,
    &:active,
    &:focus {
      background: ${theme.bg.default}!important;
    }

    .icon {
      margin-top: 1px;
      margin-left: 6px;
      margin-right: 18px !important;
    }
  }
`

export const ResourceName = styled.p`
  font-size: 16px;
  font-weight: 400;
`

export const Divider = styled.hr`
  border-bottom: 1px solid ${tint(theme.bg.wash, -4)};
  margin-top: 24px;
  margin-bottom: 24px;
  height: 1px;
  width: 100%;

  @media (max-width: 768px) {
    display: none;
  }
`

export const Content = styled.div`
  transition: max-height ${theme.animations.default},
    opacity ${theme.animations.default}, visibility ${theme.animations.default};

  max-height: 2000px;
  max-height: var(--maxHeight);
  opacity: 1;
  visibility: visible;

  &[aria-hidden='true'] {
    max-height: 0;
    opacity: 0;
    visibility: hidden;
  }
`

export const Uncollapse = styled.button`
  background: ${theme.bg.wash};
  border-radius: 20px;
  padding: 8px 16px;
  font-size: 15px;
  color: ${theme.text.tertiary};
  cursor: pointer;
  line-height: 1;
  display: flex;
  align-items: center;
  justify-content: center;
  margin-right: 8px;
  margin-left: 16px;
  flex: 0 1 140px;

  @media (max-width: 768px) {
    display: none;
  }

  &:hover {
    color: ${theme.text.default};
    background: ${tint(theme.bg.wash, -4)};
  }
  &:active,
  &:focus {
    transition: all 0.2s ease-in-out;

    box-shadow: 0 0 0 1px ${theme.bg.default},
      0 0 0 3px ${(props) => hexa(props.theme.text.tertiary, 0.25)};
  }
`

export const OfferContainer = styled.a`
  display: flex;
  align-items: center;
  width: calc(100% - 8px);
  box-shadow: inset 0 0 1px ${theme.border.active};
  border-radius: 4px;
  background: ${theme.bg.default};
  padding: 8px 16px;
  position: relative;
  margin-top: 4px;
  margin-bottom: 8px;
  font-size: 14px;
  font-weight: 500;
  color: ${theme.text.tertiary};
  overflow: hidden;

  .icon {
    margin-right: 4px;
  }

  @media (max-width: 768px) {
    align-items: flex-start;
    margin-top: 8px;
    width: 100%;

    .icon {
      display: none;
    }
  }

  &:hover {
    color: ${theme.text.secondary};
  }
  &:active,
  &:focus {
    box-shadow: inset 0 0 1px ${theme.border.active},
      0 0 0 1px ${theme.bg.default},
      0 0 0 3px ${(props) => hexa(props.theme.text.tertiary, 0.25)};
  }
`

export const LeftBorder = styled.div`
  position: absolute;
  left: 0;
  top: 0;
  bottom: 0;
  height: 100px;
  width: 4px;
  background-image: linear-gradient(to bottom, #a913de, #6ac9ff);
  border-radius: 6px 0 0 6px;
`

export const ExpandContainer = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  width: calc(100% + 12px);
  position: relative;
  background: ${theme.bg.wash};
  border: 1px solid ${tint(theme.bg.wash, -4)};
  border-radius: 6px;
  padding: 8px 16px;
  margin-bottom: -28px;
  margin-top: 16px;
  margin-left: -16px;

  @media (max-width: 768px) {
    margin-bottom: 0;
    border-left: none;
    border-right: none;
    margin-top: -1px;
    border-radius: 0;
    margin-left: -24px;
    margin-right: -16px;
    width: calc(100% + 40px);
  }
`

export const ExpandContent = styled.div`
  transition: max-height ${theme.animations.default},
    opacity ${theme.animations.default}, visibility ${theme.animations.default};
  max-height: 2000px;
  max-height: var(--maxHeight);
  opacity: 1;
  visibility: visible;

  &[aria-hidden='true'] {
    max-height: 0;
    opacity: 0;
    visibility: hidden;
  }
`
