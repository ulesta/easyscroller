"use strict";
var __assign = (this && this.__assign) || function () {
    __assign = Object.assign || function(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
                t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
};
Object.defineProperty(exports, "__esModule", { value: true });
var Scroller_1 = require("./Scroller");
var EasyScroller = /** @class */ (function () {
    function EasyScroller(content, options) {
        var _this = this;
        this.options = {};
        this.browserHasPerspectiveProperty = false;
        this.browserHasTransformProperty = true;
        this.eventHandlers = [];
        if (!content) {
            throw new Error('No Content Element specified!');
        }
        this.content = content;
        this.container = content.parentNode;
        if (!this.container) {
            throw new Error('No Parent Container for Content! Please wrap Content Element in a Container.');
        }
        this.options = __assign({}, this.options, options);
        this.scroller = new Scroller_1.Scroller(function (left, top, zoom) {
            _this.render(left, top, zoom);
        }, options);
        var helperElem = document.createElement('div');
        var vendorPrefix = this.getVendorPrefix();
        // the content element needs a correct transform origin for zooming
        this.content.style[vendorPrefix + "TransformOrigin"] = 'left top';
        this.transformProperty = vendorPrefix + "Transform";
        this.browserHasTransformProperty = helperElem.style[this.transformProperty] !== undefined;
        var perspectiveProperty = vendorPrefix + "Perspective";
        this.browserHasPerspectiveProperty = helperElem.style[perspectiveProperty] !== undefined;
        this.bindEvents();
        // reflow for the first time
        this.reflow();
    }
    EasyScroller.prototype.getVendorPrefix = function () {
        var docStyle = document.documentElement.style;
        var engine;
        if (window.opera && Object.prototype.toString.call(window.opera) === '[object Opera]') {
            engine = 'presto';
        }
        else if ('MozAppearance' in docStyle) {
            engine = 'gecko';
        }
        else if ('WebkitAppearance' in docStyle) {
            engine = 'webkit';
        }
        else if (typeof navigator.cpuClass === 'string') {
            engine = 'trident';
        }
        var vendorMap = {
            trident: 'ms',
            gecko: 'Moz',
            webkit: 'Webkit',
            presto: 'O',
        };
        return vendorMap[engine];
    };
    EasyScroller.prototype.render = function (left, top, zoom) {
        if (this.browserHasPerspectiveProperty) {
            this.content.style[this.transformProperty] = 'translate3d(' + -left + 'px,' + -top + 'px,0) scale(' + zoom + ')';
        }
        else if (this.browserHasTransformProperty) {
            this.content.style[this.transformProperty] = 'translate(' + -left + 'px,' + -top + 'px) scale(' + zoom + ')';
        }
        else {
            this.content.style.marginLeft = left ? -left / zoom + 'px' : '';
            this.content.style.marginTop = top ? -top / zoom + 'px' : '';
            this.content.style.zoom = zoom || '';
        }
    };
    EasyScroller.prototype.reflow = function () {
        // set the right scroller dimensions
        this.scroller.setDimensions(this.container.clientWidth, this.container.clientHeight, this.content.offsetWidth, this.content.offsetHeight);
        // refresh the position for zooming purposes
        var rect = this.container.getBoundingClientRect();
        this.scroller.setPosition(rect.left + this.container.clientLeft, rect.top + this.container.clientTop);
    };
    EasyScroller.prototype.bindEvents = function () {
        var _this = this;
        var resizeHandler = function () { return _this.reflow(); };
        // reflow handling
        this.eventHandlers.push({ event: 'resize', handler: resizeHandler, forElem: window });
        // touch devices bind touch events
        if ('ontouchstart' in window) {
            var touchstartHandler = function (e) {
                // Don't react if initial down happens on a form element
                if (e.touches[0] && e.touches[0].target && e.touches[0].target.tagName.match(/input|textarea|select/i)) {
                    return;
                }
                // reflow since the container may have changed
                _this.reflow();
                _this.scroller.doTouchStart(e.touches, e.timeStamp);
            };
            var touchmoveHandler = function (e) {
                e.preventDefault();
                _this.scroller.doTouchMove(e.touches, e.timeStamp, e.scale);
            };
            var touchendHandler = function (e) { return _this.scroller.doTouchEnd(e.timeStamp); };
            var touchcancelHandler = function (e) { return _this.scroller.doTouchEnd(e.timeStamp); };
            this.eventHandlers.push({ event: 'touchstart', handler: touchstartHandler, forElem: this.container }, { event: 'touchmove', handler: touchmoveHandler, forElem: this.container }, { event: 'touchend', handler: touchendHandler, forElem: this.container }, { event: 'touchcancel', handler: touchcancelHandler, forElem: this.container });
        }
        else {
            // non-touch bind mouse events
            var mousedown = false;
            var mousedownHandler = function (e) {
                if (e.target.tagName.match(/input|textarea|select/i)) {
                    return;
                }
                _this.scroller.doTouchStart([
                    {
                        pageX: e.pageX,
                        pageY: e.pageY,
                    },
                ], e.timeStamp);
                mousedown = true;
                // reflow since the container may have changed
                _this.reflow();
                e.preventDefault();
            };
            var mousemoveHandler = function (e) {
                if (!mousedown) {
                    return;
                }
                _this.scroller.doTouchMove([
                    {
                        pageX: e.pageX,
                        pageY: e.pageY,
                    },
                ], e.timeStamp);
                mousedown = true;
            };
            var mouseupHandler = function (e) {
                if (!mousedown) {
                    return;
                }
                _this.scroller.doTouchEnd(e.timeStamp);
                mousedown = false;
            };
            var mousewheelHandler = function (e) {
                if (_this.options.zooming) {
                    _this.scroller.doMouseZoom(e.wheelDelta, e.timeStamp, e.pageX, e.pageY);
                    e.preventDefault();
                }
            };
            this.eventHandlers.push({ event: 'mousedown', handler: mousedownHandler, forElem: this.container }, { event: 'mousemove', handler: mousemoveHandler, forElem: document }, { event: 'mouseup', handler: mouseupHandler, forElem: document }, { event: 'mousewheel', handler: mousewheelHandler, forElem: this.container });
        }
        return this.eventHandlers.forEach(function (eventHandler) {
            eventHandler.forElem.addEventListener(eventHandler.event, eventHandler.handler, false);
        });
    };
    /**
     * Retrieves Scroller instance.
     */
    EasyScroller.prototype.getScroller = function () {
        return this.scroller;
    };
    /**
     * Call on disposal of EasyScroller to clean up Event Handlers.
     */
    EasyScroller.prototype.destroy = function () {
        return this.eventHandlers.forEach(function (eventHandler) {
            eventHandler.forElem.removeEventListener(eventHandler.event, eventHandler.handler, false);
        });
    };
    return EasyScroller;
}());
exports.EasyScroller = EasyScroller;
