import React from 'react'
import styles from "./Footer.module.css";
import { assets } from '../assets/frontend_assets/assets';
import { FaGithub } from "react-icons/fa";
const Footer = () => {
  return (
    <div className={styles["footer-container"]}>
      <footer className={styles.footer}>
        <div className={styles.left}>
          <a
            href="http://www.github.com/hardikcode-creator"
            className={styles.githubLink}
            target="_blank"
            rel="noopener noreferrer"
          >
            <FaGithub  />
          </a>
        </div>
        <div className={styles.centerText}>
          Made with 🩶 by  Hardik © 2025 BITSbids
        </div>
      </footer>
    </div>
  );
};

export default Footer;
