import { ConnectButton } from "@rainbow-me/rainbowkit";
import styles from "../styles/header.module.css";

const Header = () => {
    return(
        <header className={styles.header}>
        <ConnectButton />
      </header>
    )
}

export default Header;