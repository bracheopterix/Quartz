import styles from './Notes.module.scss'
import { useEffect, useState } from 'react';
//Components
import Note from './Note'
//Types
import type { NotesType, NoteType } from '../Types/Notes';



type NotesParams = {
    serverAddress: string,
}


function Notes(params: NotesParams) {

    const [Notes, setNotes] = useState<NotesType | undefined>(undefined);

    useEffect(() => {


        fetch(params.serverAddress + '/api/notes') // getting notes
            .then(res => res.json())
            .then(data => setNotes(data))
            .catch(error => console.log(error));

    }, []);


    return (
        <div className={styles.componentContainer}>

            <h1>Notes</h1>

            <div className={styles.notesHolder}>
                <div className={styles.scrollWise}>
                    
                </div>



                {Notes?.map((element: NoteType, index) => (
                    <Note
                        key={index}
                        element={element}
                    />
                ))}



            </div>

            <div className={styles.buttonHolder}>
                <button>Refresh</button>
                <button>Add</button>

            </div>
        </div>


    )
}

export default Notes;