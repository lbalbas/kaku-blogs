import { type Config } from "tailwindcss";

export default {
  content: ["./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      fontFamily: {
      'display': 'Quicksand, sans-serif',
      'body': 'Source Sans 3, sans-serif',
    }
    },
  },
  plugins: [],
} satisfies Config;
