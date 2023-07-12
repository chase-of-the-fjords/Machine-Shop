'use client'

import Building from './Building';

import { useEffect } from 'react';
import { useState } from 'react';

import styles from './App.module.css';

export default function Shop() {
    const [shops, setShops] = useState([]);
    const [machines, setMachines] = useState([]);

    const [screenWidth, setWidth] = useState(window.innerWidth);

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
        setMachines(response);
    }
    
    useEffect(() => {
        getMachines();
        getShops();
        window.addEventListener("resize", () => {
            setWidth(window.innerWidth);
            generatePositions();
        });
        return () => window.removeEventListener("resize", () => {
            setWidth(window.innerWidth);
            generatePositions();
        });
    }, [machines]);

    
    function updateMachine(id, entry, value) {

        let editedModel = machines;
        
        for (let i = 0; i < editedModel.length; ++i) {
            if (editedModel[i]['id'] == id) {
                editedModel[i][entry] = value;
                //setMachines(editedModel);
                return;
            }
        }
    }

    let totalWidth = 0;
    let positions = [];

    function generatePositions() {
        totalWidth = 0;
        let x = 0;

        // Find the total width
        for (let i = 0; i < shops.length; i++) {
            if (shops[i].enabled) totalWidth += 100 + (shops[i].width * 120);
        }

        for (let i = 0; i < shops.length; i++) {
            if (shops[i].enabled) {
                positions[shops[i].code] = x + ((screenWidth / 2) - (totalWidth / 2));
                x += (shops[i].width * 120) + 100;
            }
        }
    }

    generatePositions();

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
                    screenWidth={screenWidth}
                    position={positions[shop.code]}
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
