/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: "media",
  content: [
    "./components/**/*.{html,js,ts,jsx,tsx}",
    "./pages/**/*.{html,js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      spacing: {
        "4/5": "80%",
        "2/3": "66.666667%",
        "1/2": "50%",
        "1/3": "33.333333%",
        "1/4": "25%",
        "1/5": "20%",
      },
      colors: {
        white: "#f7f7f7",
        black: "#121212",
        gray: "#666",
        "light-gray": "#e0e0e0",
        "dark-gray": "#343434",
      },
    },
    plugins: [],
  },
};
