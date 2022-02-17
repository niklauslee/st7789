const font = require("simple-fonts/lee-sans");
const image = require("./logo.bmp.json");

class GraphicsExamples {
  constructor(gc) {
    this.gc = gc;
    this.colors = [
      gc.color16(255, 255, 255), // white
      gc.color16(255, 0, 0), // red
      gc.color16(0, 255, 0), // green
      gc.color16(0, 0, 255), // blue
      gc.color16(255, 255, 0),
      gc.color16(255, 0, 255),
      gc.color16(0, 255, 255),
      gc.color16(127, 127, 127),
    ];
  }

  start() {
    console.log("start");
    this.gc.clearScreen();
    this.gc.setFontColor(this.gc.color16(255, 255, 255));
    this.gc.setColor(this.colors[0]);
    this.gc.drawRect(0, 0, this.gc.getWidth() - 1, this.gc.getHeight() - 1);
    this.gc.drawText(10, 10, "Graphics Examples");
    if (this.gc.display) this.gc.display();
  }

  pixels() {
    console.log("pixels");
    this.gc.clearScreen();
    for (let x = 0; x < this.gc.getWidth(); x += 5) {
      for (let y = 0; y < this.gc.getHeight(); y += 5) {
        this.gc.setPixel(x, y, 0xffff);
      }
    }
    if (this.gc.display) this.gc.display();
  }

  lines() {
    console.log("lines");
    this.gc.clearScreen();
    let c = 0;
    for (let x = 0; x < this.gc.getWidth(); x += 5) {
      this.gc.setColor(this.colors[c]);
      this.gc.drawLine(0, 0, x, this.gc.getHeight() - 1);
      this.gc.drawLine(this.gc.getWidth() - 1, 0, x, this.gc.getHeight() - 1);
      c++;
      if (c > this.colors.length - 1) c = 0;
    }
    if (this.gc.display) this.gc.display();
  }

  rects() {
    console.log("rects");
    this.gc.clearScreen();
    let c = 0;
    for (let x = 0; x < this.gc.getWidth(); x += 5) {
      this.gc.setColor(this.colors[c]);
      if (x * 2 < Math.min(this.gc.getHeight(), this.gc.getWidth())) {
        this.gc.drawRect(
          x,
          x,
          this.gc.getWidth() - x * 2,
          this.gc.getHeight() - x * 2
        );
      }
      c++;
      if (c > this.colors.length - 1) c = 0;
    }
    if (this.gc.display) this.gc.display();
  }

  filledRects() {
    console.log("filled rects");
    this.gc.clearScreen();
    let c = 0;
    for (let x = 0; x < this.gc.getWidth(); x += 10) {
      for (let y = 0; y < this.gc.getWidth(); y += 10) {
        if (((x + y) / 10) % 2 === 0) {
          this.gc.setFillColor(this.colors[c]);
          this.gc.fillRect(x, y, 10, 10);
          c++;
          if (c > this.colors.length - 1) c = 0;
        }
      }
    }
    if (this.gc.display) this.gc.display();
  }

  roundRects() {
    console.log("round rects");
    this.gc.clearScreen();
    let c = 0;
    for (let x = 0; x < this.gc.getWidth(); x += 30) {
      for (let y = 0; y < this.gc.getWidth(); y += 20) {
        this.gc.setColor(this.colors[c]);
        this.gc.setFillColor(this.colors[c]);
        this.gc.drawRoundRect(x, y, 28, 18, 5);
        this.gc.fillRoundRect(x + 3, y + 3, 22, 12, 4);
        c++;
        if (c > this.colors.length - 1) c = 0;
      }
    }
    if (this.gc.display) this.gc.display();
  }

  circles() {
    console.log("circles");
    this.gc.clearScreen();
    let c = 0;
    for (let x = 0; x < this.gc.getWidth(); x += 30) {
      for (let y = 0; y < this.gc.getWidth(); y += 30) {
        this.gc.setColor(this.colors[c]);
        this.gc.setFillColor(this.colors[c]);
        this.gc.drawCircle(x + 15, y + 15, 14);
        this.gc.fillCircle(x + 15, y + 15, 8);
        c++;
        if (c > this.colors.length - 1) c = 0;
      }
    }
    if (this.gc.display) this.gc.display();
  }

  font() {
    console.log("font");
    this.gc.clearScreen();
    this.gc.setFontColor(0xffff);
    this.gc.drawText(
      0,
      0,
      "ABCDEFGHIJKLMN\nOPQRSTUVWXYZ\nabcdefghijklmn\nopqrstuvwxyz\n0123456789\n~!@#$%^&*()-=_+\n[]{}\\|:;'<>/?.,"
    );
    if (this.gc.display) this.gc.display();
  }

  fontScale() {
    console.log("font scale");
    this.gc.clearScreen();
    this.gc.setFontColor(0xffff);
    this.gc.setFontScale(3, 3);
    this.gc.drawText(
      0,
      0,
      "ABCDEFGHIJKLMN\nOPQRSTUVWXYZ\nabcdefghijklmn\nopqrstuvwxyz\n0123456789\n~!@#$%^&*()-=_+\n[]{}\\|:;'<>/?.,"
    );
    this.gc.setFontScale(1, 1);
    if (this.gc.display) this.gc.display();
  }

  customFont() {
    console.log("custom font");
    this.gc.clearScreen();
    this.gc.setFontColor(0xffff);
    this.gc.setFont(font);
    this.gc.setFontScale(1, 1);
    this.gc.drawText(0, 0, 'Custom Font\n"Lee Sans"\nVariable-width Font');
    if (this.gc.display) this.gc.display();
  }

  bitmap() {
    console.log("bitmap");
    this.gc.clearScreen();
    let x = Math.floor((this.gc.getWidth() - image.width) / 2);
    let y = Math.floor((this.gc.getHeight() - image.height) / 2);
    this.gc.drawBitmap(x, y, image, { color: this.gc.color16(0, 255, 0) });
    if (this.gc.display) this.gc.display();
  }

  playAll(delayTime = 3000) {
    this.start();
    delay(delayTime);
    this.pixels();
    delay(delayTime);
    this.lines();
    delay(delayTime);
    this.rects();
    delay(delayTime);
    this.filledRects();
    delay(delayTime);
    this.roundRects();
    delay(delayTime);
    this.circles();
    delay(delayTime);
    this.font();
    delay(delayTime);
    this.fontScale();
    delay(delayTime);
    this.customFont();
    delay(delayTime);
    this.bitmap();
  }
}

exports.GraphicsExamples = GraphicsExamples;
