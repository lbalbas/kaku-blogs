import { type Config } from "tailwindcss";

export default {
  content: ["./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      colors: {
        mcream: "#F0F7EE", 
        isabel: "#EDE6E3", 
        vanilla: "#e4d6a7", 
        hgreen: "#618985", 
        uviolet: "#525174",
      }
    },
  },
  plugins: [],
} satisfies Config;
