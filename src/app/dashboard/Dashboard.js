import './Dashboard.css';
import '../../App.css';
import { useEffect, useState } from 'react';
import { userIdLocalStorage } from "../../service/Localstorage-config";
import { getItemHeader, getItemHeaderId, updateItemHeaderById } from "../../service/Item";
import { useNavigate } from "react-router-dom";
import { useParams } from "react-router-dom";

import { ProgressBar } from 'primereact/progressbar';
import { Button } from 'primereact/button';
import { Accordion, AccordionTab } from 'primereact/accordion';
import { InputNumber } from 'primereact/inputnumber';

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
            <div>
                <AccordionContent loadingValueRef={isLoading} loadingSetterRef={setIsLoading} />
            </div>
        </div>
    );
}

const AccordionContent = ({ loadingValueRef, loadingSetterRef })  => {
    const [item, setItem] = useState([]);
    const [activeIndex, setActiveIndex] = useState([0]);

    useEffect(() => {
		getAllItemHeader();
        // eslint-disable-next-line react-hooks/exhaustive-deps
	}, []);
    
	function getAllItemHeader() {
		async function fetchFirestore() {
            loadingSetterRef(true);
			const usersDropdown = (await getItemHeader()
            .finally(() => {
                loadingSetterRef(false);
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
    
    const onQtyChange = i => e => {
        async function fetchFirestore() {
            let newArr = [...item];
            newArr[i].QtyLost = newArr[i].QtyOpen - e.target.value;
            newArr[i].Qty = e.target.value;
			const id = (await getItemHeaderId(newArr[i].ItemCode)
            .finally(() => { }));
            loadingSetterRef(true);
			await updateItemHeaderById(id, newArr[i])
            .finally(() => {
                loadingSetterRef(false);
            });
            setItem(newArr);
		}
		fetchFirestore();
    }

    return(
        <div>
            <div className="App pt-2 pb-4">
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
                    item.map((x, i) => 
                        <AccordionTab key={`accordion-${x.ItemCode}`} header={x.ItemName}>
                            <div className="p-fluid grid">
                                <div className="field col-3">
                                    <div className="grid">
                                        <div className="App field col-12 md:col-3">
                                            <label htmlFor="vertical" style={{display: 'block'}}>Qty</label>
                                            <InputNumber inputId={`qty-${x.ItemCode}`} readOnly={loadingValueRef} value={x.Qty} onValueChange={onQtyChange(i)} showButtons buttonLayout="vertical" style={{width: '4rem'}}
                                                decrementButtonClassName="p-button-secondary" incrementButtonClassName="p-button-secondary" incrementButtonIcon="pi pi-plus" decrementButtonIcon="pi pi-minus" />
                                        </div>
                                    </div>
                                </div>
                                <div className="field col-3">
                                    <label htmlFor="qty-open-label">{`Qty Open`}</label>
                                    <InputNumber inputId="qty-open" value={x.QtyOpen} readOnly={true} />
                                    <br />
			                        <br />
                                    <label htmlFor="qty-lost-label">{`Qty Lost`}</label>
                                    <InputNumber inputId="qty-lost" value={x.QtyLost} readOnly={true} />
                                    
                                </div>
                                <div className="field col-6">
                                    {/* <Button label="Log" onClick={() => onShowLog()} /> */}
                                </div>
                            </div>
                        </AccordionTab>
                    )
                }
            </Accordion>
        </div>
    );
}