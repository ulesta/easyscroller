import { Scroller, ScrollerOptions } from './Scroller';
export declare class EasyScroller {
    private content;
    private container;
    private options;
    private scroller;
    private browserHasPerspectiveProperty;
    private browserHasTransformProperty;
    private transformProperty;
    private eventHandlers;
    constructor(content: HTMLElement, options: ScrollerOptions);
    private getVendorPrefix;
    private render;
    private reflow;
    private bindEvents;
    /**
     * Retrieves Scroller instance.
     */
    getScroller(): Scroller;
    /**
     * Call on disposal of EasyScroller to clean up Event Handlers.
     */
    destroy(): void;
}
