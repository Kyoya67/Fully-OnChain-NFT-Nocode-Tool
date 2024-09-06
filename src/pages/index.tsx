import { useState, useEffect } from 'react';
import { useAccount } from 'wagmi';
import Head from 'next/head';
import Link from 'next/link';
import Header from '../component/header';
import Footer from '../component/footer';
import styles from '../styles/Home.module.css';

const Home = () => {
  const [selectedOption, setSelectedOption] = useState<string | null>(null);
  const { isConnected } = useAccount();
  const [isSmallScreen, setIsSmallScreen] = useState(false);

  useEffect(() => {
    const handleResize = () => {
      setIsSmallScreen(window.innerWidth <= 1100);
    };

    // 初期設定
    handleResize();

    // リサイズイベントリスナーの追加
    window.addEventListener('resize', handleResize);

    // クリーンアップでイベントリスナーの削除
    return () => {
      window.removeEventListener('resize', handleResize);
    };
  }, []);

  const handleOptionSelect = (option: string) => {
    setSelectedOption(option);
    console.log(`Selected option: ${option}`);
  };

  return (
    <div className={styles.container}>
      <Head>
        <title>フルオンチェーンNFTクリエーター</title>
        <meta name="description" content="フルオンチェーンでNFTを作成できるプラットフォームです。" />
        <link href="https://fonts.googleapis.com/css2?family=Poppins:wght@400;700&display=swap" rel="stylesheet" />
        <link href="https://fonts.googleapis.com/css2?family=Noto+Sans+JP:wght@400;700&display=swap" rel="stylesheet" />
        <link href="https://fonts.googleapis.com/css2?family=Dela+Gothic+One&display=swap" rel="stylesheet" />
        <link href="https://fonts.googleapis.com/css2?family=Dela+Gothic+One&family=Noto+Sans+JP:wght@100..900&family=Shippori+Antique&display=swap" rel="stylesheet" />
        <meta property="og:title" content="フルオンチェーンNFT Nocode Tool" />
        <meta property="og:description" content="技術的な知識がなくてもフルオンチェーンNFTを作成できるNocode Tool" />
        <meta property="og:image" content="../../public/ogp.png" />
        <meta property="og:url" content="https://fully-on-chain-nft-nocode-tool.vercel.app/" />
        <meta property="og:type" content="website" />
      </Head>

      <Header />

      <main className={styles.main}>
        <h1 className={styles.title}>
          {isSmallScreen ? 'フルオンチェーンNFT\nクリエーター' : 'フルオンチェーンNFTクリエーター'}
        </h1>

        {isConnected ? (
          <>
            <p className={styles.description}>
              作成方法を選択してください
            </p>
            <div className={styles.grid}>
              <Link href="/custom">
                <div
                  className={styles.card}
                  onClick={() => handleOptionSelect('custom')}
                >
                  <h3>カスタムNFT作成 &rarr;</h3>
                  <p>独自の作品コードでフルオンチェーンNFTを作成します。</p>
                </div>
              </Link>

              <Link href="/template">
                <div
                  className={styles.card}
                  onClick={() => handleOptionSelect('template')}
                >
                  <h3>テンプレートNFT作成 &rarr;</h3>
                  <p>既存のテンプレートを使用してNFTをカスタマイズします。</p>
                </div>
              </Link>
            </div>
          </>
        ) : (
          <p className={styles.description}>
            ウォレットを接続してNFTを作成してください。
          </p>
        )}
      </main>

      <Footer />
    </div>
  );
};

export default Home;
