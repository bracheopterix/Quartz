import styles from './Notes.module.scss'
import { useEffect, useState, useRef } from 'react';
//Components
import Note from './Note'
//Types

/// TYPES ///

export type NoteType = {
    created_at: string,
    text: string,
    id: number,
};

///  ----  ///

type NotesParams = {
    serverAddress: string,
}


function Notes(params: NotesParams) {

    const [notes, setNotes] = useState<NoteType[] | undefined>(undefined);
    const dataLoading = useRef<boolean>(false);
    const [sliceSize, setSliceSize] = useState<number>(10); // changable to make a UI for it
    const pageRef = useRef(1);


    useEffect(() => {
        const container = outerNotesContainer.current;
        if (!container) return;

        container.addEventListener("scroll", handleScroll);
        return () => container.removeEventListener("scroll", handleScroll);
    }, []);

    useEffect(() => {

        if (pageRef.current === 1) {

            addNextNotesSlice()
                // .then(() => pageRef.current += 1)
                .catch(error => console.log(`Loading first slice of data failed: ${error}`));
        }

        setSliceSize((prev) => prev);

    }, []);


    //// INFINITE SCROLL

    const outerNotesContainer = useRef<HTMLDivElement | null>(null); // for now it is outer container
    const innerNotesContainer = useRef<HTMLDivElement | null>(null); // for now it is all notes


    async function addNextNotesSlice() { // Loading new content

        if (dataLoading.current) return; // protection from multiple triggers 
        dataLoading.current = true;      // protection from multiple triggers 

        try {
            const fetchedNotes = await fetch(
                `${params.serverAddress}/api/notes/slice?page=${pageRef.current}&slice_size=${sliceSize}`
            );
            const newSlice = await fetchedNotes.json();
            if (newSlice.length > 0) {
                setNotes(prev => prev ? prev.concat(newSlice) : newSlice);
                // pageRef.current += 1; // updating page count, Ref is against state closure - not State
            } else {
                console.log("There is no more data to fetch");
            }
        }
        catch (error) {
            console.log(`Loading next slice failed`, error);
        } finally {
            dataLoading.current = false;  // protection from multiple triggers 
            pageRef.current+=1;

        }
    }


    async function handleScroll() { // Triggers content load at the bottom of the content

        console.log('Fetching page: ', pageRef.current, 'offset: ', pageRef.current * sliceSize);

        if (!innerNotesContainer.current || !outerNotesContainer.current) return;
        // if we are using all the window as our outer container, window.innerHeight will cover it's height.
        if (outerNotesContainer.current?.scrollTop + outerNotesContainer.current?.offsetHeight + 1 >= innerNotesContainer.current?.scrollHeight) {
            // ^ we are equating scrolling position in the main (outer) container + it's "viewport" height with overall inner container height
            // that mean that we are touched the bottom when the top-scroll number takes its maximum value (being one viewport heigher than the content height)
            //trigger to load next card
            await addNextNotesSlice();
        }
        else {
            console.log(`nah`);
        }

    }




    /////////////////////


    return (
        <div className={styles.componentContainer} >

            <h1>Notes</h1>
            <div className={styles.notesContainer} ref={outerNotesContainer}>
                <div className={styles.notesHolder} ref={innerNotesContainer}>
                    <div className={styles.scrollWise}>

                    </div>

                    {notes?.map((element: NoteType) => (
                        <Note
                            key={element.id}
                            element={element}
                        />
                    ))}

                </div>
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