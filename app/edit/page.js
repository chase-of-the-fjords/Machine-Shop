// Imports the shop component.
import Shop from '../modules/Shop';

// The style sheet for the main page.
import styles from '../modules/App.module.css';
import PasswordForm from './PasswordForm';

// The function for the full application.
export default function App() {
    return (<>
            <div className={styles.edit_background}></div>
            <div>
                { /* The menu at the top of the screen. Likely to be updated later. */ }
                <Menu></Menu>
                { /* The rest of the machine shop. */ }
                <Shop type="edit"></Shop>
            </div>
            <PasswordForm></PasswordForm>
        </>
    );
}

// The menu bar component. So far, just an H1 title with an underline.
function Menu() {
    return <h1 className={styles.menu}>Origin Golf Machine Shop (Edit)</h1>
}
