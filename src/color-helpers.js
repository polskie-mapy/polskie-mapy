// ported from 'bulma' - https://github.com/jgthms/bulma/blob/master/sass/utilities/functions.sass

export function findColorInvert(color) {
    const colorHex = normalizeColorFormat(color);

    if (colorLuminance(colorHex) > 0.55) {
        return 'rgba(0, 0, 0, 0.7)';
    }

    return '#ffffff';
}

function normalizeColorFormat(color) {
    if (color[0] === '#') {
        // Lengths of certain color hex formats:
        // rgb = 3 (4 with starting hash)
        // rgba = 4 (5 with starting hash)
        // rrggbb = 6 (7 with starting hash)
        // rrggbbaa = 8 (9 with starting hash)
        if ([4,5,7,9].includes(color.length)) {
            return handleColorHexFormat(color);
        }

        throw new TypeError(`cannot infer color hex format of "${color}"`);
    }

    if (color.startsWith('rgb') || color.startsWith('rgba')) {
        // todo
        throw new TypeError(`cannot infer color hex format of "${color}"`);
    }

    throw new TypeError(`cannot infer color hex format of "${color}"`);
}

function handleColorHexFormat(hex) {
    if (hex[0] === '#') {
        hex = hex.substr(1);
    }

    // if expressed in short hex notation (#rgb or #rgba), expand to full hex notation (#rrggbb or #rrggbbaa)
    if ([3,4].includes(hex.length)) {
        hex = hex.split('').slice(0, 3).map(v => `${v}${v}`).join('');
    }

    return hex.split('').slice(0, 6).map(v => parseInt(v, 16));
}

function colorLuminance(colorHex) {
    const MULTIPLIERS = [.0722, .7152, .2126]; // some multipliers from bulma

    return colorHex.map(val => {
        val = val / 255; // 255 == FF in hex; max value

        if (val < 0.03928) { // some magic constant from bulma
            val = val / 12.92; // another one (:
        } else {
            val = (val + 0.055) / 1.055; // ...
            val = val ** 2;
        }

        return MULTIPLIERS.pop() * val;
    });
}