import styles from './Notes.module.scss'
import { useEffect, useState, useRef } from 'react';
//Components
import Note from './Note'
//Types

/// TYPES ///
// type NotesType = string[]
type NoteType = string;


type NotesParams = {
    serverAddress: string,
}

///  ----  ///

function Notes(params: NotesParams) {

    const [Notes, setNotes] = useState<NoteType[] | undefined>(undefined);
    const [DataLoading,SetDataLoading] = useState<Boolean>(false);

    useEffect(() => {


        fetch(params.serverAddress + '/api/notes') // getting notes
            .then(res => res.json())
            .then(data => setNotes(data))
            .catch(error => console.log(error));

    }, []);

    /// FALSE DATA  ///


    function* getNextPortionOfData(data: NoteType[] | undefined, slice: number) {
        //^Hello, I am a generator!
        let i = 0;
        if (data) {
            while (i < data.length) {
                yield data.slice(i, i + slice);
                i += slice;
            }
            yield `Array's gone`
        }
        else {
            yield "Can't yield anymore";
        }


    }

    /// let the client decide whats part it wants from the server!!!


    const testArray = ['1', '2', '3', '4', '5', '6', '7', '8', '9', '10'];
    // a test array cause Notes are not loaded from the beginning

    const genNextPortionOfData = getNextPortionOfData(testArray, 4);

    // const testPromise = async () => new Promise((req, res) => {
    //     return genNextPortionOfData.next().value;
    // })




    // I tried to fake awaiting a fetch with promise. Failed


    ///

    //// INFINITE SCROLL

    const outerNotesContainer = useRef<HTMLDivElement | null>(null); // for now it is outer container
    const innerNotesContainer = useRef<HTMLDivElement | null>(null); // for now it is all notes

    async function addNextNotesSlice(sliceValue: number) {

        const fetchedNotes = await fetch(params.serverAddress + `/api/notes/slice?slice=${sliceValue}`, {
            method: "GET",
        })

        const newSlice = (await fetchedNotes.json());

        setNotes(prev => prev?.concat(newSlice.value));


    }


    async function handleScroll() {
        // So the actual content height checks vs scrollHeight + viewportHeight (+1px for some browser's logic)=> 
        // because maximum scroll + viewport is the place where we need new data ASAP
        // so it is triggering a load function
        // What is important: it may and it will trigger itself multiply times before the data is loaded cause the condition is still true
        // So we need 'loading' state or some sort of a cycle with await and check.

        // if we are using all the window as our outer container, window.innerHeight will cover it's height.


        // console.log("scrollHeight:", innerNotesContainer.current?.scrollHeight); // this should be inner container (msx losded hright)
        // console.log("Top: ", outerNotesContainer.current?.scrollTop); // this should be inner container (scroll count)
        // console.log("window: ", outerNotesContainer.current?.offsetHeight) // this should be top container ("viewport")

        if (!DataLoading && outerNotesContainer.current && innerNotesContainer.current && outerNotesContainer.current?.scrollTop + outerNotesContainer.current?.offsetHeight + 1 >= innerNotesContainer.current?.scrollHeight) {
            // ^ we are equating scrolling position in the main (outer) container + it's "viewport" height with overall inner container height
            // that mean that we are touched the bottom when the top-scroll number takes its maximum value (being one viewport heigher than the content height)
            //trigger to load next card

            SetDataLoading(true);
            console.log(`I am loading new data`);
            await addNextNotesSlice(4);
            SetDataLoading(false);
            console.log(`Loading ended`);



            // here we have a problem, cause the call for the content will fire multiple times before the content full load (as we still on the bottom of the content yet)
            // so we should have some protection here

        }
        else {
            console.log(`nah`);
        }

    }

    useEffect(() => {

        outerNotesContainer.current?.addEventListener("scroll", handleScroll); // second parameter is the function that will be activated onscroll


    }, [Notes])


    /////////////////////


    return (
        <div className={styles.componentContainer} >

            <h1>Notes</h1>
            <div className={styles.notesContainer} ref={outerNotesContainer}>
                <div className={styles.notesHolder} ref={innerNotesContainer}>
                    <div className={styles.scrollWise}>

                    </div>

                    {Notes?.map((element: NoteType, index) => (
                        <Note
                            key={index}
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