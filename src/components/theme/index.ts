import lightTheme from './light'
import darkTheme from './dark'

const defaultTheme = {
  brand: {
    default: '#067AE4',
    alt: '#0684F8',
  },
  social: {
    facebook: '#1877f2',
    twitter: '#00ACED',
  },
  success: {
    default: '#21BE7C',
  },
  warn: {
    default: '#B00A0A',
  },
  spectrum: {
    default: '#4400CC',
    alt: '#7B16FF',
  },
  shadows: {
    default: '0 4px 8px rgba(0,0,0,0.08)',
    hover: '0 8px 24px rgba(0,0,0,0.10)',
    active: '0 6px 20px rgba(0,0,0,0.09)',
    button: '0 4px 12px rgba(0,0,0,0.08)',
    heavyHover: '0 12px 24px rgba(0,0,0,0.12), 0 8px 16px rgba(0,0,0,0.12), 0 4px 2px rgba(0,0,0,0.04),  0 6px 8px rgba(0,0,0,0.04)'
  },
  animations: {
    default: '0.15s ease-out',
    hover: '0.15s ease-in',
    active: '0.15s ease-in-out',
  },
};


export const light = {...defaultTheme, ...lightTheme}
export const dark = {...defaultTheme, ...darkTheme}
export default defaultTheme