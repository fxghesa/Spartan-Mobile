import './App.css';
import { db } from "./service/firestore-config";
import { useEffect } from 'react';
import { collection, getDocs } from "firebase/firestore";

function App() {
  const usersRef = collection(db, 'USER');

  useEffect(() => {
    const getUsers = async () => {
      const userData = await getDocs(usersRef);
      console.log(userData);
    };

    getUsers();
  });

  return (
    <div className="App">
      <h1>Text Here</h1>
    </div>
  );
}

export default App;
