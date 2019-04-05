import { Scroller, ScrollerOptions } from './Scroller';

export class EasyScroller {
  private content: HTMLElement;
  private container: HTMLElement;
  private options: ScrollerOptions = {};
  private scroller: Scroller;

  private browserHasPerspectiveProperty = false;
  private browserHasTransformProperty = true;
  private transformProperty: string;
  private eventHandlers: { forElem: HTMLElement | Window | Document; event: string; handler: (e) => void }[] = [];

  constructor(content: HTMLElement, options: ScrollerOptions) {
    if (!content) {
      throw new Error('No Content Element specified!');
    }

    this.content = content;
    this.container = content.parentNode as HTMLElement;

    if (!this.container) {
      throw new Error('No Parent Container for Content! Please wrap Content Element in a Container.');
    }

    this.options = { ...this.options, ...options };
    this.scroller = new Scroller((left, top, zoom) => {
      this.render(left, top, zoom);
    }, options);

    const helperElem = document.createElement('div');
    const vendorPrefix = this.getVendorPrefix();
    // the content element needs a correct transform origin for zooming
    this.content.style[`${vendorPrefix}TransformOrigin`] = 'left top';
    this.transformProperty = `${vendorPrefix}Transform`;
    this.browserHasTransformProperty = helperElem.style[this.transformProperty] !== undefined;

    const perspectiveProperty = `${vendorPrefix}Perspective`;
    this.browserHasPerspectiveProperty = helperElem.style[perspectiveProperty] !== undefined;

    this.bindEvents();
    // reflow for the first time
    this.reflow();
  }

  private getVendorPrefix() {
    const docStyle = document.documentElement.style;

    let engine;
    if ((window as any).opera && Object.prototype.toString.call((window as any).opera) === '[object Opera]') {
      engine = 'presto';
    } else if ('MozAppearance' in docStyle) {
      engine = 'gecko';
    } else if ('WebkitAppearance' in docStyle) {
      engine = 'webkit';
    } else if (typeof (navigator as any).cpuClass === 'string') {
      engine = 'trident';
    }

    const vendorMap = {
      trident: 'ms',
      gecko: 'Moz',
      webkit: 'Webkit',
      presto: 'O',
    };

    return vendorMap[engine];
  }

  private render(left, top, zoom) {
    if (this.browserHasPerspectiveProperty) {
      this.content.style[this.transformProperty] = 'translate3d(' + -left + 'px,' + -top + 'px,0) scale(' + zoom + ')';
    } else if (this.browserHasTransformProperty) {
      this.content.style[this.transformProperty] = 'translate(' + -left + 'px,' + -top + 'px) scale(' + zoom + ')';
    } else {
      this.content.style.marginLeft = left ? -left / zoom + 'px' : '';
      this.content.style.marginTop = top ? -top / zoom + 'px' : '';
      this.content.style.zoom = zoom || '';
    }
  }

  private reflow() {
    // set the right scroller dimensions
    this.scroller.setDimensions(
      this.container.clientWidth,
      this.container.clientHeight,
      this.content.offsetWidth,
      this.content.offsetHeight
    );

    // refresh the position for zooming purposes
    var rect = this.container.getBoundingClientRect();
    this.scroller.setPosition(rect.left + this.container.clientLeft, rect.top + this.container.clientTop);
  }

  private bindEvents() {
    const resizeHandler = () => this.reflow();
    // reflow handling
    this.eventHandlers.push({ event: 'resize', handler: resizeHandler, forElem: window });

    // touch devices bind touch events
    if ('ontouchstart' in window) {
      const touchstartHandler = e => {
        // Don't react if initial down happens on a form element
        if (e.touches[0] && e.touches[0].target && e.touches[0].target.tagName.match(/input|textarea|select/i)) {
          return;
        }
        // reflow since the container may have changed
        this.reflow();
        this.scroller.doTouchStart(e.touches, e.timeStamp);
      };

      const touchmoveHandler = e => {
        e.preventDefault();
        this.scroller.doTouchMove(e.touches, e.timeStamp, e.scale);
      };

      const touchendHandler = e => this.scroller.doTouchEnd(e.timeStamp);
      const touchcancelHandler = e => this.scroller.doTouchEnd(e.timeStamp);

      this.eventHandlers.push(
        { event: 'touchstart', handler: touchstartHandler, forElem: this.container },
        { event: 'touchmove', handler: touchmoveHandler, forElem: this.container },
        { event: 'touchend', handler: touchendHandler, forElem: this.container },
        { event: 'touchcancel', handler: touchcancelHandler, forElem: this.container }
      );
    } else {
      // non-touch bind mouse events
      var mousedown = false;

      const mousedownHandler = e => {
        if (e.target.tagName.match(/input|textarea|select/i)) {
          return;
        }

        this.scroller.doTouchStart(
          [
            {
              pageX: e.pageX,
              pageY: e.pageY,
            },
          ],
          e.timeStamp
        );

        mousedown = true;
        // reflow since the container may have changed
        this.reflow();
        e.preventDefault();
      };

      const mousemoveHandler = e => {
        if (!mousedown) {
          return;
        }

        this.scroller.doTouchMove(
          [
            {
              pageX: e.pageX,
              pageY: e.pageY,
            },
          ],
          e.timeStamp
        );

        mousedown = true;
      };

      const mouseupHandler = e => {
        if (!mousedown) {
          return;
        }

        this.scroller.doTouchEnd(e.timeStamp);

        mousedown = false;
      };

      const mousewheelHandler = e => {
        if (this.options.zooming) {
          this.scroller.doMouseZoom(e.wheelDelta, e.timeStamp, e.pageX, e.pageY);
          e.preventDefault();
        }
      };

      this.eventHandlers.push(
        { event: 'mousedown', handler: mousedownHandler, forElem: this.container },
        { event: 'mousemove', handler: mousemoveHandler, forElem: document },
        { event: 'mouseup', handler: mouseupHandler, forElem: document },
        { event: 'mousewheel', handler: mousewheelHandler, forElem: this.container }
      );
    }

    return this.eventHandlers.forEach(eventHandler => {
      eventHandler.forElem.addEventListener(eventHandler.event, eventHandler.handler, false);
    });
  }

  /**
   * Retrieves Scroller instance.
   */
  public getScroller() {
    return this.scroller;
  }

  /**
   * Call on disposal of EasyScroller to clean up Event Handlers.
   */
  public destroy() {
    return this.eventHandlers.forEach(eventHandler => {
      eventHandler.forElem.removeEventListener(eventHandler.event, eventHandler.handler, false);
    });
  }
}
