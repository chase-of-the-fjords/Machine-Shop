import styles from './Machine.module.css';

export default function Machine({data, update}) {
    async function updateMachine(id, state, update) {
        const postData = {
            method: "PATCH",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                id, state
            })
        }
        const res = await fetch(`${process.env.NEXT_PUBLIC_URL}/api/machineUpdate`, postData);
        if (res.status == 200) {
            update('state', state);
        } else {
            console.log("Error");
        }
    }

    let width = (data.width * 120) - 5;
    let height = (data.height * 120) - 5;
    let top = 5 + (data.ypos * 120);
    let left = 5 + (data.xpos * 120);

    return (
        <>
            <button 
                key={data.id}
                className={`${styles.machine} ${data.state == 1 && styles.bad_machine} ${data.state == 2 && styles.priority_machine}`}
                style={ { width: `${width}px`,
                          height: `${height}px`,
                          top: `${top}px` ,
                          left: `${left}px` } }
                onClick={
                    () => {
                        updateMachine(data.id, (data.state + 1) % 3, update);
                    }
                }
                >
                    <div className={`${styles.machine_name}`}>{data.name}</div>
            </button>
        </>
    )
}
