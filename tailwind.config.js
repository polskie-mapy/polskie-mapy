const colors = require('tailwindcss/colors');

module.exports = {
    content: [
        './index.html',
        './src/**/*.{vue,js}',
    ],
    darkMode: 'media',
    theme: {
        colors: {
            'app': '#fb923c',
            ...colors
        },
        extend: {
            gridTemplateRows: {
                'app': 'min-content 1fr',
            },
            zIndex: {
                'modal': '1000',
            },
            backgroundColor: {
                'modal': 'rgba(0, 0, 0, .6)',
                'pin-var': 'var(--pm-pin-color, white)',
                'point-details-link-var': 'var(--pm-point-details-link-color, --tm-color-app)',
            },
        },
    },
    plugins: [],
};