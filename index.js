const graphics = require("graphics");

const MADCTL_ROW_ORDER = 0b10000000;
const MADCTL_COL_ORDER = 0b01000000;
const MADCTL_SWAP_XY = 0b00100000;
const MADCTL_SCAN_ORDER = 0b00010000;
const MADCTL_RGB = 0b00001000;
const MADCTL_HORIZ_ORDER = 0b00000100;

/**
 * ST7789 class
 */
class ST7789 {
  /**
   * Setup ST7789 for SPI connection
   * @param {SPI} spi
   * @param {Object} options
   *   .width {number=240}
   *   .height {number=240}
   *   .dc {number=-1}
   *   .rst {number=-1}
   *   .cs {number=-1}
   *   .rotation {number=0}
   */
  setup(spi, options) {
    this.spi = spi;
    options = Object.assign(
      {
        width: 240,
        height: 240,
        dc: -1,
        rst: -1,
        cs: -1,
        rotation: 0,
      },
      this.init,
      options
    );
    this.width = options.width;
    this.height = options.height;
    this.dc = options.dc;
    this.rst = options.rst;
    this.cs = options.cs;
    this.rotation = options.rotation;
    this.xstart = 0;
    this.ystart = 0;
    this.context = null;
    if (this.dc > -1) pinMode(this.dc, OUTPUT);
    if (this.cs > -1) pinMode(this.cs, OUTPUT);
    // reset
    if (this.rst > -1) {
      pinMode(this.rst, OUTPUT);
      digitalWrite(this.rst, LOW);
      delay(100);
      digitalWrite(this.rst, HIGH);
    }
    this.init();
  }

  init() {
    this.cmd(0x01); // SWRESET (soft reset)
    delay(150);
    this.cmd(0x35, [0x00]); // TEON
    this.cmd(0x3a, [0x05]); // COLMOD (color mode)

    /*
    this.cmd(0x36, [0x04]); // MADCTL (mem access ctrl)
    this.cmd(0xB2, [0x0C, 0x0C, 0x00, 0x33, 0x33]); // FRMCTR2
    this.cmd(0x26, [0x01]); // GAMSET
    this.cmd(0xB7, [0x14]); // GCTRL
    this.cmd(0xBB, [0x25]); // VCOMS
    this.cmd(0xC0, [0x2C]); // LCMCTRL
    this.cmd(0xC2, [0x01]); // VDVVRHEN
    this.cmd(0xC3, [0x12]); // VRHS
    this.cmd(0xC4, [0x20]); // VDVS
    this.cmd(0xD0, [0xA4, 0xA1]); // PWRCTRL1
    this.cmd(0xC6, [0x1E]); // FRCTRL2
    this.cmd(0xE0, [0xD0, 0x04, 0x0D, 0x11, 0x13, 0x2B, 0x3F, 0x54, 0x4C, 0x18, 0x0D, 0x0B, 0x1F, 0x23]); // GMCTRP1
    this.cmd(0xE1, [0xD0, 0x04, 0x0C, 0x11, 0x13, 0x2C, 0x3F, 0x44, 0x51, 0x2F, 0x1F, 0x1F, 0x20, 0x23]); // GMCTRN1
    */

    this.cmd(0x21); // INVON
    this.cmd(0x11); // SLPOUT (sleep out)
    this.cmd(0x29); // DISPON (main screen on)
    delay(100);

    // defaults for 240x240
    let madctl = 0;
    let c0 = 0,
      c1 = 0;
    let r0 = 0,
      r1 = 0;

    if (this.width === 240 && this.height === 240) {
      madctl = MADCTL_HORIZ_ORDER;
    }
    if (this.width === 240 && this.height === 135) {
      madctl = MADCTL_COL_ORDER | MADCTL_SWAP_XY | MADCTL_SCAN_ORDER;
      c0 = 40;
      r0 = 53;
    }
    if (this.width === 135 && this.height === 240) {
      c0 = 52;
      r0 = 40;
    }
    if (this.width === 320 && this.height === 240) {
      c0 = 0;
      r0 = 40;
      madctl = 0x70;
    }
    c1 = c0 + this.width - 1;
    r1 = r0 + this.height - 1;

    this.xstart = c0;
    this.ystart = r0;
    this.cmd(0x2a, [c0 >> 8, c0 & 0xff, c1 >> 8, c1 & 0xff]); // CASET
    this.cmd(0x2a, [r0 >> 8, r0 & 0xff, r1 >> 8, r1 & 0xff]); // RASET
    this.cmd(0x36, [madctl]); // MADCTL
  }

  /**
   * Send command
   * @param {number} cmd
   * @param {Array<number>} data
   * @param {number} count
   */
  cmd(cmd, data, count = 1) {
    digitalWrite(this.cs, LOW);
    digitalWrite(this.dc, LOW); // command
    this.spi.send(new Uint8Array([cmd]));
    digitalWrite(this.dc, HIGH); // data
    if (data) this.spi.send(new Uint8Array(data), 5000, count);
    digitalWrite(this.cs, HIGH);
  }

  /**
   * Get a graphic context
   * @param {string} type Type of graphic context.
   *     'buffer' or 'callback'. Default is 'callback'
   */
  getContext(type) {
    if (!this.context) {
      if (type === "buffer") {
        this.context = new graphics.BufferedGraphicsContext(
          this.width,
          this.height,
          {
            rotation: this.rotation,
            bpp: 16,
            display: (buffer) => {
              const xa = this.xstart + this.width - 1;
              const ya = this.ystart + this.height - 1;
              this.cmd(0x2a, [0, this.xstart, xa >> 8, xa & 0xff]); // column addr set
              this.cmd(0x2b, [0, this.ystart, ya >> 8, ya & 0xff]); // row addr set
              // write to RAM
              digitalWrite(this.cs, LOW);
              digitalWrite(this.dc, LOW);
              this.spi.send(new Uint8Array([0x2c]));
              digitalWrite(this.dc, HIGH);
              this.spi.send(buffer);
              digitalWrite(this.cs, HIGH);
            },
          }
        );
      } else {
        // 'callback'
        this.context = new graphics.GraphicsContext(this.width, this.height, {
          rotation: this.rotation,
          setPixel: (x, y, c) => {
            const x0 = this.xstart + x;
            const y0 = this.ystart + y;
            this.cmd(0x2a, [x0 >> 8, x0 & 0xff, x0 >> 8, x0 & 0xff]); // column addr set
            this.cmd(0x2b, [y0 >> 8, y0 & 0xff, y0 >> 8, y0 & 0xff]); // row addr set
            this.cmd(0x2c, [c >> 8, c]); // write to RAM
          },
          fillRect: (x, y, w, h, c) => {
            const x1 = this.xstart + x;
            const x2 = this.xstart + x + w - 1;
            const y1 = this.ystart + y;
            const y2 = this.ystart + y + h - 1;
            this.cmd(0x2a, [x1 >> 8, x1 & 0xff, x2 >> 8, x2 & 0xff]); // column addr set
            this.cmd(0x2b, [y1 >> 8, y1 & 0xff, y2 >> 8, y2 & 0xff]); // row addr set
            this.cmd(0x2c, [c >> 8, c], w * h); // write to RAM
          },
        });
      }
    }
    return this.context;
  }
}

exports.ST7789 = ST7789;
