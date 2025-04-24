/** @type {import('tailwindcss').Config} */
module.exports = {
    darkMode: "class", // required since you're using `.dark` class
    content: [
      "./app/**/*.{js,ts,jsx,tsx}",
      "./components/**/*.{js,ts,jsx,tsx}",
    ],
    theme: {
      extend: {},
    },
    plugins: [],
  };
  