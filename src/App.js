import './App.css';
import { useEffect, useState } from 'react';
import { userIdLocalStorage } from "./service/Localstorage-config";
import { useNavigate } from "react-router-dom";
import { getUsers } from "./service/User";

import { ProgressBar } from 'primereact/progressbar';
import { Dropdown } from 'primereact/dropdown';

function App() {
	const navigate = useNavigate();
	const [users, setUsers] = useState([]);
	const [user, setUser] = useState('');
	const [isLoading, setIsLoading] = useState(false);

	useEffect(() => {
		getAllUsers();
		// eslint-disable-next-line react-hooks/exhaustive-deps
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
			let checkUserId = localStorage.getItem(userIdLocalStorage);
			if (checkUserId !== null) {
				onSelectUser(checkUserId);
			}
		}
		fetchFirestore();
	}

	function onSelectUser(userId) {
		setUser(userId);
		navigate(`/Dashboard/${userId}`, { replace: true });
	}

  	return (
		<div className="App">
			{
			isLoading ? <ProgressBar mode="indeterminate" style={{ height: '6px' }}/>
			: <ProgressBar value={0} style={{ height: '6px' }}/>
			}
			<br />
			<br />
			<br />
			<br />
			<br />
			<br />
			<br />
			<img id='imglogin' alt='imglogin' height={270} src={'https://firebasestorage.googleapis.com/v0/b/apps-2ee38.appspot.com/o/assets%2Fwellcome.jpg?alt=media&token=b0b05a96-4208-4cff-9949-b3a6c7dc4e1a'}></img>
			<br />
			<div className="card">
				<div className="p-fluid grid">
					<div className="field col-2"></div>
						<div className="field col-8">
							<h4>Good to see you again</h4>
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
		</div>
	);
}

export default App;
