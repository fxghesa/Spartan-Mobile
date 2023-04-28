import { db, isProd } from "./Firestore-Config";
import { collection, getDocs } from "firebase/firestore";
import { query, where, limit } from "firebase/firestore";

const sensorHeadertableName = isProd ? 'SENSORHEADER' : 'SENSORHEADERQC';
const sensorHeaderRef = collection(db, sensorHeadertableName);

export async function getSensorHeader(sensorType) {
    return new Promise((resolve, reject) => {
        const selectStatement = query(sensorHeaderRef, 
            where("SensorType", "==", sensorType),
            limit(1)
        );
        getDocs(selectStatement).then(result => {
            const dataList = result.docs.map(x => x.data());
            if (dataList.length > 0) {
                const rainSensorValue = dataList.map(x => x.SensorValue).find(y => y);
                resolve(rainSensorValue);
            } else {
                console.error('no data found');
                reject(null);
            }
        })
        .catch(ex => {
            console.error(ex.message);
            reject(ex);
        });
    });
}

export function getSensorKnobColor(sensorType, value) {
    switch (sensorType) {
        case 0:
            switch (true) {
                default:
                case value < 26:
                    return '#48d1cc';
                case value >= 26 && value < 31:
                    return '#3ad068';
                case value >= 31 && value < 35:
                    return '#FFBD44';
                case value >= 35:
                    return '#FF605C';
            }
        case 1:
            value = 1024 - value;
            switch (true) {
                default:
                    return '#DAF5FF';
                case value >= 600 && value < 900:
                    return '#B9E9FC';
                case value >= 400 && value < 600:
                    return '#B0DAFF';
                case value < 400:
                    return '#6DA9E4';
            }
        case 2:
            switch (true) {
                default:
                case value < 25:
                    return '#DAF5FF';
                case value >= 25 && value < 50:
                    return '#B9E9FC';
                case value >= 50 && value < 75:
                    return '#B0DAFF';
                case value >= 75:
                    return '#6DA9E4';
            }
        default:
            return '#000000';
    }
}

export function getSensorThresholdDesc(sensorType, value) {
    switch (sensorType) {
        case 0:
            switch (true) {
                case value < 26:
                    return 'Cold';
                case value >= 26 && value < 31:
                    return 'Cool';
                case value >= 31 && value < 35:
                    return 'Warm';
                case value >= 35:
                    return 'Hot';
                default:
                    return '';
            }
        case 1:
            value = 1024 - value;
            switch (true) {
                default:
                    return 'No rain';
                case value >= 600 && value < 900:
                    return 'Drizzling';
                case value >= 400 && value < 600:
                    return 'Raining';
                case value < 400:
                    return 'Heavy raining';
            }
        case 2:
            switch (true) {
                case value < 25:
                    return 'Dry';
                case value >= 25 && value < 50:
                    return 'Semi-dry';
                case value >= 50 && value < 75:
                    return 'Wet';
                case value >= 75:
                    return 'Very wet';
                default:
                    return '';
            }
        default:
            return '';
    }
}

export function getIcon(sensorType, value) {
    switch (sensorType) {
        case 0:
            switch (true) {
                case value < 26:
                case value >= 26 && value < 31:
                    return 'https://firebasestorage.googleapis.com/v0/b/apps-2ee38.appspot.com/o/assets%2Ftemp%2Flow%20temp.webp?alt=media&token=3415f63f-7f27-4e8c-912c-05a2e5aa6374';
                default:
                    case value >= 31 && value < 35:
                    return 'https://firebasestorage.googleapis.com/v0/b/apps-2ee38.appspot.com/o/assets%2Ftemp%2Fmid%20temp.webp?alt=media&token=b779629f-823c-4e46-8d18-0098ac18de90';
                case value >= 35:
                    return 'https://firebasestorage.googleapis.com/v0/b/apps-2ee38.appspot.com/o/assets%2Ftemp%2Fhigh%20temp.webp?alt=media&token=52c56227-df51-40d5-95f6-eb3babaeb7e3';
            }
        case 1:
            value = 1024 - value;
            switch (true) {
                default:
                    return 'https://firebasestorage.googleapis.com/v0/b/apps-2ee38.appspot.com/o/assets%2FRain%2Fno%20rain.webp?alt=media&token=c5d8ee2b-a88b-49ea-9b2b-0f5318c55890';
                case value >= 600 && value < 900:
                    return 'https://firebasestorage.googleapis.com/v0/b/apps-2ee38.appspot.com/o/assets%2FRain%2Fdrizzle.webp?alt=media&token=c0019464-a239-49eb-8d65-5e047026e6c1';
                case value >= 400 && value < 600:
                    return 'https://firebasestorage.googleapis.com/v0/b/apps-2ee38.appspot.com/o/assets%2FRain%2Frain.webp?alt=media&token=fd3a346e-dff9-4fd8-b7a7-134bb1959faf';
                case value < 400:
                    return 'https://firebasestorage.googleapis.com/v0/b/apps-2ee38.appspot.com/o/assets%2FRain%2Fheavy%20rain.webp?alt=media&token=e9ce4eae-f449-46dc-81cb-4fcc5a81a149';
            }
        case 2:
            switch (true) {
                default:
                case value < 25:
                    return 'https://firebasestorage.googleapis.com/v0/b/apps-2ee38.appspot.com/o/assets%2Fhumidity%2Fdry.webp?alt=media&token=24c6694f-50b1-4137-b2a3-f154d2564fb6';
                case value >= 25 && value < 50:
                    return 'https://firebasestorage.googleapis.com/v0/b/apps-2ee38.appspot.com/o/assets%2Fhumidity%2Fsemi-dry.webp?alt=media&token=3fd7fb20-8c1e-45e2-93a8-b6d34891d3e7';
                case value >= 50 && value < 75:
                    return 'https://firebasestorage.googleapis.com/v0/b/apps-2ee38.appspot.com/o/assets%2Fhumidity%2Fwet.webp?alt=media&token=824904b2-965e-4aca-9db8-ac10de20d7fa';
                case value >= 75:
                    return 'https://firebasestorage.googleapis.com/v0/b/apps-2ee38.appspot.com/o/assets%2Fhumidity%2Fvery%20wet.webp?alt=media&token=d5a92fb3-e89c-47ff-a640-05a3ffed403b';
            }
        default:
            return '';
    }
}
