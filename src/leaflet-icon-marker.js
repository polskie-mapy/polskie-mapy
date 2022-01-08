import {
    Canvas as LeafletCanvas, CircleMarker as LeafletCircleMarker, DomEvent
} from "leaflet";

import {LCircleMarker} from "vue2-leaflet";
import {findRealParent, optionsMerger, propsBinder} from "vue2-leaflet/src/utils/utils";
import {findColorInvert} from "@/color-helpers";

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

        this._fillStroke(ctx, layer);

        ctx.shadowColor = 'transparent';

        if (s !== 1) {
            ctx.save();
            ctx.scale(1, s);
        }

        const iconWidth = layer.options.iconData[0];
        const iconHeight = layer.options.iconData[1];
        // first, center by marker radius
        // then remove offset provided by icon itself (iconHeight != iconWidth)
        const sx = r / 2 - (iconHeight - iconWidth) * 0.015625;
        // since all icons have same height, no need to adjust that
        const sy = r / 2;
        const path = new Path2D(layer.options.iconData[4]);
        const iconContainer = new Path2D();
        iconContainer.addPath(
            path,
            new DOMMatrix(
                /* a      ,       b,     c,       d,           e,           f */
                /* scale x, skew x, skew y, scale y, translate x, translate y */
                [
                    0.03125, 0, 0, 0.03125, p.x - sx, p.y - sy
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

const IconMarker = LeafletCircleMarker.extend({
    options: {
        iconData: null,
        hovered: false,
    },
    _updatePath() {
        this._renderer._updateIconMarker(this);
    }
})

export default {
    name: 'LIconMarker',
    extends: LCircleMarker,
    props: {
        iconData: {
            required: true,
            type: Array,
        },
    },
    mounted() {
        const options = optionsMerger(this.circleOptions, this);
        this.mapObject = new IconMarker(this.latLng, {
            ...options,
            iconData: this.iconData
        });
        DomEvent.on(this.mapObject, this.$listeners);
        propsBinder(this, this.mapObject, this.$options.props);
        this.ready = true;
        this.parentContainer = findRealParent(this.$parent);
        this.parentContainer.addLayer(this, !this.visible);
        this.$nextTick(() => {
            /**
             * Triggers when the component is ready
             * @type {object}
             * @property {object} mapObject - reference to leaflet map object
             */
            this.$emit('ready', this.mapObject);
        });
    }
}