import Link from 'next/link';
import Image from 'next/image';
import styles from '../styles/template.module.css'; // CSSファイルをインポート

const Template = () => {
    return (
        <>
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
                            src="/NoiseWave.png"
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
                            src="/Fantasia.png"
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
