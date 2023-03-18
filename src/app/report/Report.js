import '../../App.css';
import './Report.css';
import { useEffect, useState, useRef } from 'react';
import { userIdLocalStorage } from "../../service/Localstorage-config";
import { getItemSensorLogByItemCode } from "../../service/Item";
import { useNavigate } from "react-router-dom";

import { ProgressBar } from 'primereact/progressbar';
import { Button } from 'primereact/button';
import { Chart } from 'primereact/chart';
import { Menu } from 'primereact/menu';
import { TabView, TabPanel } from 'primereact/tabview';
import { SplitButton } from 'primereact/splitbutton';

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

    const filterType = [
        { code: 0, codeDesc: 'Within a day'},
        { code: 1, codeDesc: 'within a week'},
        { code: 2, codeDesc: 'within a month'},
        { code: 3, codeDesc: 'within a year'}
    ];
    const items = [
        {
            label: filterType.find(x => x.code === 0).codeDesc,
            icon: 'pi pi-refresh',
            command: () => {
                setSelectedFilter(filterType.find(x => x.code === 0).code);
            }
        },
        {
            label: filterType.find(x => x.code === 1).codeDesc,
            icon: 'pi pi-times',
            command: () => {
                setSelectedFilter(filterType.find(x => x.code === 1).code);
            }
        },
        {
            label: filterType.find(x => x.code === 2).codeDesc,
            icon: 'pi pi-external-link',
            command: () => {
                setSelectedFilter(filterType.find(x => x.code === 2).code);
            }
        },
        {
            label: filterType.find(x => x.code === 3).codeDesc,
            icon: 'pi pi-upload',
            command: () => {
                setSelectedFilter(filterType.find(x => x.code === 3).code);
            }
        }
    ];

    const [selectedFilter, setSelectedFilter] = useState(filterType.find(x => x.code === 0).code);
    const [chartLabels, setChartLabels] = useState([]);
    const [dataByItemCode, setDataByItemCode] = useState([]);
    const [chartData, setChartData] = useState({});
    const [chartOptions, setChartOptions] = useState({});

    useEffect(() => {
        const checkUserId = localStorage.getItem(userIdLocalStorage);
        if (checkUserId == null || checkUserId === '') {
            navigate("/", { replace: true });
        } else {
            setUserId(checkUserId);
            refreshSelectedFilter();
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    const refreshSelectedFilter = () => {
        switch (selectedFilter) {
            default:
            case 0:
                setChartLabels(['05.00', '07.00', '09.00', '11.00', '13.00', '15.00', '17.00']);
                break;
            case 1:
                setChartLabels(['Sunday', 'Monday', 'Tueday', 'Wednesday', 'Thursday', 'Friday', 'Saturday']);
                break;
        }
        async function fetchFirestore() {
            setIsLoading(true);
            const result = (await getItemSensorLogByItemCode(0)
            .finally(() => {
                setIsLoading(false);
            }));
            if (result != null) {
                if (result.length > 0) {
                    let datas = [];
                    result.forEach(x => {
                        const mapper = {
                            ...x,
                            Hour: x.CreateDate.toDate().getHours()
                        }
                        datas.push(mapper);
                    });
                    //wip
                    console.log(datas);
                    datas = datas.filter(x => x.Hour === 5 || x.Hour === 7 || x.Hour === 9 || x.Hour === 11 || x.Hour === 13 || x.Hour === 15 || x.Hour === 17)
                    console.log(datas);
                    setDataByItemCode([
                        [30, 28, 29, 33, 34, 27, 28],
                        [31, 29, 33, 27, 28, 32, 29],
                        // [65, 59, 80, 81, 56, 55, 40],
                        // [28, 48, 40, 19, 86, 27, 90],
                    ]);
                    
                    const documentStyle = getComputedStyle(document.documentElement);
                    const textColor = documentStyle.getPropertyValue('--text-color');
                    const textColorSecondary = documentStyle.getPropertyValue('--text-color-secondary');
                    const surfaceBorder = documentStyle.getPropertyValue('--surface-border');
                    const data = {
                        labels: chartLabels,
                        datasets: [
                            {
                                label: 'Item 0',
                                data: dataByItemCode[0],
                                fill: false,
                                borderColor: documentStyle.getPropertyValue('--blue-500'),
                                tension: 0
                            },
                            {
                                label: 'Item 1',
                                data: dataByItemCode[1],
                                fill: false,
                                borderColor: documentStyle.getPropertyValue('--pink-500'),
                                tension: 0
                            }
                        ]
                    };
                    const options = {
                        maintainAspectRatio: false,
                        aspectRatio: 1.0,
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
                                },
                                min: 26,
                                max: 38,
                            }
                        }
                    };

                    setChartData(data);
                    setChartOptions(options);
                }
            }
        }
        fetchFirestore();
    };

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
            <TabView>
                <TabPanel header="Qty" leftIcon="pi pi-chart-bar mr-2">
                    <div className='filter'>
                        <SplitButton label="Select Filter" icon="pi pi-plus" onClick={refreshSelectedFilter} model={items} />
                    </div>
                    <br />
                    <br />
                    <br />
                    <Chart type="line" data={chartData} options={chartOptions} />
                </TabPanel>
                <TabPanel header="Temperature" leftIcon="pi pi-sun mr-2">
                    <Chart type="line" data={chartData} options={chartOptions} />
                </TabPanel>
            </TabView>
        </div>
    );
}
