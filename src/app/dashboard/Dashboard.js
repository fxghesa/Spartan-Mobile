import './Dashboard.css';
import '../../App.css';
import { AccordionContent } from "../item/Item";
import { useEffect, useState, useRef } from 'react';
import { userIdLocalStorage } from "../../service/Localstorage-config";
import { signUpAnonymously } from "../../service/Firestore-Config";
import { getItemHeader } from "../../service/Item";
import { getUserDocIdByUserName, updateFcmUserById } from "../../service/User";
import { getSensorHeader, getSensorKnobColor, getSensorThresholdDesc, getIcon } from "../../service/Sensor";
import { useNavigate } from "react-router-dom";
import { useParams } from "react-router-dom";

import { ProgressBar } from 'primereact/progressbar';
import { Button } from 'primereact/button';
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
            label: 'Item',
            icon: 'pi pi-list',
            command: (e) => {
                navigate("/Item", { replace: true });
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
    const [summaryQtyOpen, setSummaryQtyOpen] = useState(0);
    const [summaryQtyLost, setSummaryQtyLost] = useState(0);
    const [summaryQty, setSummaryQty] = useState(0);
    const [temperatureSensorValue, setTemperatureSensorValue] = useState(0);
    const [rainSensorValue, setRainSensorValue] = useState(0);
    const [humiditySensorValue, setHumiditySensorValue] = useState(0);

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
            const temperatureResult = (await getSensorHeader(0)
            .finally(() => { }));
            const rainResult = (await getSensorHeader(1)
            .finally(() => { }));
            const humidityResult = await getSensorHeader(2)
            .finally(() => {
                setIsLoading(false);
            });
            setSummaryQtyOpen(itemResult.map(x => x.QtyOpen).reduce((a, b) => a + b, 0));
            setSummaryQtyLost(itemResult.map(x => x.QtyLost).reduce((a, b) => a + b, 0));
            setSummaryQty(itemResult.map(x => x.Qty).reduce((a, b) => a + b, 0));
            setTemperatureSensorValue(temperatureResult);
            setRainSensorValue(1024 - rainResult);
            setHumiditySensorValue(humidityResult);
		}
		fetchFirestore();
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
            <img htmlFor='imgdashboard' key={'imgdashboard'} id='imgdashboard' alt='imgdashboard' height={280} 
            src={'https://firebasestorage.googleapis.com/v0/b/apps-2ee38.appspot.com/o/assets%2Fdashboard2.webp?alt=media&token=371e339a-c9ef-4929-a5fe-8125cf22dc8b'}></img>
            <div className="p-fluid grid">
                <div className="field col-1"></div>
                <div className="field col-10">
                    <Fieldset legend="Summary" toggleable>
                    <div className="p-fluid grid">
                        <div className="field col-8">
                            <label htmlFor="temp-label">{`Temperature`}</label>
                            <br />
                            <br />
                            <div className="sensor-desc">
                                <label htmlFor="temp-value-lbl">{getSensorThresholdDesc(0, temperatureSensorValue)}</label> {` `}
                                <img htmlFor='temp-icon' key={'temp-icon'} id='temp-icon' alt='temp-icon' height={30} src={getIcon(0, temperatureSensorValue)}></img>
                            </div>
                        </div>
                        <div className="field col-4">
                            <Knob value={temperatureSensorValue} size={100} min={20} max={40} readOnly={true} 
                            valueColor="#708090" rangeColor={getSensorKnobColor(0, temperatureSensorValue)} valueTemplate={`${Math.round(temperatureSensorValue * 1) / 1}°C`} />
                        </div>

                        <div className="field col-8">
                            <label htmlFor="rain-label">{`Rainmeter (0 - 10)`}</label>
                            <br />
                            <br />
                            <div className="sensor-desc">
                                <label htmlFor="rain-value-lbl">{getSensorThresholdDesc(1, rainSensorValue)}</label> {` `}
                                <img htmlFor='rain-icon' key={'rain-icon'} id='rain-icon' alt='rain-icon' height={30} src={getIcon(1, rainSensorValue)}></img>
                            </div>
                        </div>
                        <div className="field col-4">
                            <Knob value={rainSensorValue} size={100} min={0} max={1024} readOnly={true} 
                            valueColor="#708090" rangeColor={getSensorKnobColor(1, rainSensorValue)} valueTemplate={`${Math.round(rainSensorValue / 100)}`} />
                        </div>

                        <div className="field col-8">
                            <label htmlFor="temp-label">{`Humidity`}</label>
                            <br />
                            <br />
                            <div className="sensor-desc">
                                <label htmlFor="temp-value-lbl">{getSensorThresholdDesc(2, humiditySensorValue)}</label> {` `}
                                <img htmlFor='temp-icon' key={'temp-icon'} id='temp-icon' alt='temp-icon' height={30} src={getIcon(2, humiditySensorValue)}></img>
                            </div>
                        </div>
                        <div className="field col-4">
                            <Knob value={humiditySensorValue} size={100} min={0} max={100} readOnly={true} 
                            valueColor="#708090" rangeColor={getSensorKnobColor(2, humiditySensorValue)} valueTemplate={`${humiditySensorValue}%`} />
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
