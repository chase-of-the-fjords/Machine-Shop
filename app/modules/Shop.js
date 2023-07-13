'use client'

import Building from './Building';

import { useEffect } from 'react';
import { useState } from 'react';

import styles from './App.module.css';

export default function Shop() {
    const [shops, setShops] = useState([]);
    const [machines, setMachines] = useState([]);
    const [jobs, setJobs] = useState([]);

    async function getShops() {
        const postData = {
            method: "GET",
            headers: {
                "Content-Type": "application/json",
                "Access-Control-Allow-Origin": '*',
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
                "Access-Control-Allow-Origin": '*',
            }
        }
        const res = await fetch(`${process.env.NEXT_PUBLIC_URL}/api/machines`, postData);
        const response = await res.json();
        setMachines(response);
    }

    async function getJobs() {
        const postData = {
            method: "GET",
            headers: {
                "Content-Type": "application/json",
                "Access-Control-Allow-Origin": '*',
            }
        }
        const res = await fetch(`${process.env.NEXT_PUBLIC_URL}/api/jobs`, postData);
        const response = await res.json();
        setJobs(response);
    }

    function update() {
        getMachines();
        getShops();
        getJobs();
    }
    
    useEffect(() => {
        getMachines();
        getShops();
        getJobs();

        const interval = setInterval(() => {
            getMachines();
            getShops();
            getJobs();
        }, 30000);

        return () => clearInterval(interval);
    }, []);

    return (
        <div className={styles.shop}>
            {
                shops
                .filter((shop) => {
                    return true;
                })
                .map((shop) => {
                    return <Building 
                    key={shop.code} 
                    data={shop}
                    machines={
                        machines.filter((machine) => {
                            return (machine.shop == shop.code);
                        })
                    }
                    jobs={jobs}
                    update={update} />
                })
            }
        </div>
    )
}
