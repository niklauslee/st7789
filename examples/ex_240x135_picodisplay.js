/**
 * Example for Pico Display Pack (1.14" 240x135)
 */

const { ST7789 } = require("../index");
const st7789 = new ST7789();
const { GraphicsExamples } = require("./graphics-examples");

st7789.setup(board.spi(0, { sck: 18, mosi: 19, miso: 4, baudrate: 20000000 }), {
  width: 240,
  height: 135,
  dc: 16,
  rst: -1 /* RST connected to RUN */,
  cs: 17,
  rotation: 0,
});

const gc = st7789.getContext("buffer");
const gx = new GraphicsExamples(gc);
gx.playAll();
