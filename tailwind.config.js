module.exports = {
    content: [
        './index.html',
        './src/**/*.{vue,js}',
    ],
    darkMode: 'media',
    theme: {
        extend: {
            gridTemplateRows: {
                'app': 'min-content 1fr',
            },
            zIndex: {
                'modal': '1000',
            },
            backgroundColor: {
                'modal': 'rgba(0, 0, 0, .6)',
            },
        },
    },
    plugins: [],
};