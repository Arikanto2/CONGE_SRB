/** @type {import('tailwindcss').Config} */
export default {
    content: [
        "./index.html",
        "./src/**/*.{js,jsx,ts,tsx}",
    ],
    theme: {
        extend: {
        fontFamily: {
        viaoda: ["Viaoda Libre", "serif"],
        },
      },
    },
    plugins: [require("daisyui")],
}
