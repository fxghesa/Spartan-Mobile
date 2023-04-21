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
