import Link from 'next/link';
import Head from 'next/head';
import Image from 'next/image';
import styles from '../styles/template.module.css'; // CSSファイルをインポート

const Template = () => {
    return (
        <>
            <Head>
                <title>テンプレートNFT - フルオンチェーンNFTクリエーター</title>
                <meta name="description" content="好きな色でNFTを作ることが出来ます" />
            </Head>

            <h1 className={styles.title}>テンプレートNFT</h1>
            <div className={styles.container}>
                <Link href="/triplehelix" className={styles.link}>
                    <div className={styles.item}>
                        <Image
                            src="/triplehelix.png"
                            alt="TripleHelix"
                            layout="responsive"
                            width={300}
                            height={300}
                            className={styles.image}
                        />
                        <div className={styles.name}>TripleHelix</div>
                    </div>
                </Link>
                <Link href="/noisewave">
                    <div className={styles.item}>
                        <Image
                            src="/noisewave.png"
                            alt="NoiseWave"
                            layout="responsive"
                            width={300}
                            height={300}
                            className={styles.image}
                        />
                        <div className={styles.name}>NoiseWave</div>
                    </div>
                </Link>
                <Link href="/fantasia">
                    <div className={styles.item}>
                        <Image
                            src="/fantasia.png"
                            alt="Fantasia"
                            layout="responsive"
                            width={300}
                            height={300}
                            className={styles.image}
                        />
                        <div className={styles.name}>Fantasia</div>
                    </div>
                </Link>
            </div>
        </>
    );
}

export default Template;
