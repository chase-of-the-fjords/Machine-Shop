import Machine from './Machine';
import styles from './Building.module.css';

// Individual Building
export default function Building({data, machines}) {
    return (
        <div className={styles.buildingContainer}
        style={{
            width: `${ (data.width * 120) + 100 }px`
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
                        return <Machine key={machine.code} data={machine} />
                    })
                }
            </div>
        </div>
    );
}
