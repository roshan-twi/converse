const db = require('../firebase');

async function fetchCustomerData(id, passcode) {
  const snapshot = await db.collection('users')
    .where('id', '==', id)
    .where('passcode', '==', passcode)
    .limit(1)
    .get();

  if (snapshot.empty) return null;

  return snapshot.docs[0].data().data;
}

module.exports = fetchCustomerData;
