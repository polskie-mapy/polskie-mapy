import {round, trimStart} from "lodash";
import {DateTime} from "luxon";
import {findIconDefinition as faFindIconDefinition} from "@fortawesome/fontawesome-svg-core";

const ytUriRegex = new RegExp(
    /^(?:https?:\/\/)?(?:\w+\.)?(?:youtube\.com\/(?:[^/]+\/.+\/|(?:v|e(?:mbed)?)\/|.*[?&]v=)|youtu\.be\/)([^"&?/\s]{11})$/,
    'i',
);

const LINK_TYPE_COLOR = {
    ['yt']: '#d70000',
    ['ig']: '#405de6',
    ['map']: '#0b4a6e',
    ['news']: '#75716f'
};
const LINK_TYPE_ICONS = {
    ['yt']: 'fa-brands fa-youtube',
    ['ig']: 'fa-brands fa-instagram',
    ['map']: 'fa-solid fa-map-location-dot',
    ['news']: 'fa-regular fa-newspaper',
    ['link']: linkTypeIconDefault(),
};
const LINK_TYPE_URL = {
    ['ig']: 'https://www.instagram.com/:id/',
    ['wykop']: 'https://www.wykop.pl/ludzie/:id/',
};

export const COLOR_SCHEMES = [
    'system',
    'dark',
    'light'
];

const DATEDIFF_PRIORITIES = [
    'years', 'months', 'weeks', 'days'
];

const DATEDIFF_LANG = {
    years: ['rok temu', ':v lata temu', 'dawno temu'],
    months: ['miesiąc temu', ':v m-ce temu', ':v m-cy temu'],
    weeks: ['tydzień temu', ':v tygodnie temu', ':v tygodni temu'],
    days: ['dzień temu', ':v dni temu', ':v dni temu'],
    recently: ['niedawno']
};

const LINK_TYPE_TOOLTIPS = {
    ['yt']: 'Zobacz nagranie na YT',
    ['map']: 'Zobacz miejsce na Google Maps',
    ['news']: 'Zobacz artykuł dotyczący tego nagrania',
}

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

function ytThumbUrl(ytUrl) {
    return `https://img.youtube.com/vi/${ytId(ytUrl)}/hqdefault.jpg`
}

function linkTypeUrl(type, id) {
    const template = LINK_TYPE_URL[type];

    return template ? template.replace(':id', id) : null;

}

function langChoice(langArr, value) {
    if (value === 1) {
        return langArr[0].replace(':v', value);
    } else if (value >= 5) {
        return langArr[2].replace(':v', value);
    }

    return langArr[1].replace(':v', value);
}

function dateTimeDiffHumans(date) {
    const dur = DateTime.now().diff(date, DATEDIFF_PRIORITIES).toObject();

    for (const k of DATEDIFF_PRIORITIES) {
        if (dur[k] > 0) {
            return langChoice(DATEDIFF_LANG[k], Math.floor(dur[k]));
        }
    }

    // if too small to show difference (<day), show generic recently title
    return langChoice(DATEDIFF_LANG.recently, 1);
}

function prettyDate(date) {
    if (typeof date === 'string') {
        date = DateTime.fromISO(date);
    }

    return date.toLocaleString(DateTime.DATETIME_MED);
}

function translateIconCode(code) {
    if (code.startsWith('fa-solid:') || code.startsWith('fa-regular:')) {
        const icon = code.split(':');

        return {
            prefix: icon[0],
            iconName: icon[1],
        }
    }

    return {
        prefix: 'fa-solid',
        iconName: 'marker'
    };
}

function findIconDefinition(code) {
    const tr = translateIconCode(code);
    const iconLookup = {
        prefix: `fa${tr.prefix[3]}`,
        iconName: tr.iconName.substr(3)
    }

    return faFindIconDefinition(iconLookup);
}

function linkTypeDefaultTooltip(type) {
    return LINK_TYPE_TOOLTIPS[type];
}

function iconCodeToIconName(code) {
    const {iconName, prefix} = translateIconCode(code);

    return `${prefix} ${iconName}`;
}

export function rsrcUrl(url) {
    return `${process.env.VUE_APP_DATA_BASE_URL}/${trimStart(url, '/')}${process.env.VUE_APP_DATA_URL_SUFFIX}`;
}

export default {
    install(Vue) {
        Vue.prototype.$H = {
            ytId,
            linkTypeColor,
            linkTypeIcon,
            coords2Dms,
            coords2GmapsPin,
            ytThumbUrl,
            linkTypeUrl,
            dateTimeDiffHumans,
            findIconDefinition,
            linkTypeDefaultTooltip
        };

        Vue.mixin({
            filters: {
                linkTypeColorStyle,
                linkTypeIcon,
                prettyDate,
                iconCodeToIconName
            }
        })
    },
};