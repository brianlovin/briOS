import lightTheme from './light'
import darkTheme from './dark'

const defaultTheme = {
  social: {
    facebook: '#1877f2',
    twitter: '#00ACED',
  },
  breakpoints: [
    '1440px', // 0
    '1256px', // 1
    '1080px', // 2
    '968px',  // 3
    '768px',  // 4
    '512px',  // 5
    '420px'   // 6
  ],
  space: [
    '0px',  // 0
    '4px',  // 1
    '8px',  // 2
    '16px', // 3
    '24px', // 4
    '32px', // 5
    '48px', // 6
    '64px', // 7
    '96px', // 8
    '128px',// 9
  ],
  fontSizes: [
    '0.8rem',   // 0
    '1rem',     // 1
    '1.2rem',  // 2
    '1.5rem', // 3
    '1.875rem', // 4
    '2.25rem', // 5
    '2.75rem'  // 6
  ],
  fonts: {
    body: "'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Helvetica, Arial, sans-serif, 'Apple Color Emoji', 'Segoe UI Emoji', 'Segoe UI Symbol'",
    serif: "'Merriweather', Georgia, Times New Roman, Times, serif, 'Apple Color Emoji', 'Segoe UI Emoji', 'Segoe UI Symbol'",
    heading: "'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Helvetica, Arial, sans-serif, 'Apple Color Emoji', 'Segoe UI Emoji', 'Segoe UI Symbol'",
    monospace: 'SFMono-Regular,Consolas,Liberation Mono,Menlo,monospace',
  },
  fontWeights: {
    body: 400,
    subheading: 500,
    link: 600,
    bold: 700,
    heading: 800,
  },
  lineHeights: {
    body: 1.5,
    heading: 1.2,
    code: 1.6,
  },
  shadows: {
    default: '0 4px 8px rgba(0,0,0,0.08)',
    hover: '0 8px 24px rgba(0,0,0,0.10)',
    active: '0 6px 20px rgba(0,0,0,0.09)',
    button: '0 4px 12px rgba(0,0,0,0.08)',
    largeHover: "0 1px 0.4px rgba(0, 0, 0, 0),0 1.7px 0.8px rgba(0, 0, 0, 0.001),0 2.3px 1.3px rgba(0, 0, 0, 0.002),0 2.8px 2px rgba(0, 0, 0, 0.004),0 3.3px 2.9px rgba(0, 0, 0, 0.007),0 4px 4.1px rgba(0, 0, 0, 0.012),0 4.9px 5.8px rgba(0, 0, 0, 0.018),0 6.3px 8.4px rgba(0, 0, 0, 0.029),0 8.8px 12.9px rgba(0, 0, 0, 0.05),0 15px 23px rgba(0, 0, 0, 0.11)"
  },
  animations: {
    default: '0.15s ease-out',
    hover: '0.15s ease-in',
    active: '0.15s ease-in-out',
  },
};


export const light = { ...defaultTheme, ...lightTheme }
export const dark = { ...defaultTheme, ...darkTheme }
export default defaultTheme