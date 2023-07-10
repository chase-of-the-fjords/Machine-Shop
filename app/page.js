import Shop from './modules/Shop';

import styles from './modules/App.module.css';

// The full main page
export default function App() {
    return (
        <>
            <Menu></Menu>
            <Shop></Shop>
        </>
    );
}

// Menu Bar
function Menu() {
    return <h1 className={styles.menu}
    style={{
        
    }}>Origin Golf Machine Shop</h1>
}
