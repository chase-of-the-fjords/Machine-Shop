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
            }
        }
        const res = await fetch(`${process.env.NEXT_PUBLIC_URL}/api/machines`, postData);
        const response = await res.json();
        console.log("refresh");
        setMachines(response);
    }

    useEffect(() => {
        getMachines();
        getShops();
    }, [machines]);

    
    function updateMachine(id, entry, value) {
        console.log(id);

        let editedModel = machines;
        
        for (let i = 0; i < editedModel.length; ++i) {
            if (editedModel[i]['id'] == id) {
                editedModel[i][entry] = value;
                //setMachines(editedModel);
                console.log(machines);
                return;
            }
        }
    }

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
                    update={(id, entry, value) => {updateMachine(id, entry, value)}} 
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
