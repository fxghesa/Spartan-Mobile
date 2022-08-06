import './App.css';
import { useEffect, useState } from 'react';
import { getUsers } from "./service/users";

import { Dropdown } from 'primereact/dropdown';

function App() {
  const [users, setUsers] = useState([]);
  const [user, setUser] = useState('');

  useEffect(() => {
    async function fetchFirestore() {
      const usersDropdown = (await getUsers()).map(x => ({
        label: x.Name,
        value: x.UserName
      }));
      setUsers(usersDropdown);
    }
    fetchFirestore()
  });

  return (
    <div className="App">
      <br />
      <br />
      <i className="pi pi-cloud" style={{'fontSize': '10em'}}></i>
      <br />
      <div className="card">
        <div className="p-fluid grid">
          <div className="field col-2"></div>
          <div className="field col-8">
            <Dropdown
              loading
              loadingIcon="pi pi-spin pi-sun"
              value={user} 
              options={users} 
              onChange={(e) => setUser(e.value)} 
              placeholder="Select a User">
            </Dropdown>
          </div>
          <div className="field col-2"></div>
        </div>
      </div>
    </div>
  );
}

export default App;
