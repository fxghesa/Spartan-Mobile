import './Dashboard.css';
import '../../App.css';
import { useEffect, useState } from 'react';
import { userIdLocalStorage } from "../../service/Localstorage-config";
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
                <AccordionContent />
            </div>
        </div>
    );
}

function AccordionContent() {
    const [content, setContent] = useState([]);
    const [activeIndex, setActiveIndex] = useState(null);
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

    useEffect(() => {
        setContent([ {i: 0}, {i: 1}, {i: 2} ]);
    }, []);

    return(
        <div>
            <div className="pt-2 pb-4">
                {
                    content.map(x => 
                        <Button key={`accordion-${x.i}`} icon={activeIndex && activeIndex.some((index) => index === x.i) ? 'pi pi-minus' : 'pi pi-plus'} label={x.i.toString()} onClick={() => onClick(x.i)} className="p-button-text" />
                    )
                }
                {/* <Button icon={activeIndex && activeIndex.some((index) => index === 0) ? 'pi pi-minus' : 'pi pi-plus'} label="1st" onClick={() => onClick(0)} className="p-button-text" />
                <Button icon={activeIndex && activeIndex.some((index) => index === 1) ? 'pi pi-minus' : 'pi pi-plus'} label="2nd" onClick={() => onClick(1)} className="p-button-text ml-2" />
                <Button icon={activeIndex && activeIndex.some((index) => index === 2) ? 'pi pi-minus' : 'pi pi-plus'} label="3rd" onClick={() => onClick(2)} className="p-button-text ml-2" /> */}
            </div>
            <Accordion multiple activeIndex={activeIndex} onTabChange={(e) => setActiveIndex(e.index)}>
                <AccordionTab header="Header I">
                    
                </AccordionTab>
                <AccordionTab header="Header II">
                    
                </AccordionTab>
                <AccordionTab header="Header III">
                    
                </AccordionTab>
            </Accordion>
        </div>
    );
}