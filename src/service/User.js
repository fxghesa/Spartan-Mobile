import { db } from "./Firestore-Config";
import { collection, getDocs } from "firebase/firestore";

const usersRef = collection(db, 'USER');

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
