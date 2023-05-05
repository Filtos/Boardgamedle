import './styles/App.css';
import {
  Routes,
  Route,
} from "react-router-dom";
import Home from "./Home";
import PastGames from "./PastGames";

function App() {
  return (
      <div className="App">
        <Routes>
          <Route path='/' element={<Home />} />
          <Route path='/pastGames' element={<PastGames />} />
        </Routes>
      </div>
  );
}

export default App;
