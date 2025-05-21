import type { Config } from 'tailwindcss';
import daisyui from 'daisyui';

export default {
  content: ['./src/**/*.{html,js,svelte,ts}'],

  theme: {
    extend: {}
  },

  plugins: [
    daisyui,
  ],
  daisyui: {
    themes: ['forest', 'dark', 'winter', 'autumn', 'light', 'cupcake', 'bumblebee', 'emerald', 'corporate', 'synthwave', 'retro', 'valentine', 'halloween', 'autumn', 'acid']
  },
} satisfies Config;
