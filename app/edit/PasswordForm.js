// This is an interactive component, so it's a client component.
'use client'

// Style sheets.
import styles from './PasswordForm.module.css';

// Basic React hooks.
import { useState, useEffect } from 'react';

/**
 * PASSWORD FORM DEFAULT EXPORT
 * 
 * @returns The export for the form.
 */
export default function PasswordForm( {setUser} ) {

    // Hooks for the password and whether it's unlocked.
    const [password, setPassword] = useState('');
    const [unlocked, setUnlocked] = useState(false);

    // Updates the user if the password matches any of the following.
    useEffect(() => {

        // Kevin
        if (password == "4432") {
            setUser(1);
            setUnlocked(true);
        }

        // Chase
        if (password == "april") {
            setUser(2);
            setUnlocked(true);
        }

        // Ernie
        if (password == "1973") {
            setUser(3);
            setUnlocked(true);
        }

        // Rocky
        if (password == "ykcor") {
            setUser(4);
            setUnlocked(true);
        }

    }, [password])

        // JSX (RETURN VALUE) - only displays if locked.

    return (unlocked ||

        <div className={styles.screen}>

            {/* BACKGROUND */}
            <div className={styles.background}/>

            {/* RIGHT MENU */}
            <div className={styles.right_bar}>

                {/* HOME BUTTON */}
                <div className={styles.right_button} title="Return to Home">
                    <a href="./">
                        <img className={styles.button_image} src="/icons/google/home.svg" />
                    </a>
                </div>

            </div>

            {/* PASSWORD BOX */}
            <div className={styles.password_box}>

                {/* PROMPT */}
                <h1 className={styles.prompt}>Enter Password</h1>

                {/* INPUT */}
                <form onSubmit={e => { e.preventDefault(); }} ><input autoFocus type="password" className={styles.input} autoComplete="off" onChange={e => setPassword(e.target.value)} /></form>

            </div>

        </div>

    );

}
