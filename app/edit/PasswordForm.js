'use client'

import styles from './PasswordForm.module.css';

import { useState, useEffect } from 'react';

export default function PasswordForm( {setUser} ) {
    const [password, setPassword] = useState('');
    const [unlocked, setUnlocked] = useState(false);

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
    }, [password])

    return (unlocked ||
    <div className={styles.screen}>
        <div className={styles.background}/>
        <div className={styles.password_box}>
            <h1 className={styles.password_text}>Enter Password</h1>
            <form><input autoFocus type="password" className={styles.input} autoComplete="off" onChange={e => setPassword(e.target.value)}></input></form>
        </div>
    </div>
    );
}