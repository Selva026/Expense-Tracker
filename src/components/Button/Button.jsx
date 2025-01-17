import styles from '../Button/Button.module.css';

function Button ({ type = "button", handleClick, style, shadow, children }) {
    return(
        <button
        type={type}
        onClick={handleClick}
        className={`${styles.button} ${styles[style]} ${shadow && styles.shadow}`}
    >
        {children}
    </button>

    )
}

export default Button;