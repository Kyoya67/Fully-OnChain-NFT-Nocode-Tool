import * as React from 'react';
import { useState } from 'react';
import dynamic from 'next/dynamic';
import Sketch from './sketch';
import styles from '../styles/selectcolor.module.css';
import { writeContract, waitForTransactionReceipt } from '@wagmi/core';
import { config } from '../wagmi';
import { abi, address } from '../abi/triplehelixABI';

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
  const canvasRef = React.useRef<HTMLDivElement>(null);
  const sketchRef = React.useRef<any>(null);
  const [isSendingTx, setIsSendingTx] = useState(false);

  React.useEffect(() => {
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

  React.useEffect(() => {
    if (sketchRef.current && sketchRef.current.updateWithProps) {
      sketchRef.current.updateWithProps({
        color1: colors.hue1,
        color2: colors.hue2,
        color3: colors.hue3,
      });
    }
  }, [colors]);

  async function handleMint(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setIsSendingTx(true);
    
    try {
      const tx = await writeContract(config, {
        address: address,
        abi,
        functionName: 'nftMint',
        args: [colors.hue1, colors.hue2, colors.hue3],
      });
      await waitForTransactionReceipt(config, { 
        hash: tx 
      });
    } catch (error) {
      console.error('Error minting NFT:', error);
    } finally {
      setIsSendingTx(false);
    }
  }

  return (
    <form onSubmit={handleMint} className={styles.container}>
      <div ref={canvasRef} className={styles.canvasWrapper}></div>
      <div className={styles.inputWrapper}>
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

        <button
          className={styles.actionButton}
          disabled={isSendingTx}
          type="submit"
        >
          {isSendingTx ? 'Minting...' : 'Generate NFT'}
        </button>
      </div>
    </form>
  );
};

export default dynamic(() => Promise.resolve(SelectColor), { ssr: false });
