import { Jost, Playfair_Display, Roboto_Mono } from 'next/font/google';

const jost = Jost({
  display: 'swap',
  subsets: ['latin'],
  variable: '--font-family-body',
});

const playfairDisplay = Playfair_Display({
  display: 'swap',
  subsets: ['latin'],
  weight: '400',
  variable: '--font-family-heading',
});

const robotoMono = Roboto_Mono({
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-family-mono',
});

export const fonts = [jost, playfairDisplay, robotoMono];
