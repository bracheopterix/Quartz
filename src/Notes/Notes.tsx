import styles from './Notes.module.scss'
import { useEffect, useState, useRef } from 'react';
//Components
import Note from './Note'
//Types

/// TYPES ///
// type NotesType = string[]
export type NoteType = {
    created_at: string,
    text: string,
    id:number,
};


type NotesParams = {
    serverAddress: string,
}


/// Notes
//  The infinite scroll in the way it is existing now is eating all the CPU
//  The right way to do it - to have only some of them mounted
//  I believe it is done by Pages
//  But I still does not know how to unmount with smoothness
//  Or without all collapsing by the height of unexisting element
//  Maybe you don't have full scroll on the go
//  And the scrolling motion just changing the mounted page with some cool animation depending it went uo or down???
//  It would be cool for the book in sertar's style
//  



///  ----  ///

function Notes(params: NotesParams) {

    const [notes, setNotes] = useState<NoteType[] | undefined>(undefined);
    // const [dataLoading, SetDataLoading] = useState<Boolean>(false);
    const dataLoading = useRef<boolean>(false);
    const [sliceSize, setSliceSize] = useState<number>(10);
    const [page, setPage] = useState(1);
    const pageRef = useRef(1);

    

    useEffect(() => {
        const container = outerNotesContainer.current;
        if (!container) return;
    
        container.addEventListener("scroll", handleScroll);
        return () => container.removeEventListener("scroll", handleScroll);
    }, []);

    useEffect(() => {

        // mountScrollListener();

        // mounting scroll listener

        

        // if (dataLoading.current) return; // stopping from triggering twice

        // dataLoading.current = true;


        // fetch(params.serverAddress + '/api/notes') // getting notes
        //     .then(res => res.json())
        //     .then(data => setNotes(data))
        //     .catch(error => console.log(error));

        if (page === 1) {

            addNextNotesSlice()
                // .then(res => res.json())
                // .then(data => setNotes(data))
                // .then(data => console.log(`data:, ${data}`))
                // .then(() => console.log(`notes: ${notes}`))
                .catch(error => console.log(`Loading first slice of data failed: ${error}`));
        }

    }, []);

    

    // useEffect(() => {
    //     console.log(`Notes triggered:`, notes);
    // }, [notes])





    // I tried to fake awaiting a fetch with promise. Failed


    ///

    //// INFINITE SCROLL

    const outerNotesContainer = useRef<HTMLDivElement | null>(null); // for now it is outer container
    const innerNotesContainer = useRef<HTMLDivElement | null>(null); // for now it is all notes


    async function addNextNotesSlice() {

        if (dataLoading.current) return; // защита
        dataLoading.current = true;

        try {

            const fetchedNotes = await fetch(
                `${params.serverAddress}/api/notes/slice?page=${pageRef.current}&slice_size=${sliceSize}`
            );
            const newSlice = await fetchedNotes.json();
            if (newSlice.length > 0) {
                setNotes(prev => prev ? prev.concat(newSlice) : newSlice);
                pageRef.current += 1;           // against state closure
                console.log('pageref = ', pageRef.current);
                // setPage(pageRef.current);       // against state closure
            } else {
                console.log("There is no more data to fetch");
            }

        }
        catch (error) {
            console.log(`Loading next slice failed`, error);
        } finally {
            dataLoading.current = false;
        }
        // const fetchedNotes = await fetch(params.serverAddress + `/api/notes/slice?page=${page}&slice_size=${sliceSize}`, {
        //     method: "GET",
        // })
        //getting next slice of data

        // const newSlice = (await fetchedNotes.json());
        //parsing

        // console.log(`newSlice:`, newSlice);

        // setNotes(prev => prev ? prev.concat(newSlice) : newSlice);
        //adding to the content visuals
        // setPage(prev => prev + 1);
        //updating the page count

    }


    async function handleScroll() {

        // if we are using all the window as our outer container, window.innerHeight will cover it's height.
        console.log('Fetching page: ', pageRef.current, 'offset: ', page * sliceSize);

        if(!innerNotesContainer.current || !outerNotesContainer.current) return;

        if (outerNotesContainer.current?.scrollTop + outerNotesContainer.current?.offsetHeight + 1 >= innerNotesContainer.current?.scrollHeight) {
            // ^ we are equating scrolling position in the main (outer) container + it's "viewport" height with overall inner container height
            // that mean that we are touched the bottom when the top-scroll number takes its maximum value (being one viewport heigher than the content height)
            //trigger to load next card

            // SetDataLoading(true); // multiple triggering protection
            // console.log(`I am loading new data`);
            await addNextNotesSlice();

            // console.log(`Loading ended`);

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