import { db, isProd } from "./Firestore-Config";
import { collection, getDocs } from "firebase/firestore";
import { query, orderBy } from "firebase/firestore";

const tableName = isProd ? 'USER' : 'USERQC';
const usersRef = collection(db, tableName);

export async function getUsers() {
    return new Promise((resolve, reject) => {
        const selectStatement = query(usersRef, 
            orderBy("Name", "asc")
        );
        getDocs(selectStatement).then(result => {
            let dataList = result.docs.map(x => x.data());
            resolve(dataList);
        })
        .catch(ex => {
            console.error(ex.message);
            reject(ex);
        });
    })
    
}
