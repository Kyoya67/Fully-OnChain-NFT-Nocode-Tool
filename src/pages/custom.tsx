import React, { useState, useEffect } from 'react';
import Head from 'next/head';
import { writeContract, waitForTransactionReceipt } from '@wagmi/core';
import { useAccount, usePublicClient } from 'wagmi';
import { config } from '../wagmi';
import { abi as factoryABI, address as factoryAddress } from '../abi/factoryABI';
import { Modal } from 'react-responsive-modal';
import 'react-responsive-modal/styles.css';
import styles from '../styles/custom.module.css';
import { Log } from 'viem';
import { publicClient } from './client';

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
    const [error, setError] = useState('');
    const [isSendingTx, setIsSendingTx] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [successMessage, setSuccessMessage] = useState('');

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
        setIsLoading(true);
        setError('');
        setSuccessMessage('');
        console.log("fetchEventLogs called");

        if (!publicClient || !userAddress) {
            console.log("publicClient or userAddress is missing", { publicClient, userAddress }); // デバッグログ
            return;
        }

        try {
            const latestBlock = await publicClient.getBlockNumber();
            const fromBlock = BigInt(6635572); // 約1週間分のブロック

            console.log("Attempting to fetch logs");
            console.log(userAddress);
            const logs = await publicClient.getLogs({
                address: factoryAddress,
                event: {
                    type: 'event',
                    name: 'NFTContractCreated',
                    inputs: [
                        { type: 'address', indexed: true, name: 'creator' },
                        { type: 'address', indexed: true, name: 'contractAddress' },
                        { type: 'string', indexed: false, name: 'name' },
                        { type: 'string', indexed: false, name: 'symbol' },
                        { type: 'string', indexed: false, name: 'fileType' }
                    ],
                    args: {
                        creator: userAddress
                    },
                },
                fromBlock: fromBlock,
                toBlock: latestBlock,
            });

            console.log("Logs fetched:", logs); // デバッグログ

            if (logs.length === 0) {
                console.log("No logs found");
                setSuccessMessage('コレクションはまだありません。新しく作成してみましょう！');
            } else {
                const fetchedCollections = logs.map(log => {
                    const contractAddress = log.args.contractAddress;
                    if (typeof contractAddress !== 'string' || !contractAddress.startsWith('0x')) {
                        throw new Error('Invalid contract address format');
                    }
                    return {
                        name: log.args.name ?? 'Unknown Name',
                        symbol: log.args.symbol ?? 'Unknown Symbol',
                        fileType: log.args.fileType ?? 'Unknown Type',
                        address: contractAddress as `0x${string}`,
                    };
                });
                setCollections(fetchedCollections);
                setSuccessMessage(`${fetchedCollections.length}個のコレクションが見つかりました。`);
            }
        } catch (error) {
            console.error('Error fetching logs:', error);
            setError('コレクションの取得中にエラーが発生しました。');
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        console.log("useEffect triggered", { publicClient, userAddress }); // デバッグログ
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

                    {isLoading && <p>コレクションを取得中...</p>}
                    {error && <p className={styles.errorMessage}>{error}</p>}
                    {successMessage && <p className={styles.successMessage}>{successMessage}</p>}

                    {collections.length > 0 ? (
                        <div className={styles.collectionsGrid}>
                            {collections.map((collection, index) => (
                                <div key={index} className={styles.collectionCard}>
                                    <h3>{collection.name}</h3>
                                    <p>シンボル: {collection.symbol}</p>
                                    <p>タイプ: {collection.fileType}</p>
                                </div>
                            ))}
                        </div>
                    ) : (
                        <p className={styles.noCollections}>
                            {successMessage || 'まだコレクションがありません。新しいコレクションを作成しましょう！'}
                        </p>
                    )}
                </div>
            </main>
        </div>
    );
};

export default Custom;