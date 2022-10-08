import { db, isProd } from "./Firestore-Config";
import { userIdLocalStorage } from "./Localstorage-config";
import { collection, doc, getDocs, addDoc, updateDoc } from "firebase/firestore";
import { query, where } from "firebase/firestore";

const simulationHeaderTableName = isProd ? 'SIMULATIONHEADER' : 'SIMULATIONHEADERQC';
const SimulationHeaderRef = collection(db, simulationHeaderTableName);

export async function InsertOrUpdateSimulationHeader (data) {
    return new Promise((resolve, reject) => {
        const userId = localStorage.getItem(userIdLocalStorage);
        const dataSimulationHeader = {
            CreateBy: userId,
            UpdateDate: new Date(),
            InitPrice: data.initPrice,
            FinalPrice: data.finalPrice,
            InitQty: data.initQty,
            QtyLost: data.qtyLost
        };

        const promiseCheckExisting = GetExistingSimulationHeader(userId);

        promiseCheckExisting.then((result) => {
            const simulationHeaderRefById = result.length > 0 ? doc(db, simulationHeaderTableName, result.find(x => x).id) : null;
            Promise.all([
                result.length > 0 ? updateDoc(simulationHeaderRefById, dataSimulationHeader)
                : addDoc(SimulationHeaderRef, dataSimulationHeader)
            ]).then((result) => {
                resolve(result);
            })
            .catch(ex => {
                console.error(ex.message);
                reject(ex);
            });
        });
    });
}

export async function GetExistingSimulationHeader(userId) {
    return new Promise((resolve, reject) => {
        const selectStatement = query(SimulationHeaderRef, where("CreateBy", "==", userId));
        getDocs(selectStatement).then(result => {
            const dataList = result.docs.length > 0 ? result.docs.map(x => ({
                data: x.data(),
                id: x.id
            })) : [];
            resolve(dataList);
        })
        .catch(ex => {
            console.error(ex.message);
            reject(ex);
        });
    });
}
