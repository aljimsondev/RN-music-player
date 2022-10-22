import {DefaultTheme} from '@react-navigation/native';

/**
 * Color cofiguration
 * ```typescript
 * const CustomTheme = {
 * ...DefaultTheme,
 * colors:{ //overide default colors here
 * primary?:"color value",
 * background?:"color value",
 * card?:"color value",
 * text?:"color value",
 * border?:"color value",
 * notification?:"color value"
 * }
 *
 * }
 * ```
 */

export const CustomTheme = {
  dark: true,
  colors: {
    primary: '#302832',
    background: '#3D353F',
    card: '#F5F3F3',
    text: '#F2F2F2',
    border: '#D4D3D3',
    notification: '#1EC560',
  },
};

export const LightTheme = {
  dark: false,
  colors: {
    primary: '#302832',
    background: '#3D353F',
    card: '#F5F3F3',
    text: '#F2F2F2',
    border: '#D4D3D3',
    notification: '#1EC560',
  },
};
