import React, { useState, useEffect } from 'react';
import Head from 'next/head';
import { readContract } from '@wagmi/core';
import { writeContract, waitForTransactionReceipt } from '@wagmi/core';
import { useAccount } from 'wagmi'; // useAccount フックをインポート
import { config } from '../wagmi';
import { abi as factoryABI, address as factoryAddress} from '../abi/factoryABI';
import { abi as nftABI } from '../abi/nftABI';
import { Modal } from 'react-responsive-modal';
import 'react-responsive-modal/styles.css';
import styles from '../styles/custom.module.css';

interface Collection {
    name: string;
    symbol: string;
    fileType: string;
    address: string;
}

const Custom = () => {
    const [collections, setCollections] = useState<Collection[]>([]);
    const [open, setOpen] = useState(false);
    const [collectionName, setCollectionName] = useState('');
    const [symbolName, setSymbolName] = useState('');
    const [choice, setChoice] = useState('');
    const [error, setError] = useState('');
    const [isSendingTx, setIsSendingTx] = useState(false);

    const { address: userAddress } = useAccount(); // ユーザーのアドレスを取得

    const onOpenModal = () => {
        setOpen(true);
        setError(''); // モーダルが開かれたときにエラーメッセージをクリア
    };

    const onCloseModal = () => {
        setOpen(false);
        setError(''); // モーダルが閉じられたときにエラーメッセージをクリア
        setCollectionName(''); // 入力フィールドもクリア
        setSymbolName('');
        setChoice('');
    };

    const handleCreateCollection = () => {
        if (!collectionName || !symbolName || !choice) {
            setError('すべてのフィールドを入力してください。');
        } else {
            handleMint();
        }
    };

    async function handleMint() {
        setIsSendingTx(true);

        try {
            const tx = await writeContract(config, {
                address: factoryAddress,
                abi: factoryABI,
                functionName: 'createNFTContract',
                args: [collectionName, symbolName, choice],
            });
            const receipt = await waitForTransactionReceipt(config, {
                hash: tx,
            });
            console.log('Transaction receipt:', receipt);
            onCloseModal();
        } catch (error) {
            console.error('Error minting contract:', error);
            setError('コントラクト作成に失敗しました。');
        } finally {
            setIsSendingTx(false);
        }
    }

    return (
        <div className={styles.container}>
            <Head>
                <title>マイコレクション - フルオンチェーンNFTクリエーター</title>
                <meta name="description" content="あなたのNFTコレクションを管理します" />
            </Head>

            <main className={styles.main}>
                <h1 className={styles.title}>コレクション一覧</h1>

                <div className={styles.wrapper}>
                    <button onClick={onOpenModal} className={styles.createButton}>
                        コレクション作成
                    </button>

                    <Modal
                        open={open}
                        onClose={onCloseModal}
                        center
                        classNames={{
                            modal: styles.customModal,
                        }}>
                        <h2>新しいコレクションを作成</h2>
                        <form onSubmit={(e) => { e.preventDefault(); handleCreateCollection(); }}>
                            <input
                                type="text"
                                placeholder="コレクション名"
                                value={collectionName}
                                onChange={(e) => setCollectionName(e.target.value)}
                                className={styles.input}
                            />
                            <input
                                type="text"
                                placeholder="シンボル名"
                                value={symbolName}
                                onChange={(e) => setSymbolName(e.target.value)}
                                className={styles.input}
                            />

                            <div className={styles.radioGroup}>
                                <label>
                                    <input
                                        type="radio"
                                        name="choice"
                                        value="html"
                                        checked={choice === 'html'}
                                        onChange={(e) => setChoice(e.target.value)}
                                    />
                                    HTML
                                </label>
                                <label>
                                    <input
                                        type="radio"
                                        name="choice"
                                        value="css"
                                        checked={choice === 'css'}
                                        onChange={(e) => setChoice(e.target.value)}
                                    />
                                    CSS
                                </label>
                            </div>

                            {error && <p className={styles.errorMessage}>{error}</p>}

                            <button type="submit" className={styles.submitButton} disabled={isSendingTx}>
                                {isSendingTx ? '処理中...' : '作成'}
                            </button>
                        </form>
                    </Modal>

                    {collections.length > 0 ? (
                        <div className={styles.collectionsGrid}>
                            {collections.map((collection, index) => (
                                <div key={index} className={styles.collectionCard}>
                                    <h3>{collection.name}</h3>
                                    <p>シンボル: {collection.symbol}</p>
                                    <p>タイプ: {collection.fileType}</p>
                                    <p>コントラクトアドレス: {collection.address}</p>
                                </div>
                            ))}
                        </div>
                    ) : (
                        <p className={styles.noCollections}>
                            まだコレクションがありません。新しいコレクションを作成しましょう！
                        </p>
                    )}
                </div>
            </main>
        </div>
    );
};

export default Custom;