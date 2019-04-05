export interface ScrollerOptions {
    /** Enable scrolling on x-axis */
    scrollingX?: boolean;
    /** Enable scrolling on y-axis */
    scrollingY?: boolean;
    /** Enable animations for deceleration, snap back, zooming and scrolling */
    animating?: boolean;
    /** duration for animations triggered by scrollTo/zoomTo */
    animationDuration?: number;
    /** Enable bouncing (content can be slowly moved outside and jumps back after releasing) */
    bouncing?: boolean;
    /** Enable locking to the main axis if user moves only slightly on one of them at start */
    locking?: boolean;
    /** Enable pagination mode (switching between full page content panes) */
    paging?: boolean;
    /** Enable snapping of content to a configured pixel grid */
    snapping?: boolean;
    /** Enable zooming of content via API, fingers and mouse wheel */
    zooming?: boolean;
    /** Initial zoom level, must be >= minZoom and <= maxZoom */
    zoomLevel?: number;
    /** Minimum zoom level */
    minZoom?: number;
    /** Maximum zoom level */
    maxZoom?: number;
    /** Multiply or decrease scrolling speed **/
    speedMultiplier?: number;
    /** Callback that is fired on the later of touch end or deceleration end,
      provided that another scrolling action has not begun. Used to know
      when to fade out a scrollbar. */
    scrollingComplete?: () => void;
    /** This configures the amount of change applied to deceleration when reaching boundaries  **/
    penetrationDeceleration?: number;
    /** This configures the amount of change applied to acceleration when reaching boundaries  **/
    penetrationAcceleration?: number;
}
/**
 * A pure logic 'component' for 'virtual' scrolling/zooming.
 */
export declare class Scroller {
    /** {Boolean} Whether only a single finger is used in touch handling */
    __isSingleTouch: boolean;
    /** {Boolean} Whether a touch event sequence is in progress */
    __isTracking: boolean;
    /** {Boolean} Whether a deceleration animation went to completion. */
    __didDecelerationComplete: boolean;
    /**
     * {Boolean} Whether a gesture zoom/rotate event is in progress. Activates when
     * a gesturestart event happens. This has higher priority than dragging.
     */
    __isGesturing: boolean;
    /**
     * {Boolean} Whether the user has moved by such a distance that we have enabled
     * dragging mode. Hint: It's only enabled after some pixels of movement to
     * not interrupt with clicks etc.
     */
    __isDragging: boolean;
    /**
     * {Boolean} Not touching and dragging anymore, and smoothly animating the
     * touch sequence using deceleration.
     */
    __isDecelerating: boolean | number;
    /**
     * {Boolean} Smoothly animating the currently configured change
     */
    __isAnimating: boolean | number;
    __interruptedAnimation: boolean;
    __initialTouchLeft: any;
    __initialTouchTop: any;
    __initialTouches: any;
    __lastScale: number;
    __enableScrollX: boolean;
    __enableScrollY: boolean;
    /** {Integer} Available outer left position (from document perspective) */
    __clientLeft: number;
    /** {Integer} Available outer top position (from document perspective) */
    __clientTop: number;
    /** {Integer} Available outer width */
    __clientWidth: number;
    /** {Integer} Available outer height */
    __clientHeight: number;
    /** {Integer} Outer width of content */
    __contentWidth: number;
    /** {Integer} Outer height of content */
    __contentHeight: number;
    /** {Integer} Snapping width for content */
    __snapWidth: number;
    /** {Integer} Snapping height for content */
    __snapHeight: number;
    /** {Integer} Height to assign to refresh area */
    __refreshHeight: any;
    /** {Boolean} Whether the refresh process is enabled when the event is released now */
    __refreshActive: boolean;
    /** {Function} Callback to execute on activation. This is for signalling the user about a refresh is about to happen when he release */
    __refreshActivate: any;
    /** {Function} Callback to execute on deactivation. This is for signalling the user about the refresh being cancelled */
    __refreshDeactivate: any;
    /** {Function} Callback to execute to start the actual refresh. Call {@link #refreshFinish} when done */
    __refreshStart: any;
    /** {Number} Zoom level */
    __zoomLevel: number;
    __zoomLevelStart: number;
    /** {Number} Scroll position on x-axis */
    __scrollLeft: number;
    /** {Number} Scroll position on y-axis */
    __scrollTop: number;
    /** {Integer} Maximum allowed scroll position on x-axis */
    __maxScrollLeft: number;
    /** {Integer} Maximum allowed scroll position on y-axis */
    __maxScrollTop: number;
    __scheduledLeft: number;
    __scheduledTop: number;
    __scheduledZoom: number;
    /** {Number} Left position of finger at start */
    __lastTouchLeft: any;
    /** {Number} Top position of finger at start */
    __lastTouchTop: any;
    /** {Date} Timestamp of last move of finger. Used to limit tracking range for deceleration speed. */
    __lastTouchMove: any;
    /** {Array} List of positions, uses three indexes for each state: left, top, timestamp */
    __positions: any;
    /** {Integer} Minimum left scroll position during deceleration */
    __minDecelerationScrollLeft: any;
    /** {Integer} Minimum top scroll position during deceleration */
    __minDecelerationScrollTop: any;
    /** {Integer} Maximum left scroll position during deceleration */
    __maxDecelerationScrollLeft: any;
    /** {Integer} Maximum top scroll position during deceleration */
    __maxDecelerationScrollTop: any;
    /** {Number} Current factor to modify horizontal scroll position with on every step */
    __decelerationVelocityX: any;
    /** {Number} Current factor to modify vertical scroll position with on every step */
    __decelerationVelocityY: any;
    __callback: (scrollLeft: number, scrollTop: number, zoomLevel: number) => void;
    __zoomComplete: () => void;
    options: ScrollerOptions;
    constructor(callback: (scrollLeft: number, scrollTop: number, zoomLevel: number) => void, options: Partial<ScrollerOptions>);
    /**
     * @param pos {Number} position between 0 (start of effect) and 1 (end of effect)
     **/
    private easeOutCubic;
    /**
     * @param pos {Number} position between 0 (start of effect) and 1 (end of effect)
     **/
    private easeInOutCubic;
    /**
     * Configures the dimensions of the client (outer) and content (inner) elements.
     * Requires the available space for the outer element and the outer size of the inner element.
     * All values which are falsy (null or zero etc.) are ignored and the old value is kept.
     *
     * @param clientWidth {Integer ? null} Inner width of outer element
     * @param clientHeight {Integer ? null} Inner height of outer element
     * @param contentWidth {Integer ? null} Outer width of inner element
     * @param contentHeight {Integer ? null} Outer height of inner element
     */
    setDimensions(clientWidth: number, clientHeight: number, contentWidth: number, contentHeight: number): void;
    /**
     * Sets the client coordinates in relation to the document.
     *
     * @param left {Integer ? 0} Left position of outer element
     * @param top {Integer ? 0} Top position of outer element
     */
    setPosition(left: number, top: number): void;
    /**
     * Configures the snapping (when snapping is active)
     *
     * @param width {Integer} Snapping width
     * @param height {Integer} Snapping height
     */
    setSnapSize(width: number, height: number): void;
    /**
     * Activates pull-to-refresh. A special zone on the top of the list to start a list refresh whenever
     * the user event is released during visibility of this zone. This was introduced by some apps on iOS like
     * the official Twitter client.
     *
     * @param height {Integer} Height of pull-to-refresh zone on top of rendered list
     * @param activateCallback {Function} Callback to execute on activation. This is for signalling the user about a refresh is about to happen when he release.
     * @param deactivateCallback {Function} Callback to execute on deactivation. This is for signalling the user about the refresh being cancelled.
     * @param startCallback {Function} Callback to execute to start the real async refresh action. Call {@link #finishPullToRefresh} after finish of refresh.
     */
    activatePullToRefresh(height: number, activateCallback: any, deactivateCallback: any, startCallback: any): void;
    /**
     * Starts pull-to-refresh manually.
     */
    triggerPullToRefresh(): void;
    /**
     * Signalizes that pull-to-refresh is finished.
     */
    finishPullToRefresh(): void;
    /**
     * Returns the scroll position and zooming values
     *
     * @return {Map} `left` and `top` scroll position and `zoom` level
     */
    getValues(): {
        left: number;
        top: number;
        zoom: number;
    };
    /**
     * Returns the maximum scroll values
     *
     * @return {Map} `left` and `top` maximum scroll values
     */
    getScrollMax(): {
        left: number;
        top: number;
    };
    /**
     * Zooms to the given level. Supports optional animation. Zooms
     * the center when no coordinates are given.
     *
     * @param level {Number} Level to zoom to
     * @param animate {Boolean ? false} Whether to use animation
     * @param originLeft {Number ? null} Zoom in at given left coordinate
     * @param originTop {Number ? null} Zoom in at given top coordinate
     * @param callback {Function ? null} A callback that gets fired when the zoom is complete.
     */
    zoomTo(level: number, animate: boolean, originLeft: number, originTop: number, callback?: any): void;
    /**
     * Zooms the content by the given factor.
     *
     * @param factor {Number} Zoom by given factor
     * @param animate {Boolean ? false} Whether to use animation
     * @param originLeft {Number ? 0} Zoom in at given left coordinate
     * @param originTop {Number ? 0} Zoom in at given top coordinate
     * @param callback {Function ? null} A callback that gets fired when the zoom is complete.
     */
    zoomBy(factor: any, animate: any, originLeft: any, originTop: any, callback: any): void;
    /**
     * Scrolls to the given position. Respect limitations and snapping automatically.
     *
     * @param left {Number?null} Horizontal scroll position, keeps current if value is <code>null</code>
     * @param top {Number?null} Vertical scroll position, keeps current if value is <code>null</code>
     * @param animate {Boolean?false} Whether the scrolling should happen using an animation
     * @param zoom {Number?null} Zoom level to go to
     */
    scrollTo(left: any, top: any, animate: any, zoom?: any): void;
    /**
     * Scroll by the given offset
     *
     * @param left {Number ? 0} Scroll x-axis by given offset
     * @param top {Number ? 0} Scroll x-axis by given offset
     * @param animate {Boolean ? false} Whether to animate the given change
     */
    scrollBy(left: any, top: any, animate: any): void;
    /**
     * Mouse wheel handler for zooming support
     */
    doMouseZoom(wheelDelta: any, timeStamp: any, pageX: any, pageY: any): void;
    /**
     * Touch start handler for scrolling support
     */
    doTouchStart(touches: any, timeStamp: any): void;
    /**
     * Touch move handler for scrolling support
     */
    doTouchMove(touches: any, timeStamp: any, scale?: any): void;
    /**
     * Touch end handler for scrolling support
     */
    doTouchEnd(timeStamp: any): void;
    /**
     * Applies the scroll position to the content element
     *
     * @param left {Number} Left scroll position
     * @param top {Number} Top scroll position
     * @param animate {Boolean?false} Whether animation should be used to move to the new coordinates
     */
    private __publish;
    /**
     * Recomputes scroll minimum values based on client dimensions and content dimensions.
     */
    private __computeScrollMax;
    /**
     * Called when a touch sequence end and the speed of the finger was high enough
     * to switch into deceleration mode.
     */
    private __startDeceleration;
    /**
     * Called on every step of the animation
     *
     * @param inMemory {Boolean?false} Whether to not render the current step, but keep it in memory only. Used internally only!
     */
    private __stepThroughDeceleration;
    /**
     * calculate the distance between two touches
     * @param   {Touch}     touch1
     * @param   {Touch}     touch2
     * @returns {Number}    distance
     */
    __getDistance(touch1: any, touch2: any): number;
    /**
     * calculate the scale factor between two touchLists (fingers)
     * no scale is 1, and goes down to 0 when pinched together, and bigger when pinched out
     * @param   {Array}     start
     * @param   {Array}     end
     * @returns {Number}    scale
     */
    __getScale(start: any, end: any): number;
}
