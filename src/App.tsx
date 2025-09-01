import { useEffect } from "react";
import Notes from "./Notes_infinite/Notes";


function App() {
    const serverAddress = "http://localhost:4000"; // our server path


    useEffect( () => {

        fetch(serverAddress + '/')     // checking if server is on
            .then(res => res.json())
            .then(data => console.log(`Server check: ${data}`))
            .catch(error => console.log(`Server check failed: ${error}`));

        fetch(serverAddress + '/database/check')
            .then(res => res.json())
            .then(data => console.log(`Database  check: ${data}`))
            .catch(error => console.log(`Database check failed: ${error}`));


        fetch(serverAddress+'/database/tables')
        .then(res=>res.json())
        .then(data=>console.log(`Database tables: ${data}`))
        .catch(error=>console.log(`Database tables extraxton failed: ${error}`))


            // const checkDatabase = await fetch(serverAddress+'/check_database');
            // console.log(checkDatabase);
            // // const parsedCheckDB = JSON.parse(checkDatabase.body);

    }, []);

    return (
        <div className="mainContainer">

            <Notes
                serverAddress={serverAddress} />

        </div>
    )
}

export default App;