 
import { createGlobalStyle } from 'styled-components';
import { theme } from '../../components/theme';

export const ATVImgStyles = createGlobalStyle`
  .atvImg {
    border-radius: 7px;
    transform-style: preserve-3d;
    -webkit-tap-highlight-color: rgba(#000,0);
    height: 100%;
  }

  .atvImg img {
    border-radius: 7px;
    box-shadow: ${theme.shadows.default};
  }

  .atvImg-container {
    position: relative;
    width: 100%;
    height: 100%;
    border-radius: 7px;
    transition: all 0.2s ease-out;
  }

  .atvImg-container.over .atvImg-shadow {
    box-shadow: ${theme.shadows.hover};
  }

  .atvImg-layers {
    position: relative;
    width: 100%;
    height: 100%;
    border-radius: 7px;
    overflow: hidden;
    transform-style: preserve-3d;
  }

  .atvImg-rendered-layer {
    position: absolute;
    width: 104%;
    height: 104%;
    top: -2%; 
    left: -2%;
    background-repeat: no-repeat;
    background-position: center;
    background-color: transparent;
    background-size: cover;
    transition: all 0.1s ease-out;
  }

  .atvImg-shadow {
    position: absolute;
    top: 0; 
    left: 0;
    width: 100%;
    height: 100%;
    transition: all 0.2s ease-out;
    box-shadow: ${theme.shadows.default};
    border-radius: 7px;
  }

  .atvImg-shine {
    position: absolute;
    top: 0; 
    left: 0; 
    right: 0; 
    bottom: 0;
    border-radius: 7px;
    background: linear-gradient(135deg, rgba(255,255,255,.25) 0%,rgba(255,255,255,0) 60%);
  }
`;
