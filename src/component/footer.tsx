import styles from "../styles/footer.module.css";

const Footer = () => {
    return(
        <footer className={styles.footer}>
        <a href="https://github.com/yourusername/yourrepository" target="_blank" rel="noopener noreferrer">
          GitHub
        </a>
        <a href="https://twitter.com/yourtwitterhandle" target="_blank" rel="noopener noreferrer">
          Twitter
        </a>
      </footer>
    )
}

export default Footer;