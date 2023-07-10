import styles from './Machine.module.css';

export default function Machine({data, update}) {
    async function updateMachine(id, state) {
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
        //const response = await res.json();
    }

    let width = (data.xdim * 120) - 5;
    let height = (data.ydim * 120) - 5;
    let top = 5 + (data.ypos - 1) * 120;
    let left = 5 + (data.xpos - 1) * 120;

    return (
        <>
            <button 
                key={data.id}
                className={`${styles.machine} ${data.state == 0 || styles.bad_machine}`}
                style={ { width: `${width}px`,
                          height: `${height}px`,
                          top: `${top}px` ,
                          left: `${left}px` } }
                onClick={
                    () => {
                        updateMachine(data.id, (data.state + 1) % 2);
                        update();
                    }
                }
                >
                    {data.name}
            </button>
        </>
    )
}
