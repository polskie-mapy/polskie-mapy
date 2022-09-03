export default {
    extract: {
        include: [
            './index.html',
            './src/**/*.{vue,js}',
        ]
    },
    darkMode: 'class',
    theme: {
        extend: {
            colors: {
                'app': '#fb923c',
            },
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
            backgroundImage: {
                'placeholder': 'url("placeholder.svg")'
            }
        },
    },
    plugins: [],
};