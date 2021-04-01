module.exports = {
  purge: ["./pages/**/*.{js,ts,jsx,tsx}", "./components/**/*.{js,ts,jsx,tsx}"],
  darkMode: "media", // or 'media' or 'class'
  theme: {
    extend: {
      spacing: {
        clock: "33.82%",
        digit: "19.5%"
      },
    },
  },
  variants: {
    extend: {},
  },
  plugins: [],
};
