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
                case value >= 31 && value < 34:
                    return '#FFBD44';
                case value >= 34:
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
                case value >= 31 && value < 34:
                    return 'Warm';
                case value >= 34:
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
                    case value >= 31 && value < 34:
                    return 'https://firebasestorage.googleapis.com/v0/b/apps-2ee38.appspot.com/o/assets%2Ftemp%2Fmid%20temp.webp?alt=media&token=b779629f-823c-4e46-8d18-0098ac18de90';
                case value >= 34:
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
                    return 'https://firebasestorage.googleapis.com/v0/b/apps-2ee38.appspot.com/o/assets%2FRain%2Fno%20rain.webp?alt=media&token=c5d8ee2b-a88b-49ea-9b2b-0f5318c55890';
                case value < 400:
                    return 'https://firebasestorage.googleapis.com/v0/b/apps-2ee38.appspot.com/o/assets%2FRain%2Frain.webp?alt=media&token=fd3a346e-dff9-4fd8-b7a7-134bb1959faf';
            }
        default:
            return '';
    }
}
