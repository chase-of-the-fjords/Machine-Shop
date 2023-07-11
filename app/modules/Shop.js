'use client'

import Building from './Building';

import { useEffect } from 'react';
import { useState } from 'react';

import styles from './App.module.css';

export default function Shop() {
    const [shops, setShops] = useState([]);
    const [machines, setMachines] = useState([]);

    async function getShops() {
        const postData = {
            method: "GET",
            headers: {
                "Content-Type": "application/json",
            }
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

    const timer = setTimeout(() => {
        getShops();
        getMachines();
    }, 1000);

    return (
        <div className={styles.shop}>
            {
                shops
                .filter((shop) => {
                    return (shop.enabled == 1);
                })
                .map((shop) => {
                    return <Building 
                    key={shop.code} 
                    data={shop}
                    update={() => {
                        getShops();
                        getMachines();
                    }} 
                    machines={
                        machines.filter((machine) => {
                            return (machine.shop == shop.code);
                        })
                    }/>
                })
            }
        </div>
    )
}