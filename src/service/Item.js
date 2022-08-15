import { db, isProd } from "./Firestore-Config";
import { collection, doc, getDocs, updateDoc } from "firebase/firestore";

const tableName = isProd ? 'ITEMHEADERprod' : 'ITEMHEADER';
const itemHeaderRef = collection(db, tableName);

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

export async function updateItemHeaderById(id, data) {
    return new Promise((resolve, reject) => {
        const itemHeaderRefById = doc(db, tableName, id);
        updateDoc(itemHeaderRefById, data).then(result => {
            resolve(result);
        })
        .catch(ex => {
            console.error(ex.message);
            reject(ex);
        });
    });
}
