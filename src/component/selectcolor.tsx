import React from 'react';
import { ReactP5Wrapper } from 'react-p5-wrapper';
import Sketch from '../component/sketch';

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
  return (
    <div className={styles.container}>
      <ReactP5Wrapper
        sketch={Sketch}
        color1={colors.hue1}
        color2={colors.hue2}
        color3={colors.hue3}
      />
      {/* 色相1のスライダー */}
      <input
        className={styles.input}
        type="range"
        min="0"
        max="360"
        value={colors.hue1}
        onChange={(e) => setColors('hue1', parseInt(e.target.value, 10))}
      />
      <label>Hue 1: {colors.hue1}</label>

      {/* 色相2のスライダー */}
      <input
        className={styles.input}
        type="range"
        min="0"
        max="360"
        value={colors.hue2}
        onChange={(e) => setColors('hue2', parseInt(e.target.value, 10))}
      />
      <label>Hue 2: {colors.hue2}</label>

      {/* 色相3のスライダー */}
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

export default SelectColor;
