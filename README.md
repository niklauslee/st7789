# ST7789

Kaluma library for ST7789 (Color TFT/IPS LCD Display)

Display boards with ST7789:

- [Adafruit 1.14" 240x135 TFT LCD](https://www.adafruit.com/product/4383)
- [Adafruit 1.3" 240x240 TFT LCD](https://www.adafruit.com/product/4313)
- [Adafruit 1.54" 240x240 TFT LCD](https://www.adafruit.com/product/3787)
- [Adafruit 1.69" 280x240 IPS LCD](https://www.adafruit.com/product/5206)
- [Adafruit 2.0" 320x240 TFT LCD](https://www.adafruit.com/product/4311)
- [Pimoroni 1.54" 240x240 Color Square LCD](https://shop.pimoroni.com/products/1-54-spi-colour-square-lcd-240x240-breakout)
- [Pimoroni 1.3" 240x240 Color Square LCD](https://shop.pimoroni.com/products/1-3-spi-colour-lcd-240x240-breakout)
- [Pimoroni 1.3" 240x240 Color Round LCD](https://shop.pimoroni.com/products/1-3-spi-colour-round-lcd-240x240-breakout)
- [Pimoroni 1.14" 240x135 Pico Display Pack](https://shop.pimoroni.com/products/pico-display-pack) (TESTED)
- [Pimoroni 2.0" 320x240 Pico Display Pack 2.0](https://shop.pimoroni.com/products/pico-display-pack-2-0)
- [Pimoroni 1.54" 240x240 PicoSystem](https://shop.pimoroni.com/products/picosystem) (TESTED)

# Wiring
 
Here is a wiring example for `SPI0`.

| Raspberry Pi Pico | ST7789 |
| ----------------- | ------ |
| 3V3               | 3V3    |
| GND               | GND    |
| GP19 (SPI0 TX)    | MOSI   |
| GP18 (SPI0 SCK)   | SCK    |
| GP20              | DC     |
| GP21              | RST    |
| GP17              | CS     |
| GP16              | BL     |

![st7789](https://github.com/niklauslee/st7789/blob/main/images/wiring.jpg?raw=true)

# Install

```sh
npm i https://github.com/niklauslee/st7789
```

# Usage

You can initialize ST7789 driver using SPI interface as below:

```js
const {ST7789} = require('st7789');
const st7789 = new ST7789();

var options = { // ST7789 1.14"
  width: 240,
  height: 135,
  dc: 20,
  rst: 21,
  cs: 17
}

// turn on backlight (GP16) if needed
pinMode(16, OUTPUT);
digitalWrite(16, HIGH);

st7789.setup(board.spi(0), options);
const gc = st7789.getContext();
gc.drawRect(0, 0, width, height);
```

You can use `BufferedGraphicsContext` instead of general callback-based graphics context as below:
 
```js
// buffered graphic context
var gc = st7789.getContext('buffer');
gc.drawRect(0, 0, width, height);
gc.display(); // must call if buffered graphic context
...
```
 
> Note that `BufferedGraphicsContext` allocates a lot of memory (approximately 64KB for 240x135 and 112KB for 240x240 resolution). You may need to check available heap memory with `.mem` command in REPL during development.

# API
 
## Class: ST7789
 
A class for ST7789 driver communicating with SPI interface.
 
### new ST7789()
 
Create an instance of ST7789 driver for SPI interface.
 
### st7789.setup(spi[, options])
 
- **`spi`** `<SPI>` An instance of `SPI` to communicate.
- **`options`** `<object>` Options for initialization.
  - **`width`** `<number>` Width of display in pixels. Default: `240`.
  - **`height`** `<number>` Height of display in pixels. Default: `240`.
  - **`dc`** `<number>` Pin number for DC. Default: `-1`.
  - **`rst`** `<number>` Pin number for RST (Reset). Default: `-1`.
  - **`cs`** `<number>` Pin number of CS (Chip select). Default: `-1`.
  - **`rotation`** `<number>` Rotation of screen. One of `0` (0 degree), `1` (90 degree in clockwise), `2` (180 degree in clockwise), and `3` (270 degree in clockwise). Default: `0`.
 
### st7789.getContext([type])
 
- **`type`**: Optional. Type of graphic context (`"buffer"` or `"callback"`). If `"buffer"` is given, `BufferedGraphicContext` is returned.
- **Returns**: `<GraphicContext>` An instance of graphic context for ST7789.
 
Get a graphic context.
 
> Note that `BufferedGraphicContext` is much faster, but it consumes memory a lot.
 
> Note that `gc.getPixel(x, y)` function is supported only if `BufferedGraphicsContext`.
 
# Examples
 
* `examples/ex_240x135_callback.js` (callback-type GC with 1.14" 240x135 resolution)
* `examples/ex_240x135_buffer.js` (buffer-type GC with 1.14" 240x135 resolution)
* `examples/ex_240x135_picodisplay.js` (Pimoroni's Pico Display Pack) 
* `examples/ex_240x135_picosystem.js` (Pimoroni's Pico System)

```sh
kaluma flash ./examples/ex_240x135_picodisplay.js --bundle --port <port>
```

# References

- [Adafruit ST77xx Library](https://github.com/adafruit/Adafruit-ST7735-Library)
- [Adafruit CircuitPython ST7789](https://github.com/adafruit/Adafruit_CircuitPython_ST7789/blob/main/adafruit_st7789.py)
- [Pimoroni PicoSystem](https://github.com/pimoroni/picosystem/blob/main/libraries/hardware.cpp)
- [Pimoroni ST7789](https://github.com/pimoroni/pimoroni-pico/blob/main/drivers/st7789/st7789.cpp)
