import { useEffect, useState, useRef } from 'react';
import { useNavigate } from "react-router-dom";
import { userIdLocalStorage } from "../../service/Localstorage-config";
import { InsertOrUpdateSimulationHeader, GetExistingSimulationHeader } from "../../service/Simulation";

import { ProgressBar } from 'primereact/progressbar';
import { Button } from 'primereact/button';
import { Menu } from 'primereact/menu';
import { Fieldset } from 'primereact/fieldset';
import { InputNumber } from 'primereact/inputnumber';

export function Simulation() {
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
            label: 'Item',
            icon: 'pi pi-list',
            command: (e) => {
                navigate("/Item", { replace: true });
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
    const [initPrice, setInitPrice] = useState();
    const [finalPrice, setFinalPrice] = useState();
    const [initQty, setInitQty] = useState(0);
    const [qtyLost, setQtyLost] = useState(0);
    const [calculatedProfit, setCalculatedProfit] = useState(0);

    useEffect(() => {
        const checkUserId = localStorage.getItem(userIdLocalStorage);
        if (checkUserId == null || checkUserId === '') {
            navigate("/", { replace: true });
        } else {
            setUserId(checkUserId);
            setIsLoading(true);
            async function fetchFirestore() {
                const result = (await GetExistingSimulationHeader(checkUserId)
                .finally(() => {
                    setIsLoading(false);
                }));
                if (result != null) {
                    if (result.length > 0) {
                        const datas = result.find(x => x).data;
                        setInitPrice(datas.InitPrice);
                        setFinalPrice(datas.FinalPrice);
                        setInitQty(datas.InitQty);
                        setQtyLost(datas.QtyLost);
                    }
                }
            }
            fetchFirestore();
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    function calculateClick() {
        async function fetchFirestore() {
            const dataPost = {
                initPrice: initPrice,
                finalPrice: finalPrice,
                initQty: initQty,
                qtyLost: qtyLost
            };
            setIsLoading(true);
            const result = (await InsertOrUpdateSimulationHeader(dataPost)
            .finally(() => {
                setIsLoading(false);
            }));
            if (result != null) {
                initCalculation();
            }
        }
        fetchFirestore();
    }

    function initCalculation() {
        const qty = initQty - qtyLost;
        const calculatedProfit = (qty * finalPrice) - (qty * initPrice);
        setCalculatedProfit(calculatedProfit);
    }

    return (
        <div>
            {
			isLoading ? <ProgressBar mode="indeterminate" style={{ height: '6px' }}/>
			: <ProgressBar value={0} style={{ height: '6px' }}/>
            }
            <Menu model={menuItems} popup ref={menu} />
            <Button label="" icon="pi pi-bars" className="p-button-text p-button-primary mr-2 mb-2 LogOut" onClick={(event) => menu.current.toggle(event)}/>
            <img htmlFor='imgdashboard' key={'imgdashboard'} id='imgdashboard' alt='imgdashboard' height={270}
            src={'https://firebasestorage.googleapis.com/v0/b/apps-2ee38.appspot.com/o/assets%2FSimulation.webp?alt=media&token=859a2786-dfcc-4dab-8916-b22119e23c85'}></img>
            <div className="p-fluid grid">
                <div className="field col-1"></div>
                <div className="field col-10">
                    <Fieldset legend={'Initiate Price'}>
                        <div className="p-inputgroup">
                            <span className="p-inputgroup-addon">Rp</span>
                            <span className="p-float-label">
                                <InputNumber inputId="init-price" value={initPrice} onChange={(e) => setInitPrice(e.value)} />
                                <label htmlFor="init-price">Initial Price/Qty</label>
                            </span>
                        </div>
                        <br />
                        <br />
                        <div className="p-inputgroup">
                            <span className="p-inputgroup-addon">Rp</span>
                            <span className="p-float-label">
                                <InputNumber inputId="final-price" value={finalPrice} onChange={(e) => setFinalPrice(e.value)} />
                                <label htmlFor="final-price">Final Price/Qty</label>
                            </span>
                        </div>
                    </Fieldset>
                </div>
                <div className="field col-1"></div>
            </div>
            <div className="p-fluid grid formgrid">
                <div className="field col-1"></div>
                <div className="field col-5">
                    <label htmlFor="integeronly">Initial Qty</label>
                    <InputNumber inputId="integeronly" inputStyle={{'textAlign': 'right'}} value={initQty} onValueChange={(e) => setInitQty(e.value)} allowEmpty={false} />
                </div>
                <div className="field col-5">
                    <label htmlFor="integeronly">Qty Lost</label>
                    <InputNumber inputId="integeronly" inputStyle={{'textAlign': 'right'}} value={qtyLost} onValueChange={(e) => setQtyLost(e.value)} allowEmpty={false} />
                </div>
                <div className="field col-1"></div>
            </div>
            <div className="p-fluid grid formgrid">
                <div className="field col-4">
                </div>
                <div className="field col-4">
                    <br />
                    <Button label="Calculate" loading={isLoading} onClick={calculateClick} icon="pi pi-search" iconPos="left" />
                </div>
                <div className="field col-4"></div>
            </div>
            <div style={{'textAlign': 'center'}}>
                <h3>
                    Profit probability : Rp {calculatedProfit.toLocaleString()}
                </h3>
            </div>
        </div>
    );
}
