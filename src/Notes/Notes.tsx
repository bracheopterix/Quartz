import styles from './Notes.module.scss'
import { useEffect, useState } from 'react';
import Note from './Note'


type Notes = string[];

function Notes() {
    const testItem: Notes = ["item1", "item2", "item3"];
    localStorage.setItem('testItem', JSON.stringify(testItem));

    const [Notes, setNotes] = useState<Notes | undefined>(undefined);

    useEffect(() => {
        const gotNotes = localStorage.getItem("testItem");
        if (gotNotes) {
            let parsedNotes: Notes;

            try {
                parsedNotes = JSON.parse(gotNotes);
                setNotes(parsedNotes);
                
            } catch (error) {
                console.log("Broke, assigning parsed Notes from LS", error);
            }
        }
        else{
            console.log("Failed to get Notes", gotNotes);
        }

    }, []);

    return (
        <div className={styles.componentContainer}>

            <div className={styles.notesHolder}>
            <h1>Notes</h1>

            <Note />

            {Notes?.map((element,index)=>(
                <Note/>
            ))}

           
            
            </div>

            
            <button>Refresh</button>
        </div>


    )
}

export default Notes;