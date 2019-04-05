# 📜 EasyScroller

> So easy, your cat can do it! 🙀

Mobile-friendly accelerated panning and zooming for DOM and Canvas based on Zynga Scroller.

![EasyScroller Preview gif](preview.gif 'EasyScroller Preview')

## Usage

`npm i easyscroller --save`

```javascript
import { EasyScroller } from 'easyscroller'

const element = document.querySelector('#scroll-content');

new EasyScroller(element, {
  scrollingX: true,
  scrollingY: true,
  zooming: true,
  minZoom: 1,
  maxZoom: 3.0,
  zoomLevel: 1.4
});

...
// Don't forget to clean up later!
scroller.destroy();
```

```html
<head>
  <style>
    #container {
      background-color: #fff;
      border: 5px solid #000;
      height: 320px;
      margin: 10% auto 0 auto;
      overflow: hidden;
      width: 80%;
      position: relative;
    }
  </style>
</head>

<body>
  <div id="container">
    <div id="scroll-content">
      Lorem ipsum dolor sit amet, consectetur adipiscing elit. Etiam ut eros sodales, pulvinar magna sed, lacinia enim.
      Nullam gravida mauris id condimentum mattis. Vestibulum a volutpat justo. Nullam elementum enim a dui pharetra
      ullamcorper. Phasellus eget massa ac eros fermentum porttitor. Praesent pulvinar eget lorem at euismod. Sed
      pulvinar justo vel sapien aliquam, vel finibus leo luctus. Etiam ac lorem id odio accumsan auctor. Pellentesque
      sem odio, viverra nec ex et, vehicula pulvinar tellus. Ut id blandit quam. Morbi maximus congue sagittis.
    </div>
  </div>
</body>
```

## Options

```
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
```
