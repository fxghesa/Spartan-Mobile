import './App.css';
import { useEffect, useState } from 'react';
import { getUsers } from "./service/users";

function App() {
  const [users, setUser] = useState([]);

  useEffect(() => {
    async function fetchFirestore() {
      setUser(await getUsers())
    }
    fetchFirestore()
  });

  return (
    <div className="App">
      <h1>Choose a user</h1>
      <ul>
        {
          users.map(x => (<li key={x.UserName}>{x.Name}</li>))
        }
      </ul>
    </div>
  );
}

export default App;
