import { useState } from 'react';
import React from 'react';
// import MintNft from '../component/mintnft'; 
import SelectColor from '../component/selectcolor';
import styles from '../styles/triplehelix.module.css';

interface Colors {
  hue1: number;
  hue2: number;
  hue3: number;
}

const TripleHelix = () => {
  const [colors, setColors] = useState<Colors>({
    hue1: 0,
    hue2: 0,
    hue3: 0,
  });

  const updateColor = (colorName: keyof Colors, value: number) => {
    setColors((prevColors) => ({
      ...prevColors,
      [colorName]: value,
    }));
  };

  return (
    <div className={styles.wrapper}>
      <h1>
        TripleHelix
      </h1>
      <div className={styles.selectcolor}>
        <SelectColor colors={colors} setColors={updateColor} />
      </div>
    </div>
  );
}

export default TripleHelix;