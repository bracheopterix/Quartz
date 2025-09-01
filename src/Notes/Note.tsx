// import { useEffect, useState } from 'react';
import styles from './Notes.module.scss'
import type { NoteType } from './Notes';


type NoteParams = {
    element: NoteType,
}

function Note(params: NoteParams) {




    return (
        <div className={styles.note}>

            <div>
                <p>
                    <strong><span>Created at:</span> <span>{params.element.created_at}</span></strong>
                </p>
            </div>
            <p>
            Id = {params.element.id}, text: {params.element.text}
            </p>


        </div>
    )
}

export default Note;