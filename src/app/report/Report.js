import '../../App.css';
import { useEffect, useState, useRef } from 'react';
import { userIdLocalStorage } from "../../service/Localstorage-config";
import { getItemSensorLogByItemCode } from "../../service/Item";
import { useNavigate } from "react-router-dom";
import { useParams } from "react-router-dom";
import moment from "moment";

import { ProgressBar } from 'primereact/progressbar';
import { Button } from 'primereact/button';
import { Chart } from 'primereact/chart';
import { Accordion, AccordionTab } from 'primereact/accordion';
import { InputNumber } from 'primereact/inputnumber';
import { Divider } from 'primereact/divider';
import { OverlayPanel } from 'primereact/overlaypanel';
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import { Menu } from 'primereact/menu';
import { Fieldset } from 'primereact/fieldset';
import { Knob } from 'primereact/knob';

export function Report() {
    const navigate = useNavigate();
    const [userId, setUserId] = useState('');
    const [isLoading, setIsLoading] = useState(false);
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
            label: 'Log Out',
            icon: 'pi pi-sign-out',
            command: (e) => {
                localStorage.removeItem(userIdLocalStorage);
                navigate("/", { replace: true });
            }
        }
    ];

    const [chartlabels, setchartlabels] = useState([]);
    const [chartData, setChartData] = useState({});
    const [chartOptions, setChartOptions] = useState({});

    useEffect(() => {
        const checkUserId = localStorage.getItem(userIdLocalStorage);
        if (checkUserId == null || checkUserId === '') {
            navigate("/", { replace: true });
        } else {
            setUserId(checkUserId);
            async function fetchFirestore() {
                const result = (await getItemSensorLogByItemCode(0)
                .finally(() => {
                    setIsLoading(false);
                }));
                if (result != null) {
                    if (result.length > 0) {
                        // console.log(result);
                        getDaysInMonth();
                        console.log(chartlabels);
                    }
                }
            }
            fetchFirestore();

            const documentStyle = getComputedStyle(document.documentElement);
            const textColor = documentStyle.getPropertyValue('--text-color');
            const textColorSecondary = documentStyle.getPropertyValue('--text-color-secondary');
            const surfaceBorder = documentStyle.getPropertyValue('--surface-border');
            const data = {
                labels: ['January', 'February', 'March', 'April', 'May', 'June', 'July'],
                datasets: [
                    {
                        label: 'First Dataset',
                        data: [65, 59, 80, 81, 56, 55, 40],
                        fill: false,
                        borderColor: documentStyle.getPropertyValue('--blue-500'),
                        tension: 0.4
                    },
                    {
                        label: 'Second Dataset',
                        data: [28, 48, 40, 19, 86, 27, 90],
                        fill: false,
                        borderColor: documentStyle.getPropertyValue('--pink-500'),
                        tension: 0.4
                    }
                ]
            };
            const options = {
                maintainAspectRatio: false,
                aspectRatio: 1.2,
                plugins: {
                    legend: {
                        labels: {
                            color: textColor
                        }
                    }
                },
                scales: {
                    x: {
                        ticks: {
                            color: textColorSecondary
                        },
                        grid: {
                            color: surfaceBorder
                        }
                    },
                    y: {
                        ticks: {
                            color: textColorSecondary
                        },
                        grid: {
                            color: surfaceBorder
                        }
                    }
                }
            };

            setChartData(data);
            setChartOptions(options);
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    function getDaysInMonth() {
        var date = new Date();
        console.log(date);
        const month = date.getMonth();
        console.log(date.getMonth());
        var days = [];
        while (date.getMonth() === month) {
            days.push(new Date(date));
            date.setDate(date.getDate() + 1);
        }
        setchartlabels(days);
    }

    return (
        <div>
            {
			isLoading ? <ProgressBar mode="indeterminate" style={{ height: '6px' }}/>
			: <ProgressBar value={0} style={{ height: '6px' }}/>
			}
            <Menu model={menuItems} popup ref={menu} />
            <Button label="" icon="pi pi-bars" className="p-button-text p-button-primary mr-2 mb-2 LogOut" onClick={(event) => menu.current.toggle(event)}/>
            <img htmlFor='imgdashboard' key={'imgdashboard'} id='imgdashboard' alt='imgdashboard' height={400} 
            src={'https://firebasestorage.googleapis.com/v0/b/apps-2ee38.appspot.com/o/assets%2FReport.webp?alt=media&token=fcb46b25-7708-4095-849a-26668bc9054d'}></img>
            <br />
            <br />
            <Chart type="line" data={chartData} options={chartOptions} />
        </div>
    );
}
