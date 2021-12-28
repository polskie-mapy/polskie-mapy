const ytUriRegex = new RegExp(
    /^(?:https?:\/\/)?(?:\w+\.)?(?:youtube\.com\/(?:[^/]+\/.+\/|(?:v|e(?:mbed)?)\/|.*[?&]v=)|youtu\.be\/)([^"&?/\s]{11})$/,
    'i',
);

const LINK_TYPE_COLOR = {
    ['yt']: '#ff0000',
    ['ig']: '#405de6',
};
const LINK_TYPE_ICONS = {
    ['yt']: 'fa-brands fa-youtube',
    ['ig']: 'fa-brands fa-instagram',
};

function ytId(link) {
    return ytUriRegex.exec(link)[1];
}

function linkTypeColor(type) {
    return LINK_TYPE_COLOR[type] || linkTypeColorDefault();
}

function linkTypeIcon(type) {
    return LINK_TYPE_ICONS[type] || linkTypeIconDefault();
}

function linkTypeColorDefault() {
    return '#f2741c';
}

function linkTypeIconDefault() {
    return 'fa-solid fa-link';
}

export default {
    install(Vue) {
        Vue.H = {
            ytId,
            linkTypeColor,
            linkTypeIcon,
        };

        Vue.prototype.$H = {
            ytId,
            linkTypeColor,
            linkTypeIcon,
        };
    },
};