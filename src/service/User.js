import { db, isProd } from "./Firestore-Config";
import { collection, getDocs, where, query, orderBy } from "firebase/firestore";
import { doc, updateDoc } from "firebase/firestore";
import { getAuth, signInWithEmailAndPassword } from "firebase/auth";
import { fcmTokenLocalStorage } from "./Localstorage-config";

const tableName = isProd ? 'USER' : 'USERQC';
const usersRef = collection(db, tableName);

export async function getUsers() {
    return new Promise((resolve, reject) => {
        const selectStatement = query(usersRef, 
            orderBy("Name", "asc")
        );
        getDocs(selectStatement).then(result => {
            const dataList = result.docs.map(x => x.data());
            resolve(dataList);
        })
        .catch(ex => {
            console.error(ex.message);
            reject(ex);
        });
    });
}

export async function getUserDocIdByUserName(userName) {
    return new Promise((resolve, reject) => {
        const selectStatement = query(usersRef,
            where("UserName", "==", userName)
        );
        getDocs(selectStatement).then(result => {
            const id = result.docs.map(x => x.id).find(y => y);
            resolve(id);
        })
        .catch(ex => {
            console.log('got error');
            console.error(ex.message);
            reject(ex);
        });
    });
}

export async function updateFcmUserById(id) {
    return new Promise((resolve, reject) => {
        const fcmToken = localStorage.getItem(fcmTokenLocalStorage);
        const userRefById = doc(db, tableName, id);
        const data = {
            FcmToken: fcmToken
        };
        updateDoc(userRefById, data)
        .then((result) => {
            resolve(result);
        })
        .catch(ex => {
            console.error(ex.message);
            reject(ex);
        });
    });
}

// currently unused: firestore rules currently set free read/write
export async function authenticatingLocal() {
    const auth = getAuth();
    const email = 'ghesa@gmail.com';
    const password = '123qwe';
    signInWithEmailAndPassword(auth, email, password)
    .then((userCredential) => {
        console.log('auth using ' + userCredential.user)
    })
    .catch((ex) => {
        console.error(ex.message);
    });
}


