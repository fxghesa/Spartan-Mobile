import './Dashboard.css';
import '../../App.css';
import { useEffect, useState } from 'react';
import { userIdLocalStorage } from "../../service/Localstorage-config";
import { getItemHeader } from "../../service/Item";
import { useNavigate } from "react-router-dom";
import { useParams } from "react-router-dom";

import { ProgressBar } from 'primereact/progressbar';
import { Button } from 'primereact/button';
import { Accordion, AccordionTab } from 'primereact/accordion';

export function Dashboard() {
    const navigate = useNavigate();
    const { userid } = useParams();
    const [isLoading, setIsLoading] = useState(false);

    useEffect(() => {
        localStorage.setItem(userIdLocalStorage, userid);
    }, [userid]);

    function onClickLogOut() {
        localStorage.removeItem(userIdLocalStorage);
        navigate("/", { replace: true });
    }
    
    return (
        <div>
            {
			isLoading ? <ProgressBar mode="indeterminate" style={{ height: '6px' }}/>
			: <ProgressBar value={0} style={{ height: '6px' }}/>
			}
            {/* <div className="pt-2 pb-4"> */}
                <Button className="LogOut" icon="pi pi-sign-out" onClick={onClickLogOut}/>
            {/* </div> */}
            <br />
			<br />
			<br />
            <div className="App">
                <AccordionContent loadingSetter={setIsLoading} />
            </div>
        </div>
    );
}

const AccordionContent = ({ loadingSetter })  => {
    const [item, setItem] = useState([]);
    const [activeIndex, setActiveIndex] = useState(null);

    useEffect(() => {
		getAllItemHeader();
        // eslint-disable-next-line react-hooks/exhaustive-deps
	}, []);

	function getAllItemHeader() {
		async function fetchFirestore() {
            loadingSetter(true);
			const usersDropdown = (await getItemHeader()
            .finally(() => {
                loadingSetter(false);
            }));
            usersDropdown.sort((a, b) => (a.ItemCode) - (b.ItemCode));
            setItem(usersDropdown);
		}
		fetchFirestore();
	}

    const onClick = (itemIndex) => {
        let _activeIndex = activeIndex ? [...activeIndex] : [];

        if (_activeIndex.length === 0) {
            _activeIndex.push(itemIndex);
        }
        else {
            const index = _activeIndex.indexOf(itemIndex);
            if (index === -1) {
                _activeIndex.push(itemIndex);
            }
            else {
                _activeIndex.splice(index, 1);
            }
        }
        setActiveIndex(_activeIndex);
    }

    return(
        <div>
            <div className="pt-2 pb-4">
                {
                    item.map(x => 
                        <Button 
                            key={`accordion-${x.ItemCode}`} 
                            icon={activeIndex && activeIndex.some((index) => index === x.ItemCode) ? 'pi pi-minus' : 'pi pi-plus'} 
                            label={x.ItemName} 
                            onClick={() => onClick(x.ItemCode)} 
                            className="p-button-text" />
                    )
                }
            </div>
            <Accordion multiple activeIndex={activeIndex} onTabChange={(e) => setActiveIndex(e.index)}>
                {
                    item.map(x => 
                        <AccordionTab key={`accordion-${x.ItemCode}`} header={x.ItemName}>
                        </AccordionTab>
                    )
                }
            </Accordion>
        </div>
    );
}