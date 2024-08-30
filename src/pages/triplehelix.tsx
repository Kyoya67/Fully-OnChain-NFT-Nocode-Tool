import { useState } from 'react';
import React from 'react';
import MintNft from '../component/mintnft'; // MintNFTコンポーネントをインポート
import SelectColor from '../component/selectcolor';
import styles from '../styles/TripleHelix.module.css'; // CSSファイルをインポート

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

  // 更新関数を一つにまとめる
  const updateColor = (colorName: keyof Colors, value: number) => {
    setColors((prevColors) => ({
      ...prevColors,
      [colorName]: value,
    }));
  };

  return (
    <div className={styles.wrapper}>
      <h1 style={{ color: "#fff", textAlign: "center", fontSize: "60px", margin: "0" }}>
        TripleHelix
      </h1>
      <SelectColor styles={styles} colors={colors} setColors={updateColor} />
      <MintNft styles={styles} colors={colors} />
    </div>
  );
}

export default TripleHelix;
