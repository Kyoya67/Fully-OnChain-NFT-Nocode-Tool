import React, { useEffect, useRef, useState } from 'react';
import dynamic from 'next/dynamic';
import Sketch from './sketch';
import styles from '../styles/selectcolor.module.css';
import { useWriteContract } from 'wagmi';
import { abi, triplehelix_address } from '../abi/triplehelixABI';

interface ColorProps {
  hue1: number;
  hue2: number;
  hue3: number;
}

interface SelectColorProps {
  colors: ColorProps;
  setColors: (colorName: keyof ColorProps, value: number) => void;
}

const SelectColor: React.FC<SelectColorProps> = ({ colors, setColors }) => {
  const canvasRef = useRef<HTMLDivElement>(null);
  const sketchRef = useRef<any>(null);
  const [loading, setLoading] = useState(false);
  const [isMinted, setIsMinted] = useState(false);
  const { writeContract } = useWriteContract();

  useEffect(() => {
    let p5Instance: any = null;

    const initializeSketch = async () => {
      const p5 = await import('p5');
      if (canvasRef.current && !sketchRef.current) {
        p5Instance = new p5.default((p: any) => {
          Sketch(p);
          sketchRef.current = p;
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

  const handleMint = async () => {
    setLoading(true); // ロード中状態にする
    setIsMinted(false); // NFTが成功するまで`isMinted`は`false`

    try {
      await writeContract({
        abi,
        address: triplehelix_address,
        functionName: 'nftMint',
        args: [colors.hue1, colors.hue2, colors.hue3],
      });
      setIsMinted(true); // 成功したら`isMinted`を`true`にする
    } catch (error) {
      console.error('Error minting NFT:', error);
      setIsMinted(false); // エラーが発生した場合は`false`のまま
    } finally {
      setLoading(false); // 成功・失敗に関わらず、ロード中状態を解除
    }
  };

  return (
    <div className={styles.container}>
      <div ref={canvasRef} className={styles.canvasWrapper}></div>
      <div className={styles.inputWrapper}>
        {/* 既存の入力フィールド */}
        <div className={styles.inputGroup}>
          <input
            className={styles.input}
            type="range"
            min="0"
            max="360"
            value={colors.hue1}
            onChange={(e) => setColors('hue1', parseInt(e.target.value, 10))}
          />
          <label>Hue 1: {colors.hue1}</label>
        </div>

        <div className={styles.inputGroup}>
          <input
            className={styles.input}
            type="range"
            min="0"
            max="360"
            value={colors.hue2}
            onChange={(e) => setColors('hue2', parseInt(e.target.value, 10))}
          />
          <label>Hue 2: {colors.hue2}</label>
        </div>

        <div className={styles.inputGroup}>
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

        <div
          className={styles.actionButton}
          onClick={handleMint}
        >
          {loading ? (
            <div className={styles.loader}></div> // ロード中アニメーション
          ) : (
            'Generate NFT'
          )}
        </div>
        {isMinted && <p>NFT minted successfully!</p>}
      </div>
    </div>
  );
};

export default dynamic(() => Promise.resolve(SelectColor), { ssr: false });
