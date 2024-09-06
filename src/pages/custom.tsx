import React, { useState, useEffect } from 'react';
import Head from 'next/head';
import Link from 'next/link';
import { useAccount } from 'wagmi';
import { Modal } from 'react-responsive-modal';
import { useNFTOperations } from '../hooks/useNFTOperations';
import 'react-responsive-modal/styles.css';
import styles from '../styles/custom.module.css';

interface Collection {
    name: string;
    symbol: string;
    fileType: string;
    address: `0x${string}`;
}

const Custom = () => {
    const [collections, setCollections] = useState<Collection[]>([]);
    const [open, setOpen] = useState(false);
    const [collectionName, setCollectionName] = useState('');
    const [symbolName, setSymbolName] = useState('');
    const [choice, setChoice] = useState('');

    const { address: userAddress } = useAccount();
    const { handleMint, fetchEventLogs, isLoading, isSendingTx, error, successMessage } = useNFTOperations(userAddress);

    const onOpenModal = () => setOpen(true);
    const onCloseModal = () => {
        setOpen(false);
        setCollectionName('');
        setSymbolName('');
        setChoice('');
    };

    const handleCreateCollection = async () => {
        if (!collectionName || !symbolName || !choice) {
            return;
        }
        await handleMint(collectionName, symbolName, choice);
        onCloseModal();
        fetchCollections();
    };

    const fetchCollections = async () => {
        const fetchedCollections = await fetchEventLogs();
        setCollections(fetchedCollections);
    };

    useEffect(() => {
        fetchCollections();
    }, [userAddress]);

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
                                        value="svg"
                                        checked={choice === 'svg'}
                                        onChange={(e) => setChoice(e.target.value)}
                                    />
                                    SVG
                                </label>
                            </div>

                            {error && <p className={styles.errorMessage}>{error}</p>}

                            <button type="submit" className={styles.submitButton} disabled={isSendingTx}>
                                {isSendingTx ? '処理中...' : '作成'}
                            </button>
                        </form>
                    </Modal>

                    {isLoading && <p className={styles.loadingMessage}>コレクションを取得中...</p>}
                    {error && <p className={styles.errorMessage}>{error}</p>}
                    {!isLoading && successMessage && <p className={styles.successMessage}>{successMessage}</p>}

                    {!isLoading && (
                        collections.length > 0 ? (
                            <div className={styles.collectionsGrid}>
                                {collections.map((collection, index) => (
                                    <Link
                                        key={index}
                                        href={{
                                            pathname: '/customMint',
                                            query: {
                                                name: collection.name,
                                                symbol: collection.symbol,
                                                fileType: collection.fileType,
                                                address: collection.address
                                            }
                                        }}
                                        className={styles.collectionLink}
                                    >
                                        <div key={index} className={styles.collectionCard}>
                                            <h3>{collection.name}</h3>
                                            <p>シンボル: {collection.symbol}</p>
                                            <p>タイプ: {collection.fileType}</p>
                                        </div>
                                    </Link>
                                ))}
                            </div>
                        ) : (
                            <p className={styles.noCollections}>
                                まだコレクションがありません。新しいコレクションを作成しましょう！
                            </p>
                        )
                    )}
                </div>
            </main>
        </div>
    );
};

export default Custom;