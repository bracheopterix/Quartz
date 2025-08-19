// import { useEffect, useState } from 'react';
import styles from './Notes.module.scss'


type NoteParams = {
    element: string,
}

function Note(params:NoteParams) {




    return (
        <div className={styles.note}>

            <div>{params.element}</div>


        </div>
    )
}

export default Note;