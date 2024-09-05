import { useState } from 'react';
import { writeContract, waitForTransactionReceipt } from '@wagmi/core';
import { usePublicClient } from 'wagmi';
import { config } from '../wagmi';
import { abi as factoryABI, address as factoryAddress } from '../abi/factoryABI';

interface Collection {
    name: string;
    symbol: string;
    fileType: string;
    address: `0x${string}`;
}

export const useNFTOperations = (userAddress: `0x${string}` | undefined) => {
    const [isLoading, setIsLoading] = useState(false);
    const [isSendingTx, setIsSendingTx] = useState(false);
    const [error, setError] = useState('');
    const [successMessage, setSuccessMessage] = useState('');
    const publicClient = usePublicClient();

    const handleMint = async (collectionName: string, symbolName: string, choice: string) => {
        setIsSendingTx(true);
        setError('');

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
            setSuccessMessage('コレクションが正常に作成されました。');
        } catch (error) {
            console.error('Error minting contract:', error);
            setError('コントラクト作成に失敗しました。');
        } finally {
            setIsSendingTx(false);
        }
    };

    const fetchEventLogs = async (): Promise<Collection[]> => {
        setIsLoading(true);
        setError('');
        setSuccessMessage('');

        if (!publicClient || !userAddress) {
            setError('クライアントまたはユーザーアドレスが見つかりません。');
            setIsLoading(false);
            return [];
        }

        try {
            const latestBlock = await publicClient.getBlockNumber();
            const fromBlock = BigInt(6635572);

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
                },
                args: {
                    creator: userAddress
                },
                fromBlock: fromBlock,
                toBlock: latestBlock,
            });

            const filteredLogs = logs.filter(log => log.args.creator === userAddress);

            if (filteredLogs.length === 0) {
                return [];
            }

            const fetchedCollections = filteredLogs.map(log => ({
                name: log.args.name ?? 'Unknown Name',
                symbol: log.args.symbol ?? 'Unknown Symbol',
                fileType: log.args.fileType ?? 'Unknown Type',
                address: log.args.contractAddress as `0x${string}`,
            }));

            const reversedCollections = fetchedCollections.reverse();
            setSuccessMessage(`${reversedCollections.length}個のコレクションが見つかりました。`);
            return reversedCollections;
        } catch (error) {
            console.error('Error fetching logs:', error);
            setError('コレクションの取得中にエラーが発生しました。');
            return [];
        } finally {
            setIsLoading(false);
        }
    };

    return { handleMint, fetchEventLogs, isLoading, isSendingTx, error, successMessage };
};