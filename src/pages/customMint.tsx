import React, { useState } from 'react';
import { useRouter } from 'next/router';
import Head from 'next/head';
import dynamic from 'next/dynamic';
import { Modal } from 'react-responsive-modal';
import 'react-responsive-modal/styles.css';
import styles from '../styles/customMint.module.css';
import { writeContract, waitForTransactionReceipt } from '@wagmi/core';
import { useAccount } from 'wagmi';
import { config } from '../wagmi';
import {abi as mintAbi} from '../abi/customMintABI';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

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
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
  const [title, setTitle] = useState<string>('');
  const [description, setDescription] = useState<string>('');
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const { address: userAddress } = useAccount();

  const encodeToBase64 = (str: string) => {
    return Buffer.from(str).toString('base64');
  };

  const handleCodeChange = (newCode: string) => {
    setCode(newCode);
  };

  const openModal = () => {
    setIsModalOpen(true);
    setError(null);
  };

  const closeModal = () => {
    setIsModalOpen(false);
  };

  const handleMint = async () => {
    setIsLoading(true);
    setError(null);

    try {
      const encodedData = encodeToBase64(code);

      const tx = await writeContract(config, {
        address: address as `0x${string}`,
        abi: mintAbi,
        functionName: 'nftMint',
        args: [title, description, encodedData],
      });

      const receipt = await waitForTransactionReceipt(config, {
        hash: tx,
      });

      console.log('NFT minted successfully!', receipt);

      // OpenSeaのリンクを生成
      const tokenIdHex = receipt.logs[0]?.topics[3];

      if (tokenIdHex) {
        // 16進数から10進数に変換
        const tokenId = parseInt(tokenIdHex.toString().replace(/^0x/, ''), 16);

        // OpenSeaのリンクを生成
        const openSeaLink = `https://testnets.opensea.io/assets/sepolia/${address}/${tokenId}`;

        // 完了メッセージとリンクをポップアップで表示
        toast.success(
          <div>
            NFTが作成されました！<br />
            <a href={openSeaLink} target="_blank" rel="noopener noreferrer">OpenSeaで確認する</a>
          </div>,
          { autoClose: 10000, position: "bottom-right" }
        );
      } else {
        toast.error('トークンIDが取得できませんでした。', { position: "bottom-right" });
      }

      closeModal();
    } catch (err) {
      console.error('Error minting NFT:', err);
      setError(err instanceof Error ? err.message : '不明なエラーが発生しました。');
      toast.error('NFTの作成中にエラーが発生しました。', { position: "bottom-right" });
    } finally {
      setIsLoading(false);
    }
  };

  const getOpenSeaCollectionUrl = (contractAddress: string) => {
    return `https://testnets.opensea.io/collection/${name?.toLowerCase().replace(/\s+/g, '-')}`;
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
          <p>
            コントラクトアドレス:{' '}
            <a
              href={getOpenSeaCollectionUrl(address as string)}
              target="_blank"
              rel="noopener noreferrer"
              className={styles.addressLink}
            >
              {address as string}
            </a>
          </p>
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

        <button className={styles.mintButton} onClick={openModal} disabled={!userAddress}>
          {userAddress ? 'ミントする' : 'ウォレットを接続してください'}
        </button>

        <Modal
          open={isModalOpen}
          onClose={closeModal}
          center
          classNames={{
            modal: styles.customModal,
            closeButton: styles.closeButton,
          }}
        >
          <h2>NFT詳細</h2>
          <input
            type="text"
            placeholder="作品タイトル"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className={styles.input}
          />
          <textarea
            placeholder="作品詳細"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            className={`${styles.input} ${styles.textarea}`}
          />
          {error && <p className={styles.errorMessage}>{error}</p>}
          <button 
            onClick={handleMint} 
            className={styles.createButton}
            disabled={isLoading || !userAddress || !title || !description || !code}
          >
            {isLoading ? 'ミント中...' : 'ミント'}
          </button>
        </Modal>
      </main>
      <ToastContainer className={styles.toast} />
    </>
  );
};

export default CustomMint;