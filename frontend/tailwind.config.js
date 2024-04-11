/** @type {import('tailwindcss').Config} */
import animations from '@midudev/tailwind-animations'
const flowbite = require('flowbite-react/tailwind')
export default {
    content: [
        './index.html',
        './src/**/*.{js,ts,jsx,tsx}',
        flowbite.content()
    ],
    theme: {
        extend: {
            gridTemplateColumns: {
                // Simple 16 column grid
                '15': 'repeat(15, minmax(0, 1fr))',
            }        
        }
    },
    plugins: [animations,
        flowbite.plugin()]
}
