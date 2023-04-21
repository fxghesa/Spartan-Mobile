import './Dashboard.css';
import '../../App.css';
import { useEffect, useState, useRef } from 'react';
import { userIdLocalStorage } from "../../service/Localstorage-config";
import { signUpAnonymously } from "../../service/Firestore-Config";
import { getItemHeader, getItemHeaderId, updateItemHeaderById, getItemLogByItemCode } from "../../service/Item";
import { getUserDocIdByUserName, updateFcmUserById } from "../../service/User";
import { getSensorHeader } from "../../service/Sensor";
import { useNavigate } from "react-router-dom";
import { useParams } from "react-router-dom";
import moment from "moment";

import { ProgressBar } from 'primereact/progressbar';
import { Button } from 'primereact/button';
import { Accordion, AccordionTab } from 'primereact/accordion';
import { InputNumber } from 'primereact/inputnumber';
import { Divider } from 'primereact/divider';
import { OverlayPanel } from 'primereact/overlaypanel';
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import { Menu } from 'primereact/menu';
import { Fieldset } from 'primereact/fieldset';
import { Knob } from 'primereact/knob';

export function Dashboard() {
    const navigate = useNavigate();
    const { userid } = useParams();
    const [isLoading, setIsLoading] = useState(false);
    const menu = useRef(null);
    const menuItems = [
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
    const [summaryQtyOpen, setSummaryQtyOpen] = useState(0);
    const [summaryQtyLost, setSummaryQtyLost] = useState(0);
    const [summaryQty, setSummaryQty] = useState(0);
    const [rainSensorValue, setRainSensorValue] = useState(0);

    useEffect(() => {
        localStorage.setItem(userIdLocalStorage, userid);
        signUpAnonymously();
        initialPageLoad();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [userid]);

    useEffect(() => {
        refreshSummary();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    function initialPageLoad() {
        async function fetchFirestore() {
            setIsLoading(true);
            const id = (await getUserDocIdByUserName(userid)
            .finally(() => { }));
            await updateFcmUserById(id)
            .finally(() => {
                setIsLoading(false);
            });
		}
		fetchFirestore();
    }

    function refreshSummary() {
        async function fetchFirestore() {
            setIsLoading(true);
			const itemResult = (await getItemHeader()
            .finally(() => { }));
            const rainResult = await getSensorHeader(1) // Rain
            .finally(() => {
                setIsLoading(false);
            });
            setSummaryQtyOpen(itemResult.map(x => x.QtyOpen).reduce((a, b) => a + b, 0));
            setSummaryQtyLost(itemResult.map(x => x.QtyLost).reduce((a, b) => a + b, 0));
            setSummaryQty(itemResult.map(x => x.Qty).reduce((a, b) => a + b, 0));
            setRainSensorValue(1024 - rainResult);
		}
		fetchFirestore();
    }

    function getKnobColor(sensorType, value) {
        switch (sensorType) {
            case 1:
                value = 1024 - value;
                switch (true) {
                    default:
                        return '#DAF5FF';
                    case value < 900:
                        return '#B9E9FC';
                    case value < 500:
                        return '#B0DAFF';
                    case value < 100:
                        return '#6DA9E4';
                }
            default:
                return '#000000';
        }
    }

    function getSensorThresholdDesc(sensorType, value) {
        switch (sensorType) {
            case 1:
                value = 1024 - value;
                switch (true) {
                    default:
                        return 'No rain';
                    case value < 900:
                        return 'Drizzling';
                    case value < 500:
                        return 'Raining';
                    case value < 100:
                        return 'Heavy raining';
                }
            default:
                return '';
        }
    }
    
    return (
        <div>
            {
			isLoading ? <ProgressBar mode="indeterminate" style={{ height: '6px' }}/>
			: <ProgressBar value={0} style={{ height: '6px' }}/>
			}
            <Menu model={menuItems} popup ref={menu} />
            <Button label="" icon="pi pi-bars" className="p-button-text p-button-primary mr-2 mb-2 LogOut" onClick={(event) => menu.current.toggle(event)}/>
            <br />
            <img htmlFor='imgdashboard' key={'imgdashboard'} id='imgdashboard' alt='imgdashboard' height={270} 
            src={'https://firebasestorage.googleapis.com/v0/b/apps-2ee38.appspot.com/o/assets%2Fdashboard.webp?alt=media&token=a4e6d1cb-c8b9-4b9c-a1be-486250014e0d'}></img>
            <div className="p-fluid grid">
                <div className="field col-1"></div>
                <div className="field col-10">
                    <Fieldset legend="Summary" toggleable>
                    <div className="p-fluid grid">
                        <div className="field col-8 rain-label">
                            <label htmlFor="temp-label">{`Rainmeter (0 - 10)`}</label>
                            <br />
                            <br />
                            <div className="temperature-value">
                                <label htmlFor="temp-value-lbl">{getSensorThresholdDesc(1, rainSensorValue)}</label>
                            </div>
                        </div>
                        <div className="field col-4">
                            <Knob value={rainSensorValue} size={100} min={0} max={1024} readOnly={true} 
                            valueColor="#708090" rangeColor={getKnobColor(1, rainSensorValue)} valueTemplate={`${Math.round(rainSensorValue / 100)}`} />
                        </div>
                    </div>
                    <div className="p-fluid grid">
                        <div className="field col-1">
                            <i className="pi pi-box" style={{'fontSize': '1.5em'}}></i><br />
                            <i className="pi pi-box" style={{'fontSize': '1.5em'}}></i><br />
                            <i className="pi pi-box" style={{'fontSize': '1.5em'}}></i>
                        </div>
                        <div className="field col-9 summary-label">
                            <label htmlFor="qty-initial-summary-label">&nbsp;{`Qty Initial`} : </label><br />
                            <label htmlFor="qty-lost-summary-label">&nbsp;{`Qty Lost`} : </label><br />
                            <label htmlFor="qty-summary-label">&nbsp;{`Qty`} : </label>
                        </div>
                        <div className="field col-2 summary-qty">
                            <label htmlFor="qty-initial-summary">{summaryQtyOpen}</label><br />
                            <label htmlFor="qty-lost-summary">{summaryQtyLost}</label><br />
                            <label htmlFor="qty-summary">{summaryQty}</label>
                        </div>
                    </div>
                    </Fieldset>
                </div>
                <div className="field col-1"></div>
            </div>
            <AccordionContent loadingValueRef={isLoading} loadingSetterRef={setIsLoading} refreshSummaryRef={refreshSummary}/>
        </div>
    );
}

const AccordionContent = ({ loadingValueRef, loadingSetterRef, refreshSummaryRef })  => {
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

    // const onClick = (itemIndex) => {
    //     let _activeIndex = activeIndex ? [...activeIndex] : [];

    //     if (_activeIndex.length === 0) {
    //         _activeIndex.push(itemIndex);
    //     }
    //     else {
    //         const index = _activeIndex.indexOf(itemIndex);
    //         if (index === -1) {
    //             _activeIndex.push(itemIndex);
    //         }
    //         else {
    //             _activeIndex.splice(index, 1);
    //         }
    //     }
    //     setActiveIndex(_activeIndex);
    // }
    
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
                refreshSummaryRef();
                loadingSetterRef(false);
            });
            setItem(newArr);
        }
        fetchFirestore();
    }

    function getKnobColor(temperatureValue) {
        switch (true) {
            default:
            case temperatureValue < 26:
                return '#48d1cc';
            case temperatureValue >= 26 && temperatureValue < 31:
                return '#3ad068';
            case temperatureValue >= 31 && temperatureValue < 34:
                return '#FFBD44';
            case temperatureValue >= 34:
                return '#FF605C';
        }
    }

    return(
        <div>
            {/* <div className="App pt-2 pb-4">
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
            </div> */}
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
                                        { x.TemperatureValue < 26 ? <label htmlFor="temp-value-lbl">{`Cool`}</label> : null }
                                        { x.TemperatureValue >= 26 && x.TemperatureValue < 31 ? <label htmlFor="temp-value-lbl">{`Normal`}</label> : null }
                                        { x.TemperatureValue >= 31 && x.TemperatureValue < 34 ? <label htmlFor="temp-value-lbl">{`Warm`}</label> : null }
                                        { x.TemperatureValue >= 34 ? <label htmlFor="temp-value-lbl">{`Hot`}</label> : null }
                                    </div>
                                </div>
                                <div className="field col-5">
                                    <Knob value={x.TemperatureValue} size={120} min={20} max={40} readOnly={true} 
                                    valueColor="#708090" rangeColor={getKnobColor(x.TemperatureValue)} valueTemplate={`${Math.round(x.TemperatureValue * 1) / 1}°C`} />
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
