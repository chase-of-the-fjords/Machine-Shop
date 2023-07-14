import styles from './InformationBox.module.css';

import { animated, useSpring } from 'react-spring';

export default function InformationBox() {
    /*const springs = useSpring({
        from: {
            top: '-120%',
            opacity: 0
        },
        to: {
            top: '10%',
            opacity: 1
        },
    })*/

    return (
        <div className={styles.popup_div}>
            <div className={styles.background}/>
            <div className={styles.info_box}>
                test
            </div>
        </div>
    )
}