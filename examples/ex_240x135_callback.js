/**
 * Example (callback) for 1.14" 240x135 resolution
 */

const { ST7789 } = require("../index");
const st7789 = new ST7789();
const { GraphicsExamples } = require("./graphics-examples");

st7789.setup(board.spi(0, { baudrate: 20000000 }), {
  width: 240,
  height: 135,
  dc: 20,
  rst: 21,
  cs: 17,
  rotation: 0,
});

// turn on backlight (GP16) if needed
pinMode(16, OUTPUT);
digitalWrite(16, HIGH);

const gc = st7789.getContext("callback");
const gx = new GraphicsExamples(gc);
gx.playAll();
