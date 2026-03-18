import styles from "../styles/loadBar.module.css";
export default function LoadingBar() {
  return (
    <div className={styles.loader}>
        <p>Loading...</p>
    </div>
  );
}