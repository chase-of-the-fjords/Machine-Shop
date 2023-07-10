'use client'

import Machine from './modules/Machine';
import Building from './modules/Building';

import styles from './modules/App.module.css';

import { useEffect } from 'react';
import { useState } from 'react';

// The full main page
export default function App() {
    const [shops, setShops] = useState([]);
    const [machines, setMachines] = useState([]);

    async function getShops() {
        const postData = {
            method: "GET",
            headers: {
                "Content-Type": "application/json",
            },
            request: "machines",
        }
        const res = await fetch(`${process.env.NEXT_PUBLIC_URL}/api/shops`, postData);
        const response = await res.json();
        setShops(response);
    }

    async function getMachines() {
        const postData = {
            method: "GET",
            headers: {
                "Content-Type": "application/json",
            },
        }
        const res = await fetch(`${process.env.NEXT_PUBLIC_URL}/api/machines`, postData);
        const response = await res.json();
        setMachines(response);
    }

    useEffect(() => {
        getShops();
        getMachines();
    }, []);

    return (
        <>
            <Menu></Menu>
            <Shop shops={shops} machines={machines}></Shop>
        </>
    );
}

// Menu Bar
function Menu() {
    return <h1 className={styles.menu}
    style={{
        
    }}>Origin Golf Machine Shop</h1>
}

function Shop({shops, machines}) {
    return (
        <div className={styles.shop}>
            {
                shops
                .filter((shop) => {
                    return (shop.enabled == 1);
                })
                .map((shop) => {
                    return <Building key={shop.code} data={shop} machines={
                        machines.filter((machine) => {
                            return (machine.shop == shop.code);
                        })
                    }/>
                })
            }
        </div>
    )
}