import './App.css';
import { useEffect, useState } from 'react';
import { getUsers } from "./service/users";
import { Dashboard } from "./app/Dashboard";

import { ProgressBar } from 'primereact/progressbar';
import { Dropdown } from 'primereact/dropdown';
import { BrowserRouter, Routes, Route } from "react-router-dom";

function App() {
  const [users, setUsers] = useState([]);
  const [user, setUser] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    getAllUsers();
  }, []);

  function getAllUsers() {
    async function fetchFirestore() {
      setIsLoading(true);
      const usersDropdown = (await getUsers()
      .finally(() => setIsLoading(false))).map(x => ({
        label: x.Name,
        value: x.UserName
      }));
      setUsers(usersDropdown);
    }
    fetchFirestore();
  }

  function onSelectUser(userId) {
    setUser(userId);
  }

  return (
    <div className="App">
      {
        isLoading ? <ProgressBar mode="indeterminate" style={{ height: '6px' }}/>
         : <ProgressBar value={0} style={{ height: '6px' }}/>
      }
      <br />
      <br />
      <i className="pi pi-cloud" style={{'fontSize': '10em'}}></i>
      <br />
      <div className="card">
        <div className="p-fluid grid">
          <div className="field col-2"></div>
          <div className="field col-8">
            <Dropdown
              disabled={isLoading}
              value={user} 
              options={users} 
              onChange={(e) => onSelectUser(e.value)} 
              placeholder="Select a User">
            </Dropdown>
          </div>
          <div className="field col-2"></div>
        </div>
      </div>
      <BrowserRouter>
        <Routes>
          <Route path="/">
            <Route path="Dashboard" element={<Dashboard />} />
          </Route>
        </Routes>
      </BrowserRouter>
    </div>
  );
}

export default App;
