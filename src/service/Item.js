import { db, isProd } from "./Firestore-Config";
import { userIdLocalStorage } from "./Localstorage-config";
import { collection, doc, getDocs, addDoc, updateDoc } from "firebase/firestore";

const itemHeadertableName = isProd ? 'ITEMHEADERprod' : 'ITEMHEADER';
const itemLogtableName = isProd ? 'ITEMLOGprod' : 'ITEMLOG';
const itemHeaderRef = collection(db, itemHeadertableName);
const itemLogRef = collection(db, itemLogtableName);

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
            console.log(result);
            resolve(result);
        })
        .catch(ex => {
            console.error(ex.message);
            reject(ex);
        });
    });
}
