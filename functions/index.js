const functions = require('firebase-functions');
const firebaseAdmin = require('firebase-admin');
var serviceAccount = require('./path/to/serviceAccountKey.json');
firebaseAdmin.initializeApp({
    credential: firebaseAdmin.credential.cert(serviceAccount),
    databaseURL: "https://university-20366.firebaseio.com"
});
const fireStore = firebaseAdmin.firestore();
const setting = { timestampsInSnapshots: true };
fireStore.settings(setting);

exports.addStudent = functions.https.onRequest((request, response) => {
    const name = request.query.name;
    const family = request.query.family;
    return fireStore.collection('student').add(
        {
            name: name,
            family: family
        }
    ).then((writeResult) => {
        return response.json(
            {
                result: `${writeResult.id}`
            }
        );
    });
});
exports.makeUppercase = functions.firestore.document('/student/{documentId}')
    .onCreate((snap, context) => {
        const name = snap.data().name;
        const family = snap.data().family;
        const uppercaseName = name.toUpperCase();
        const uppercaseFamily = family.toUpperCase();
        return snap.ref.set({ name: uppercaseName, family: uppercaseFamily }, { merge: false });
    });