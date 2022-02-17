/**
 * Example for Pico System (1.54" 240x240)
 */

const { ST7789 } = require("../index");
const st7789 = new ST7789();
const { GraphicsExamples } = require("./graphics-examples");

st7789.setup(board.spi(0, { sck: 6, mosi: 7, baudrate: 20000000 }), {
  width: 240,
  height: 240,
  dc: 9,
  rst: 4,
  cs: 5,
  rotation: 0,
});

// turn on backlight
pinMode(12, OUTPUT);
digitalWrite(12, HIGH);

const gc = st7789.getContext("buffer");
const gx = new GraphicsExamples(gc);
gx.playAll();

global.gc = gc;
