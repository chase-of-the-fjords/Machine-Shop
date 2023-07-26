'use client'

import styles from './PasswordForm.module.css';

import { useState } from 'react';

export default function PasswordForm() {
    let [password, setPassword] = useState('');

    return (password == "1234" ||
    <div className={styles.screen}>
        <div className={styles.background}/>
        <div className={styles.password_box}>
            <h1 className={styles.password_text}>Enter Password</h1>
            <form><input autoFocus type="password" className={styles.input} autoComplete="off" onChange={e => setPassword(e.target.value)}></input></form>
        </div>
    </div>
    );
}