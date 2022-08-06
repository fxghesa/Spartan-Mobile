import './App.css';
import { _ } from "lodash";
import { useEffect, useState } from 'react';
import { getUsers } from "./service/users";
import { Dashboard } from "./app/Dashboard";

import { Dropdown } from 'primereact/dropdown';
import { BrowserRouter, Routes, Route } from "react-router-dom";

function App() {
  const [users, setUsers] = useState([]);
  const [user, setUser] = useState('');

  useEffect(() => {
    async function fetchFirestore() {
      const usersDropdown = (await getUsers()).map(x => ({
        label: x.Name,
        value: x.UserName
      }));
      setUsers(_.clone(usersDropdown));
    }
    fetchFirestore();
  });

  function onSelectUser(userId) {
    setUser(userId);
  }

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
