import React from "react";
import './App.css';

function App() {
  const [data, setData] = React.useState(null);

  React.useEffect(() => {
    fetch("/api")
      .then((res) => res.json())
      .then((data) => setData(data));
  }, []);

  return (
    <div className="App">
      <header className="App-header">
        {!data ? <p>Loading</p> : 
          <table>
            <thead>
              <tr>
                <th></th>
                <th>Name</th>
                <th>Year Published</th>
              </tr>
            </thead>
            <tbody>
              {data.games.map((game) => (
                <tr key={game.id}>
                  <td><img src={game.thumbnail.value} alt={game.name.value} /></td>
                  <td>{game.name.value}</td>
                  <td>{game.yearpublished.value}</td>
                </tr>
              ))}
            </tbody>
          </table>}
      </header>
    </div>
  );
}

export default App;
