/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",  
    "./src/**/*.{js,ts,jsx,tsx}"  // ✅ Make sure Tailwind scans your project files
  ],
  theme: {
    extend: {},
  },
  plugins: [],
};
