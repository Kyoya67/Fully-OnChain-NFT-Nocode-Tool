import React, { useState, useEffect } from 'react';
import Head from 'next/head';
import { writeContract, waitForTransactionReceipt } from '@wagmi/core';
import { useAccount, usePublicClient } from 'wagmi';
import { config } from '../wagmi';
import { abi as factoryABI, address as factoryAddress} from '../abi/factoryABI';
import { Modal } from 'react-responsive-modal';
import 'react-responsive-modal/styles.css';
import styles from '../styles/custom.module.css';
import { Log } from 'viem';

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

    const { address: userAddress } = useAccount();
    const publicClient = usePublicClient();

    const onOpenModal = () => {
        setOpen(true);
        setError('');
    };

    const onCloseModal = () => {
        setOpen(false);
        setError('');
        setCollectionName('');
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
            fetchEventLogs(); // コレクション作成後、イベントログを再取得
        } catch (error) {
            console.error('Error minting contract:', error);
            setError('コントラクト作成に失敗しました。');
        } finally {
            setIsSendingTx(false);
        }
    }

    const fetchEventLogs = async () => {
        if (!publicClient || !userAddress) return;

        try {
            const nftContractCreatedEvent = factoryABI.find(x => x.name === 'NFTContractCreated' && x.type === 'event');
            if (!nftContractCreatedEvent) {
                throw new Error('NFTContractCreated event not found in ABI');
            }

            const logs = await publicClient.getLogs({
                address: factoryAddress,
                event: nftContractCreatedEvent,
                fromBlock: BigInt(0),
                toBlock: 'latest',
                args: {
                    creator: userAddress
                }
            });

            const fetchedCollections = logs.map((log: Log) => {
                const { name, symbol, fileType, contractAddress } = log.args as {
                    name: string;
                    symbol: string;
                    fileType: string;
                    contractAddress: string;
                };
                return {
                    name,
                    symbol,
                    fileType,
                    address: contractAddress,
                };
            });

            setCollections(fetchedCollections);
        } catch (error) {
            console.error('Error fetching logs:', error);
        }
    };

    useEffect(() => {
        fetchEventLogs();
    }, [publicClient, userAddress]);

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