import styles from './Notes.module.scss'
import { useEffect, useState, useRef } from 'react';
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

    //// INFINITE SCROLL

    const notesHolder = useRef<HTMLDivElement | null>(null);


    function handleScroll() {
        console.log("height",document.documentElement.scrollHeight); // “how tall the whole scrollable page is.”
        console.log("top",document.documentElement.scrollTop); // scroll value from top
        console.log("window",window.innerHeight); // height of the visible window (viewport)



        // So the actual content height checks vs scrollHeight + viewportHeight (+1px for some browser's logic)=> 
        // because maximum scroll + viewport is the place where we need new data ASAP
        // so it is triggering a load function
        // What is important: it may and it will trigger itself multiply times before the data is loaded cause the condition is still true
        // So we need 'loading' state or some sort of a cycle with await and check.

        console.log("scrollHeight:",notesHolder.current?.scrollHeight); // this should be inner container (msx losded hright)
        console.log("Top: ",notesHolder.current?.scrollTop); // this should be inner container (scroll count)
        console.log("window: ", window.innerHeight) // this should be top container ("viewport")



    }

    useEffect(() => {

        notesHolder.current?.addEventListener("scroll", handleScroll); // second parameter is the function that will be activated onscroll


    }, [])


    /////////////////////


    return (
        <div className={styles.componentContainer}>

            <h1>Notes</h1>

            <div className={styles.notesHolder} ref={notesHolder}>
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
                <button disabled>Refresh</button>
                <button disabled>Add</button>
                <button>backup</button>

            </div>
        </div>


    )
}

export default Notes;