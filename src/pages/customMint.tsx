import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import Head from 'next/head';
import dynamic from 'next/dynamic';
import styles from '../styles/customMint.module.css';

// AceEditorをクライアントサイドでのみ動作するように動的にインポート
const AceEditor = dynamic(
  async () => {
    const ace = await import('react-ace');
    await import('ace-builds/src-noconflict/mode-html');
    await import('ace-builds/src-noconflict/mode-svg');
    await import('ace-builds/src-noconflict/theme-monokai');
    return ace;
  },
  { ssr: false }
);

const CustomMint: React.FC = () => {
  const router = useRouter();
  const { name, symbol, fileType, address } = router.query;
  const [code, setCode] = useState<string>('');

  const handleCodeChange = (newCode: string) => {
    setCode(newCode);
  };

  return (
    <>
      <Head>
        <title>NFTをミント - フルオンチェーンNFTクリエーター</title>
        <meta name="description" content="NFTをミントします" />
      </Head>

      <main className={styles.main}>
        <h1 className={styles.title}>NFTをミント</h1>

        <div className={styles.info}>
          <p>コレクション名: {name as string}</p>
          <p>シンボル: {symbol as string}</p>
          <p>ファイルタイプ: {fileType as string}</p>
          <p>コントラクトアドレス: {address as string}</p>
        </div>

        <div className={styles.editorPreviewContainer}>
          <div className={styles.editorContainer}>
            <AceEditor
              mode={fileType === 'svg' ? 'svg' : 'html'}
              theme="monokai"
              onChange={handleCodeChange}
              name="NFT_EDITOR"
              editorProps={{ $blockScrolling: true }}
              setOptions={{
                useWorker: false,
                showLineNumbers: true,
                tabSize: 2,
              }}
              style={{ width: '100%', height: '400px' }}
              value={code}
            />
          </div>
          <div className={styles.previewContainer}>
            <iframe
              srcDoc={code}
              title="NFT Preview"
              className={styles.preview}
            />
          </div>
        </div>

        <button className={styles.mintButton} onClick={() => console.log('Minting not implemented yet')}>NFTをミント</button>
      </main>
    </>
  );
};

export default CustomMint;