// This is an interactive component, so it's a client component.
'use client'

// Imports the shop component.
import styles from './Admin.module.css'

import Link from 'next/link';

/**
 * The default export for the edit page.
 * 
 * @returns JSX representation of the edit page.
 */
export default function App() {

        // JSX (RETURN VALUE)

    return (<>
        <h1 className={styles.header}>Admin Tools</h1>
        <div className={styles.linkbox}><Link className={styles.link} href="./">Shop Display</Link></div>
        <div className={styles.linkbox}>
            <div className={styles.linkbox}>
                <Link className={styles.link} href="./edit">{'>'} Edit Shop</Link>
            </div>
            <div className={styles.linkbox}>
                <Link className={styles.link} href="./history">{'>'} History Log</Link>
            </div>
            <div className={styles.linkbox}>
                <Link className={styles.link} href="./moment">{'>'} Moment History</Link>
            </div>
        </div>
        <div className={styles.linkbox}><Link className={styles.link} href="./admin/timeclock">Timeclock</Link></div>
    </>
    );
}

// The menu bar component.
function Menu() {

    return <h1 className={styles.menu}>Origin Golf Machine Shop</h1>

}
