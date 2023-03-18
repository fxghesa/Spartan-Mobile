import { db, isProd } from "./Firestore-Config";
import { userIdLocalStorage } from "./Localstorage-config";
import { collection, doc, getDocs, addDoc, updateDoc } from "firebase/firestore";
import { query, where, orderBy, limit } from "firebase/firestore";

const itemHeadertableName = isProd ? 'ITEMHEADER' : 'ITEMHEADERQC';
const itemLogtableName = isProd ? 'ITEMLOG' : 'ITEMLOGQC';
const itemSensorLogtableName = isProd ? 'ITEMSENSORLOG' : 'ITEMSENSORLOGQC';
const itemHeaderRef = collection(db, itemHeadertableName);
const itemLogRef = collection(db, itemLogtableName);
const itemSensorLogRef = collection(db, itemSensorLogtableName);

export async function getItemHeader() {
    return new Promise((resolve, reject) => {
        getDocs(itemHeaderRef).then(result => {
            let dataList = result.docs.map(x => x.data());
            resolve(dataList);
        })
        .catch(ex => {
            console.error(ex.message);
            reject(ex);
        });
    });
}

export async function getItemHeaderId(itemCode) {
    return new Promise((resolve, reject) => {
        getDocs(itemHeaderRef).then(result => {
            let dataList = result.docs.map(x => ({
                data: x.data(),
                id: x.id
            }));
            let data = dataList.find(x => x.data.ItemCode === itemCode);
            if (dataList != null) {
                resolve(data.id);
            } else {
                console.error('ItemCodeNotFound');
                reject();
            }
        })
        .catch(ex => {
            console.error(ex.message);
            reject(ex);
        });
    });
}

export async function updateItemHeaderById(id, data, transType) {
    return new Promise((resolve, reject) => {
        const userId = localStorage.getItem(userIdLocalStorage);
        const itemHeaderRefById = doc(db, itemHeadertableName, id);
        const dataLog = {
            CreateBy: userId,
            CreateDate: new Date(),
            ItemCode: data.ItemCode,
            TransType: transType,
            UpdatedQty: data.Qty
        };
        Promise.all([
            updateDoc(itemHeaderRefById, data), 
            addDoc(itemLogRef, dataLog)
        ]).then((result) => {
            resolve(result);
        })
        .catch(ex => {
            console.error(ex.message);
            reject(ex);
        });
    });
}

export async function getItemLogByItemCode(itemCode) {
    return new Promise((resolve, reject) => {
        const selectStatement = query(itemLogRef, 
            where("ItemCode", "==", itemCode), 
            orderBy("CreateDate", "desc"), limit(20)
        );
        getDocs(selectStatement).then(result => {
            let dataList = result.docs.map(x => x.data());
            resolve(dataList);
        })
        .catch(ex => {
            console.error(ex.message);
            reject(ex);
        });
    });
}

export async function getItemSensorLogByItemCode(itemCode) {
    return new Promise((resolve, reject) => {
        const selectStatement = query(itemSensorLogRef, 
            where("ItemCode", "==", itemCode), 
            orderBy("CreateDate", "asc"), limit(31)
        );
        getDocs(selectStatement).then(result => {
            let dataList = result.docs.map(x => x.data());
            resolve(dataList);
        })
        .catch(ex => {
            console.error(ex.message);
            reject(ex);
        });
    });
}
