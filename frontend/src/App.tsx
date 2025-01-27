import {Route, Routes} from "react-router-dom";
import DomainForSale from "./components/DomainForSale.tsx";

function App() {


    return (
        <Routes>
            <Route path="/" element={<DomainForSale/>}/>
        </Routes>
    )
}

export default App