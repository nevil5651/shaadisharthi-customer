/** @type {import('tailwindcss').Config} */
const config = {
  content: [

    './src/app/(@public)/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/(@protected)/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    
  ],
  darkMode: "class",
  theme: {
    extend: {},
  },
  plugins: [],
};

export default config;
