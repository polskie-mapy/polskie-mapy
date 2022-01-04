import {round} from "lodash";

const ytUriRegex = new RegExp(
    /^(?:https?:\/\/)?(?:\w+\.)?(?:youtube\.com\/(?:[^/]+\/.+\/|(?:v|e(?:mbed)?)\/|.*[?&]v=)|youtu\.be\/)([^"&?/\s]{11})$/,
    'i',
);

const LINK_TYPE_COLOR = {
    ['yt']: '#ff0000',
    ['ig']: '#405de6',
    ['map']: '#0b4a6e'
};
const LINK_TYPE_ICONS = {
    ['yt']: 'fa-brands fa-youtube',
    ['ig']: 'fa-brands fa-instagram',
    ['map']: 'fa-solid fa-map-location-dot'
};

export const COLOR_SCHEMES = [
    'system',
    'dark',
    'light'
];

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

function linkTypeColorStyle(value) {
    return `--pm-point-details-link-color: ${linkTypeColor(value)}`
}

function coord2Dms(coord, winds) {
    if (typeof coord !== 'number') throw TypeError('number expected');

    const absDegrees = Math.abs(coord);
    const floorAbsDegrees = Math.floor(coord);
    const sign = Math.sign(coord);
    const degrees = sign * floorAbsDegrees;
    const minutes = Math.floor(60 * (absDegrees - floorAbsDegrees));
    const seconds = 3600 * (absDegrees - floorAbsDegrees) - 60 * minutes;
    const wind = sign >= 0 ? winds[0] : winds[1];

    return `${degrees}°${round(minutes, 3)}'${round(seconds, 3)}"${wind}`;
}

function coords2Dms(coords) {
    const winds = [['E', 'W'], ['N', 'S']];

    return coords.map(coord => coord2Dms(coord, winds.pop())).join(' ');
}

function coords2GmapsPin(coords) {
    const loc = coords.join(',');
    const placePin = encodeURIComponent(coords2Dms(coords));
    const zoom = 17;

    return `https://www.google.com/maps/place/${placePin}/@${loc},${zoom}z`;
}

export default {
    install(Vue) {
        Vue.H = {
            ytId,
            linkTypeColor,
            linkTypeIcon,
            coords2Dms,
            coords2GmapsPin
        };

        Vue.prototype.$H = {
            ytId,
            linkTypeColor,
            linkTypeIcon,
            coords2Dms,
            coords2GmapsPin
        };

        Vue.mixin({
            filters: {
                linkTypeColorStyle,
                linkTypeIcon
            }
        })
    },
};