import { type Config } from "tailwindcss";

export default {
  content: ["./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      fontFamily: {
      'display': 'var(--font-quicksand)',
      'body': 'var(--font-sourcesans3)',
    }
    },
  },
  plugins: [],
} satisfies Config;
