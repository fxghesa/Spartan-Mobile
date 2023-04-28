import '../../App.css';
import { useEffect, useState, useRef } from 'react';
import { useNavigate } from "react-router-dom";
import { userIdLocalStorage } from "../../service/Localstorage-config";
import { getItemHeader, getItemHeaderId, updateItemHeaderById, getItemLogByItemCode } from "../../service/Item";
import { getSensorKnobColor, getSensorThresholdDesc, getIcon } from "../../service/Sensor";
import moment from "moment";

import { ProgressBar } from 'primereact/progressbar';
import { Menu } from 'primereact/menu';
import { Button } from 'primereact/button';
import { Accordion, AccordionTab } from 'primereact/accordion';
import { InputNumber } from 'primereact/inputnumber';
import { Divider } from 'primereact/divider';
import { OverlayPanel } from 'primereact/overlaypanel';
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import { Knob } from 'primereact/knob';

export function Item() {
    const navigate = useNavigate();
    const [isLoading, setIsLoading] = useState(false);
    const [userId, setUserId] = useState('');
    const menu = useRef(null);
    const menuItems = [
        {
            label: 'Home',
            icon: 'pi pi-home',
            command: (e) => {
                if (userId != null && userId !== '') {
                    navigate(`/Dashboard/${userId}`, { replace: true });   
                } else {
                    navigate("/", { replace: true });
                }
            }
        },
        {
            label: 'Simulator',
            icon: 'pi pi-book',
            command: (e) => {
                navigate("/Simulation", { replace: true });
            }
        },
        {
            label: 'Report',
            icon: 'pi pi-chart-line',
            command: (e) => {
                navigate("/Report", { replace: true });
            }
        },
        {
            label: 'Log Out',
            icon: 'pi pi-sign-out',
            command: (e) => {
                localStorage.removeItem(userIdLocalStorage);
                navigate("/", { replace: true });
            }
        }
    ];

    useEffect(() => {
        const checkUserId = localStorage.getItem(userIdLocalStorage);
        if (checkUserId == null || checkUserId === '') {
            navigate("/", { replace: true });
        } else {
            setUserId(checkUserId);
            setIsLoading(true);
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    return (
        <div>
            {
			isLoading ? <ProgressBar mode="indeterminate" style={{ height: '6px' }}/>
			: <ProgressBar value={0} style={{ height: '6px' }}/>
            }
            <Menu model={menuItems} popup ref={menu} />
            <Button label="" icon="pi pi-bars" className="p-button-text p-button-primary mr-2 mb-2 LogOut" onClick={(event) => menu.current.toggle(event)}/>
            <img htmlFor='imgdashboard' key={'imgdashboard'} id='imgdashboard' alt='imgdashboard' height={300}
            src={'https://firebasestorage.googleapis.com/v0/b/apps-2ee38.appspot.com/o/assets%2Fitem.webp?alt=media&token=40dc5e1c-0606-4816-b4bb-9e3e5649b31d'}></img>
            <AccordionContent loadingValueRef={isLoading} loadingSetterRef={setIsLoading} refreshSummaryRef={null}/>
        </div>
    );
}

export const AccordionContent = ({ loadingValueRef, loadingSetterRef, refreshSummaryRef })  => {
    const [item, setItem] = useState([]);
    const [activeIndex, setActiveIndex] = useState([0]);
    const op = useRef(null);

    useEffect(() => {
		getAllItemHeader();
        // eslint-disable-next-line react-hooks/exhaustive-deps
	}, []);
    
	function getAllItemHeader() {
		async function fetchFirestore() {
            loadingSetterRef(true);
			const result = (await getItemHeader()
            .finally(() => {
                loadingSetterRef(false);
            }));
            result.sort((a, b) => (a.ItemCode) - (b.ItemCode));
            setItem(result);
		}
		fetchFirestore();
	}
    
    const onQtyChange = (i) => e => {
        async function fetchFirestore() {
            let newArr = [...item];
            e.target.value = e.target.value !== null ? e.target.value : newArr[i].Qty;
            const transType = newArr[i].Qty > e.target.value ? 1 : 0;
            newArr[i].QtyLost = newArr[i].QtyOpen - e.target.value;
            newArr[i].Qty = e.target.value;
            newArr[i].LastUpdateBy = localStorage.getItem(userIdLocalStorage);
            const id = (await getItemHeaderId(newArr[i].ItemCode)
            .finally(() => { }));
            loadingSetterRef(true);
            await updateItemHeaderById(id, newArr[i], transType)
            .finally(() => {
                if (refreshSummaryRef != null) {
                    refreshSummaryRef();
                }
                loadingSetterRef(false);
            });
            setItem(newArr);
        }
        fetchFirestore();
    }

    return(
        <div>
            <Accordion activeIndex={activeIndex} onTabChange={(e) => {setActiveIndex(e.index); getAllItemHeader()}}>
                {
                    item.map((x, i) => 
                        <AccordionTab key={`accordion-${x.ItemCode}`} header={x.ItemName}>
                            <div className="p-fluid grid">
                                <div className="field col-7 temperature-label">
                                    <label htmlFor="temp-label">{`Temperature (20°C - 40°C)`}</label>
                                    <br />
                                    <br />
                                    <div className="temperature-value">
                                        <label htmlFor="temp-value-lbl">{getSensorThresholdDesc(0, x.TemperatureValue)}</label> {` `}
                                        <img htmlFor='temp-icon' key={'temp-icon'} id='temp-icon' alt='temp-icon' height={30} src={getIcon(0, x.TemperatureValue)}></img>
                                    </div>
                                </div>
                                <div className="field col-5">
                                    <Knob value={x.TemperatureValue} size={120} min={20} max={40} readOnly={true} 
                                    valueColor="#708090" rangeColor={getSensorKnobColor(0, x.TemperatureValue)} valueTemplate={`${Math.round(x.TemperatureValue * 1) / 1}°C`} />
                                </div>
                            </div>
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
                                    <label htmlFor="qty-open-label">{`Initial Qty`}</label>
                                    <InputNumber inputId="qty-open" value={x.QtyOpen} readOnly={true} />
                                    <br />
			                        <br />
                                    <label htmlFor="qty-lost-label">{`Qty Lost`}</label>
                                    <InputNumber inputId="qty-lost" value={x.QtyLost} readOnly={true} />
                                </div>
                                <div className="field col-6">
                                <img htmlFor='imgdetail' key={'imgdetail'} id='imgdetail' alt='imgdetail' height={162} 
                                src={'https://firebasestorage.googleapis.com/v0/b/apps-2ee38.appspot.com/o/assets%2Fqty-detail.webp?alt=media&token=bcb8e89c-fedb-4828-b5aa-e2805fc07ad1'}></img>
                                </div>
                            </div>
                            <Divider align="left">
                                <Button label="Log" onClick={(e) => {op.current.toggle(e)}} icon="pi pi-search" className="p-button-outlined"></Button>
                                <OverlayPanel ref={op} showCloseIcon key={`overlay-${x.ItemCode}`} id={`overlay-${x.ItemCode}`} style={{width: '390px'}} >
                                    <LogList loadingSetterRef={loadingSetterRef} dataItem={x} />
                                </OverlayPanel>
                            </Divider>
                        </AccordionTab>
                    )
                }
            </Accordion>
        </div>
    );
}

const LogList = ({ loadingSetterRef, dataItem })  => {
    const [logs, setLogs] = useState([]);

    useEffect(() => {
		async function fetchFirestore() {
            loadingSetterRef(true);
            const dataLogList = await getItemLogByItemCode(dataItem.ItemCode)
            .finally(() => {
                loadingSetterRef(false);
            });
            
            let data = [];
            dataLogList.forEach(x => {
                const mapper = {
                    ...x,
                    CreateDateDesc: moment(x.CreateDate.toDate()).format('DD MMMM YYYY HH:mm'),
                    TransTypeDesc: x.TransType === 0 ? 'Add' : 'Deduct'
                }
                data.push(mapper);
            });
            setLogs(data);
        }
        fetchFirestore();
        // eslint-disable-next-line react-hooks/exhaustive-deps
	}, []);

    return(
        <div>
            <div className="card">
                <DataTable value={logs} responsiveLayout="scroll">
                    <Column field="CreateBy" header="Updated By"></Column>
                    <Column field="TransTypeDesc" header="Trans Type"></Column>
                    <Column field="UpdatedQty" header="Qty" align="right"></Column>
                    <Column field="CreateDateDesc" header="Update Date"></Column>
                </DataTable>
            </div>
        </div>
    );
}
