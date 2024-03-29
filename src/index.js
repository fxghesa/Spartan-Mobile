import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';
import reportWebVitals from './reportWebVitals';
import { BrowserRouter, Routes, Route } from "react-router-dom";

import "primereact/resources/themes/lara-light-indigo/theme.css";  //theme
import "primereact/resources/primereact.min.css";                  //core css
import "primeicons/primeicons.css";                                //icons
import "primeflex/primeflex.css";  

//pages
import { Dashboard } from "./app/dashboard/Dashboard";
import { Item } from "./app/item/Item";
import { Simulation } from "./app/simulation/Simulation";
import { Report } from "./app/report/Report";

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
	<React.StrictMode>
		<BrowserRouter>
			<Routes>
				<Route path="/" exac element={<App />}></Route>
				<Route path="/Dashboard/:userid" element={<Dashboard />} />
				<Route path="/Item" element={<Item />} />
				<Route path="/Simulation" element={<Simulation />} />
				<Route path="/Report" element={<Report />} />
			</Routes>
		</BrowserRouter>
	</React.StrictMode>
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
