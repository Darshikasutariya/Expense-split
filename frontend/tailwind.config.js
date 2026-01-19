/** @type {import('tailwindcss').Config} */
export default {
    content: [
        "./index.html",
        "./src/**/*.{js,ts,jsx,tsx}",
    ],
    theme: {
        extend: {
            colors: {
                'custom-ink-black': '#01161eff',
                'custom-dark-teal': '#124559ff',
                'custom-air-force-blue': '#598392ff',
                'custom-ash-grey': '#aec3b0ff',
                'custom-beige': '#eff6e0ff',
                'custom-success-green': '#4ade80',
                'custom-light-green': '#86efac',
                'custom-sage-green': '#a3b18a',
            },
            fontFamily: {
                'inter': ['Inter', 'sans-serif'],
                'outfit': ['Outfit', 'sans-serif'],
            },
        },
    },
    plugins: [],
}
