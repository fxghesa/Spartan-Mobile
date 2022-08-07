import { db } from "./Firestore-Config";
import { collection, getDocs } from "firebase/firestore";

const itemHeaderRef = collection(db, 'ITEMHEADER');

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
    })
    
}
