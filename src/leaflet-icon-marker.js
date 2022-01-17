import {
    Canvas as LeafletCanvas, CircleMarker as LeafletCircleMarker, setOptions
} from "leaflet";

import {findColorInvert} from "@/color-helpers";
import {toLatLng} from "leaflet/src/geo/LatLng";

LeafletCanvas.include({
    _updateIconMarker: function (layer) {
        if (!this._drawing || layer._empty()) {
            return;
        }

        const p = layer._point;
        const ctx = this._ctx;
        const r = Math.max(Math.round(layer._radius), 1);
        const s = (Math.max(Math.round(layer._radiusY), 1) || r) / r;

        if (s !== 1) {
            ctx.save();
            ctx.scale(1, s);
        }

        ctx.beginPath();
        ctx.arc(p.x, p.y / s, r, 0, Math.PI * 2, false);
        ctx.closePath();

        if (s !== 1) {
            ctx.restore();
        }

        // tailiwnd's default shadow - https://tailwindcss.com/docs/box-shadow
        ctx.shadowColor = 'rgba(0, 0, 0, 0.1)';
        ctx.shadowBlur = 3;
        ctx.shadowOffsetX = 0;
        ctx.shadowOffsetY = 1;

        // if (layer._hover) {
        //     const oldColor = layer.options.color;
        //     layer.options.color = layer.options.hoverColor;
        //     this._fillStroke(ctx, layer);
        //     layer.options.color = oldColor;
        // } else {
        this._fillStroke(ctx, layer);
        // }

        ctx.shadowColor = 'transparent';

        if (s !== 1) {
            ctx.save();
            ctx.scale(1, s);
        }

        const iconWidth = layer._iconData[0];
        const iconHeight = layer._iconData[1];
        // first, center by marker radius
        // then remove offset provided by icon itself (iconHeight != iconWidth) and multiply by half of icon size (1/64)
        const sx = r / 2 - (iconHeight - iconWidth) * 0.015625;
        // since all icons have same height, no need to adjust that
        const sy = r / 2;
        const iconPath = new Path2D(layer._iconData[4]);
        // Need to create separate path2d to perform matrix transformation
        const iconContainer = new Path2D();
        // Adding icon path to container path
        // while applying transformation
        // (scaling icon down to 16px (32:1; 512/32 = 16) and translating position)
        iconContainer.addPath(
            iconPath,
            new DOMMatrix(
                [
                    0.03125,    // scale x      A
                    0,          // skew y       B
                    0,          // skew y       C
                    0.03125,    // scale y      D
                    p.x - sx,   // translate x  E
                    p.y - sy    // translate y  F
                ]
            )
        )
        ctx.fillStyle = findColorInvert(layer.options.fillColor);
        ctx.fill(iconContainer);

        if (s !== 1) {
            ctx.restore();
        }
    },
});

export const IconMarker = LeafletCircleMarker.extend({
    options: {
        iconData: null,
    },
    initialize: function (latlng, iconData, options) {
        setOptions(this, options);
        this._latlng = toLatLng(latlng);
        this._radius = this.options.radius;
        this._iconData = iconData;
        this._hover = false;
    },
    _updatePath: function() {
        this._renderer._updateIconMarker(this);
    }
});