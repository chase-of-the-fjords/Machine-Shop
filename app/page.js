import machines from './data/machines.json';

import Machine from './modules/Machine';
import Building from './modules/Building';

import styles from './modules/App.module.css';

let shops = machines.shops;

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

function Shop() {
    return (
        <div className={styles.shop}>
            {
                shops.map((shop) => {
                    return <Building key={shop.code} data={shop} />
                })
            }
        </div>
    )
}