import { initializeApp } from "https://www.gstatic.com/firebasejs/12.13.0/firebase-app.js";

import {
    getFirestore,
    collection,
    onSnapshot,
    addDoc,
    setDoc,
    doc
}
from "https://www.gstatic.com/firebasejs/12.13.0/firebase-firestore.js";

// ========================================
// FIREBASE CONFIG
// ========================================

const firebaseConfig = {

    apiKey: "AIzaSyBVvjdcxQjaeWFE_t6hesjO-nY5ym3QTyU",

    authDomain: "basic-finances.firebaseapp.com",

    projectId: "basic-finances",

    storageBucket: "basic-finances.firebasestorage.app",

    messagingSenderId: "971037519020",

    appId: "1:971037519020:web:e59716e0caf71e3471c309"

};

// ========================================
// INITIALIZE
// ========================================

const app =
    initializeApp(firebaseConfig);

const db =
    getFirestore(app);

console.log("Firebase Connected");

// ========================================
// REALTIME TEST
// ========================================

const membersRef =
    collection(db, "members");

onSnapshot(membersRef, (snapshot) => {

    console.log(
        "Realtime Connected:",
        snapshot.docs.length
    );

});

// ========================================
// TEST ADD MEMBER
// ========================================

window.addTestMember = async function () {

    await addDoc(
        collection(db, "members"),
        {

            name: "Realtime Test",

            status: "paid",

            createdAt: Date.now()

        }
    );

    console.log("Member Added");

};

// ========================================
// UPLOAD INITIAL MEMBERS
// ========================================

window.uploadMembers = async function () {

    const defaultMembers = [

        {
            id: 1,
            name: "Maulina",
            initials: "MH",

            months: [
                "paid",
                "paid",
                "unpaid",
                "none",
                "none",
                "none",
                "none",
                "none",
                "none",
                "none",
                "none",
                "none"
            ],

            receiptHistory: []
        },

        {
            id: 2,
            name: "Aisyah",
            initials: "AS",

            months: [
                "paid",
                "paid",
                "paid",
                "paid",
                "none",
                "none",
                "none",
                "none",
                "none",
                "none",
                "none",
                "none"
            ],

            receiptHistory: []
        }

    ];

    for (const member of defaultMembers) {

        await setDoc(
            doc(db, "members", String(member.id)),
            member
        );

    }

    console.log("All Members Uploaded");

};

// ========================================
// EXPORT FIRESTORE
// ========================================

window.db = db;

window.firestoreFunctions = {

    collection,
    onSnapshot

};