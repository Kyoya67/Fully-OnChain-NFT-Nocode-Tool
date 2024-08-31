import React, { useEffect, useRef, useState } from 'react';
import dynamic from 'next/dynamic';
import Sketch from './sketch'; // sketch.tsファイルのパスを適切に指定してください

interface ColorProps {
  hue1: number;
  hue2: number;
  hue3: number;
}

interface SelectColorProps {
  styles: { [key: string]: string };
  colors: ColorProps;
  setColors: (colorName: keyof ColorProps, value: number) => void;
}

const SelectColor: React.FC<SelectColorProps> = ({ styles, colors, setColors }) => {
  const canvasRef = useRef<HTMLDivElement>(null);
  const sketchRef = useRef<any>(null);

  useEffect(() => {
    let p5Instance: any = null;

    const initializeSketch = async () => {
      const p5 = await import('p5');
      if (canvasRef.current && !sketchRef.current) {
        p5Instance = new p5.default((p: any) => {
          Sketch(p);
          sketchRef.current = p; // p5インスタンスを参照として保存
        }, canvasRef.current);
      }
    };

    initializeSketch();

    return () => {
      if (p5Instance) {
        p5Instance.remove();
      }
      sketchRef.current = null;
    };
  }, []);

  useEffect(() => {
    if (sketchRef.current && sketchRef.current.updateWithProps) {
      sketchRef.current.updateWithProps({
        color1: colors.hue1,
        color2: colors.hue2,
        color3: colors.hue3,
      });
    }
  }, [colors]);

  return (
    <div className={styles.container}>
      <div ref={canvasRef}></div>
      <input
        className={styles.input}
        type="range"
        min="0"
        max="360"
        value={colors.hue1}
        onChange={(e) => setColors('hue1', parseInt(e.target.value, 10))}
      />
      <label>Hue 1: {colors.hue1}</label>

      <input
        className={styles.input}
        type="range"
        min="0"
        max="360"
        value={colors.hue2}
        onChange={(e) => setColors('hue2', parseInt(e.target.value, 10))}
      />
      <label>Hue 2: {colors.hue2}</label>

      <input
        className={styles.input}
        type="range"
        min="0"
        max="360"
        value={colors.hue3}
        onChange={(e) => setColors('hue3', parseInt(e.target.value, 10))}
      />
      <label>Hue 3: {colors.hue3}</label>
    </div>
  );
};

export default dynamic(() => Promise.resolve(SelectColor), { ssr: false });