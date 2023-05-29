import { createUserWithEmailAndPassword } from "firebase/auth";
import { doc, setDoc } from "firebase/firestore";
import { signInWithEmailAndPassword } from "firebase/auth";

export default class Auth {
    constructor(auth, firestore) {
        this.auth = auth;
        this.firestore = firestore;
    }

    async signUp(name, email, password) {
        const { user } = await createUserWithEmailAndPassword(this.auth, email, password);
        const userDocRef = doc(this.firestore, 'users', user.uid);
        const currentMonth = new Date().getMonth();

        await setDoc(userDocRef, {
            name: name,
            monthsData: {
                [currentMonth]: {
                    profit: 0,
                    expenses: 0,
                    entries: []
                }
            }
        });
    }

    async signIn(email, password) {
        return await signInWithEmailAndPassword(this.auth, email, password);
    }

}

