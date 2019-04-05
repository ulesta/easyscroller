export declare const core: {
    effect: {
        Animate: {
            /**
             * A requestAnimationFrame wrapper / polyfill.
             *
             * @param callback {Function} The callback to be invoked before the next repaint.
             * @param root {HTMLElement} The root element for the repaint
             */
            requestAnimationFrame: (callback: any, root: any) => void;
            /**
             * Stops the given animation.
             *
             * @param id {Integer} Unique animation ID
             * @return {Boolean} Whether the animation was stopped (aka, was running before)
             */
            stop: (id: any) => boolean;
            /**
             * Whether the given animation is still running.
             *
             * @param id {Integer} Unique animation ID
             * @return {Boolean} Whether the animation is still running
             */
            isRunning: (id: any) => boolean;
            /**
             * Start the animation.
             *
             * @param stepCallback {Function} Pointer to function which is executed on every step.
             *   Signature of the method should be `function(percent, now, virtual) { return continueWithAnimation; }`
             * @param verifyCallback {Function} Executed before every animation step.
             *   Signature of the method should be `function() { return continueWithAnimation; }`
             * @param completedCallback {Function}
             *   Signature of the method should be `function(droppedFrames, finishedAnimation) {}`
             * @param duration {Integer} Milliseconds to run the animation
             * @param easingMethod {Function} Pointer to easing function
             *   Signature of the method should be `function(percent) { return modifiedValue; }`
             * @param root {Element ? document.body} Render root, when available. Used for internal
             *   usage of requestAnimationFrame.
             * @return {Integer} Identifier of animation. Can be used to stop it any time.
             */
            start: (stepCallback: any, verifyCallback: any, completedCallback: any, duration?: any, easingMethod?: any, root?: any) => number;
        };
    };
};
