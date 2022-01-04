const {XMLParser} = require("fast-xml-parser");
const uniq = require('lodash/uniq')
const fs = require('fs');

const data = fs.readFileSync("map.kml");

const parser = new XMLParser({
    attributeNamePrefix : "@",
    ignoreAttributes: false,
});
const jObj = parser.parse(data);
let id = 0;

function parseDescription(description) {
    if (!description) {
        return {
            ytLinks: [],
            igNicks: [],
            genericUrls: [],
            assumedCoords: false,
        }
    }

    const ytLinks = uniq(description.match(/http(?:s?):\/\/(?:www\.)?youtu(?:be\.com\/watch\?v=|\.be\/)([\w\-\_]*)(&(amp;)?‌​[\w\?‌​=]*)?/gi));
    const igNicks = (() => {
        const it = [...description.matchAll(/instagramu?:?\s@?(\w+)/gi)];

        return it.map(x => x[1]);
    })();
    const genericUrls = (() => {
        const groups = [...description.matchAll(/([-a-zA-Z0-9@:%._\+~#=]{1,256})\.[a-zA-Z0-9()]{1,6}\b([-a-zA-Z0-9()@:%_\+.~#?&//=]*)/gi)];

        return groups.filter(x => {
            return x[0].indexOf('youtube.com') === -1 && x[0].indexOf('googleusercontent.com') === -1;
        })
            .map(x => x[0]);
    })();
    const assumedCoords = (() => {
        return description.indexOf('lokalizacja niedokładna') !== -1
            || description.indexOf('lokacja niedokładna') !== -1
            || description.indexOf('lokacja prawdopodobna') !== -1
            || description.indexOf('lokacja niedokładna') !== -1
            || description.indexOf('lokalizacja dokładna w toku') !== -1
            || description.indexOf('lokalizacja nieznana') !== -1
    })();

    return {
        ytLinks,
        igNicks,
        genericUrls,
        assumedCoords
    }
}

function getPinColor(styleUrl) {
    styleUrl = styleUrl.substr(1)

    if (styleUrl.indexOf('labelson') === -1) {
        styleUrl = styleUrl + '-normal';
    }

    console.log(styleUrl, id);
    return '#' + jObj.kml.Document.Style.find(x => x['@id'] === styleUrl).IconStyle.color.substr(2).split('').reverse().join('');
}

// return console.log(jObj.kml.Document.Style[0])

const out = jObj.kml.Document.Folder.flatMap(folder => {
    return folder.Placemark.map(mark => {
        const desc = parseDescription(mark.description);

        return {
            id: ++id,
            title: mark.name,
            excerpt: mark.description,
            coords: mark.Point.coordinates.split(',').slice(0, 2).reverse().map(x => parseFloat(x)),
            assumedCoords: desc.assumedCoords,
            submitters: [
                ...desc.igNicks.map(y => ({
                    type: 'ig',
                    user: y
                })),
            ],
            links: [
                ...desc.ytLinks.map(y => ({
                    type: "yt",
                    url: y
                })),
                ...desc.genericUrls.map(y => ({
                    type: "link",
                    url: y
                }))
            ],
            icon: 'fa-solid:fa-question',
            pinColor: getPinColor(mark.styleUrl),
            tags: [],
            group: folder.name,
            createdAt: "2022-01-01T00:00:00.000Z",
            recordedAt: null,
        }
    })
});

fs.writeFileSync('scraped.json', JSON.stringify(out, null, 4));
