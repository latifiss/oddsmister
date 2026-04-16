'use client';

import { createGlobalStyle } from 'styled-components';

const GlobalStyles = createGlobalStyle`

@font-face {
    font-family: 'Sofascore Sans';
    src: url('/fonts/Sofascore Sans Bold.eot');
    src: local('Sofascore Sans Bold'), local('SofascoreSans-Bold'),
        url('/fonts/Sofascore Sans Bold.eot?#iefix') format('embedded-opentype'),
        url('/fonts/Sofascore Sans Bold.woff2') format('woff2'),
        url('/fonts/Sofascore Sans Bold.woff') format('woff'),
        url('/fonts/Sofascore Sans Bold.ttf') format('truetype');
    font-weight: 700;
    font-style: normal;
}

@font-face {
    font-family: 'Sofascore Sans';
    src: url('/fonts/Sofascore Sans Medium.eot');
    src: local('Sofascore Sans Medium'), local('SofascoreSans-Medium'),
        url('/fonts/Sofascore Sans Medium.eot?#iefix') format('embedded-opentype'),
        url('/fonts/Sofascore Sans Medium.woff2') format('woff2'),
        url('/fonts/Sofascore Sans Medium.woff') format('woff'),
        url('/fonts/Sofascore Sans Medium.ttf') format('truetype');
    font-weight: 500;
    font-style: normal;
}

@font-face {
    font-family: 'Sofascore Sans';
    src: url('/fonts/Sofascore Sans Regular.eot');
    src: local('Sofascore Sans Regular'), local('SofascoreSans-Regular'),
        url('/fonts/Sofascore Sans Regular.eot?#iefix') format('embedded-opentype'),
        url('/fonts/Sofascore Sans Regular.woff2') format('woff2'),
        url('/fonts/Sofascore Sans Regular.woff') format('woff'),
        url('/fonts/Sofascore Sans Regular.ttf') format('truetype');
    font-weight: 500;
    font-style: normal;
}

    *, *::before, *::after {
        margin: 0;
        padding: 0;
        box-sizing: border-box;
    }

    body {
        font-family: 'Sofascore Sans', -apple-system, system-ui, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", "Fira Sans", Ubuntu, Oxygen, "Oxygen Sans", Cantarell, "Droid Sans", "Apple Color Emoji", "Segoe UI Emoji", "Segoe UI Symbol", "Lucida Grande", Helvetica, Arial, sans-serif;
        line-height: 1.5;
        background-color: ${({ theme }) => theme.colors.background};
        padding: 0;
        margin: 0;
    }

    :root {
        --space-xs: 4px;
        --space-sm: 8px;
        --space-base: 12px;
        --space-md: 16px;
        --space-wide: 20px;
        --space-lg: 24px;
        --space-xl: 32px;
    }

    :root {
        --body-font: 'Sofascore Sans', -apple-system, system-ui, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", "Fira Sans", Ubuntu, Oxygen, "Oxygen Sans", Cantarell, "Droid Sans", "Apple Color Emoji", "Segoe UI Emoji", "Segoe UI Symbol", "Lucida Grande", Helvetica, Arial, sans-serif;
    }

    :root {
    --oi-alabaster: rgba(248, 248, 248, 1);
    --oi-alto: rgba(221, 221, 221, 1);
    --oi-aqua-haze: rgba(224, 239, 236, 1);
    --oi-beauty-bush: rgba(243, 207, 209, 1);
    --oi-black: rgba(0, 0, 0, 1);
    --oi-boston-blue: rgba(56, 115, 184, 1);
    --oi-champagne: rgba(250, 229, 209, 1);
    --oi-chicago: rgba(87, 87, 86, 1);
    --oi-edgewater: rgba(186, 220, 213, 1);
    --oi-friar-gray: rgba(123, 123, 122, 1);
    --oi-gallery: rgba(238, 238, 238, 1);
    --oi-geyser: rgba(212, 220, 230, 1);
    --oi-gray: rgba(144, 144, 144, 1);
    --oi-gray-nickel: rgba(178, 178, 177, 1);
    --oi-heavy-metal: rgba(31, 32, 29, 1);
    --oi-korma: rgba(138, 76, 16, 1);
    --oi-manhattan: rgba(244, 198, 154, 1);
    --oi-nile-blue: rgba(25, 49, 77, 1);
    --oi-rock-blue: rgba(161, 178, 200, 1);
    --oi-milano-red: rgba(214, 30, 0, 1);
    --oi-silver: rgba(204, 203, 203, 1);
    --oi-smalt-blue: rgba(78, 142, 127, 1);
    --oi-storm-dust: rgba(111, 111, 110, 1);
    --oi-selective-yellow: rgba(255, 187, 0, 1);
    --oi-tonys-pink: rgba(228, 149, 154, 1);
    --oi-totem-pole: rgba(155, 11, 20, 1);
    --oi-tuatara: rgba(60, 60, 59, 1);
    --oi-white: rgba(255, 255, 255, 1);

    --oi-font-xs: 10.875px;
    --oi-font-sm: 12px;
    --oi-font-md: 14px;
    --oi-font-lg: 16px;
    --oi-font-xl: 18px;
    --oi-font-2xl: 20px;
    --oi-font-3xl: 22px;
    --oi-font-4xl: 24px;
    --oi-font-5xl: 26px;
    --oi-font-6xl: 28px;
    --oi-font-7xl: 32px;

    --oi-button-sm: 11px;
    --oi-button-md: 13px;
    --oi-button-lg: 14.5px;
    --oi-heading-1: 22px;
    --oi-heading-2: 18px;
    --oi-heading-3: 14px;
    --oi-link-sm: 12px;
    --oi-link-md: 13px;
    --oi-link-lg: 14px;
  }
`;

export default GlobalStyles;
