import Machine from './Machine';
import styles from './Building.module.css';
import { useState, useEffect } from 'react';
import { useSpring, animated } from '@react-spring/web'

// Individual Building
export default function Building({data, machines, update, screenWidth, position}) {
    const springs = useSpring({
        from: {
            opacity: 0
        },
        to: {
            opacity: 1
        },
    })

    return (
        <animated.div 
        className={styles.buildingContainer}
        style={{
            width: `${ (data.width * 120) + 100 }px`,
            left: `${position}px`,
            ...springs,
        }}>
            <h3 className={styles.header}>{data.name}</h3>
            <div
            className={styles.building}
            style={{
                width: `${ data.width * 120 }px`,
                height: `${ data.height * 120 }px`
            }}>
                {
                    machines.map((machine) => {
                        return <Machine key={machine.id} data={machine} update={(entry, value) => update(machine.id, entry, value)} />
                    })
                }
            </div>
        </animated.div>
    );
}
