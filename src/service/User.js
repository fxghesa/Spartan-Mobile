import { db, isProd } from "./Firestore-Config";
import { collection, getDocs } from "firebase/firestore";

const tableName = isProd ? 'USERprod' : 'USER';
const usersRef = collection(db, tableName);

export async function getUsers() {
    return new Promise((resolve, reject) => {
        getDocs(usersRef).then(result => {
            let dataList = result.docs.map(x => x.data());
            resolve(dataList);
        })
        .catch(ex => {
            console.error(ex.message);
            reject(ex);
        });
    })
    
}
