import p5 from 'p5';

interface SketchProps {
  color1?: number;
  color2?: number;
  color3?: number;
}

const Sketch = (p: p5) => {
  let size: number;
  let num: number;
  let circles1: Cir[];
  let circles2: Cir[];
  let circles3: Cir[];
  let col1: p5.Color;
  let col2: p5.Color;
  let col3: p5.Color;
  let a = 0;
  let scaleFactor: number;

  (p as any).updateWithProps = (newProps: SketchProps) => {
    if (newProps.color1 !== undefined) {
      col1 = p.color(newProps.color1, 100, 100);
    }
    if (newProps.color2 !== undefined) {
      col2 = p.color(newProps.color2, 100, 100);
    }
    if (newProps.color3 !== undefined) {
      col3 = p.color(newProps.color3, 100, 100);
    }
  };

  const setCanvasSize = () => {
    let canvasSize = 400; // デフォルトのキャンバスサイズ

    // ウィンドウ幅が756px以下の場合にキャンバスサイズを小さくする
    if (window.innerWidth <= 756) {
      canvasSize = 300; // 小さくするサイズ
    }

    p.resizeCanvas(canvasSize, canvasSize);
    scaleFactor = canvasSize / 300; // スケールファクターを計算
    size = 35 * scaleFactor; // サイズをスケーリング
    initializeCircles();
  };

  const initializeCircles = () => {
    num = p.width;
    circles1 = new Array(num);
    circles2 = new Array(num);
    circles3 = new Array(num);

    for (let i = 0; i <= num; i++) {
      circles1[i] = new Cir(i, 1);
      circles2[i] = new Cir(i, 2);
      circles3[i] = new Cir(i, 3);
    }
  };

  p.setup = () => {
    setCanvasSize();
    p.background(0);
    p.colorMode(p.HSB);
    p.stroke(0, 100);

    col1 = p.color(0, 100, 100);
    col2 = p.color(120, 100, 100);
    col3 = p.color(240, 100, 100);

    initializeCircles();
  };

  p.windowResized = () => {
    setCanvasSize();
  };

  p.draw = () => {
    p.background(0);
    p.strokeWeight(0.5 * scaleFactor);
    p.noFill();
    for (let i = 0; i <= num; i++) {
      p.stroke(col1);
      p.circle(circles1[i].posx, circles1[i].posy, size * p.noise(i * 0.1 + a));
      p.stroke(col2);
      p.circle(circles2[i].posx, circles2[i].posy, size * p.noise(i * 0.1 + a));
      p.stroke(col3);
      p.circle(circles3[i].posx, circles3[i].posy, size * p.noise(i * 0.1 + a));
      if (i !== num) {
        circles1[i].posy = circles1[i + 1].posy;
        circles2[i].posy = circles2[i + 1].posy;
        circles3[i].posy = circles3[i + 1].posy;
      } else {
        circles1[i].posy = circles1[0].posy;
        circles2[i].posy = circles2[0].posy;
        circles3[i].posy = circles3[0].posy;
      }
    }
    a += 0.01;
  };

  class Cir {
    posx: number;
    posy: number;
    constructor(i: number, type: number) {
      this.posx = i * scaleFactor;
      let theta = p.map(i, 0, num, 0, p.TAU);
      let amplitude = 100 * scaleFactor;
      if (type === 1) this.posy = p.height / 2 + amplitude * p.sin(theta);
      else if (type === 2)
        this.posy = p.height / 2 + amplitude * p.sin(theta + (2 / 3) * p.PI);
      else this.posy = p.height / 2 + amplitude * p.sin(theta + (4 / 3) * p.PI);
    }
  }
};

export default Sketch;