import { useEffect, useState, useRef } from 'react';
import { useNavigate } from "react-router-dom";
import { userIdLocalStorage } from "../../service/Localstorage-config";

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
                }
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

    useEffect(() => {
        let checkUserId = localStorage.getItem(userIdLocalStorage);
        if (checkUserId == null || checkUserId === '') {
            navigate("/", { replace: true });
        }
        setUserId(checkUserId);
    }, []);

    return (
        <div>
            {
			isLoading ? <ProgressBar mode="indeterminate" style={{ height: '6px' }}/>
			: <ProgressBar value={0} style={{ height: '6px' }}/>
            }
            <Menu model={menuItems} popup ref={menu} />
            <Button label="" icon="pi pi-bars" className="p-button-text p-button-primary mr-2 mb-2 LogOut" onClick={(event) => menu.current.toggle(event)}/>
            <img htmlFor='imgdashboard' key={'imgdashboard'} id='imgdashboard' alt='imgdashboard' height={400} src={'https://firebasestorage.googleapis.com/v0/b/apps-2ee38.appspot.com/o/assets%2Fsimulation.png?alt=media&token=a29f450f-e65d-43f6-9bcf-4dcb873b26ee'}></img>
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
        </div>
    );
}