const firebase = require("firebase");
const { apiKey, authDomain, projectId } = require('../config.json');

//firebase init
const firebaseConfig = {
	apiKey: apiKey,
	authDomain: authDomain,
	projectId: projectId,
};
firebase.initializeApp(firebaseConfig);
const db = firebase.firestore();
console.log('connecté')

function connect(){
    console.log('test')
}

function add(messageid, emoji, roleid, guildid){
    return new Promise((resolve ,reject)=>{

        var docRef = db.collection(guildid).doc(messageid);
        docRef.get().then((doc) => {

            if (doc.exists != false) { 
                docRef.update({ [emoji]: roleid })
                resolve(true) } 
            else {
                docRef.set({ [emoji]: roleid })
                resolve(true)
            }
        });
    })
}

function rem(messageid, emoji, guildid){
    return new Promise((resolve ,reject)=>{

        var docRef = db.collection(guildid).doc(messageid);
        docRef.get().then((doc) => {

            if (doc.exists != false) { 
                docRef.update({ [emoji]: firebase.firestore.FieldValue.delete() })
                resolve(true) } 
            else { resolve(false) }
        });
    })
}

function getreact(messageid, emoji, guildid){
	return new Promise((resolve ,reject)=>{

		var docRef = db.collection(guildid).doc(messageid);
		docRef.get().then((doc) => {

			if (doc.exists != false) { 
				roleid = doc.data()[emoji]
                type = doc.data().type

				if(roleid == undefined){ resolve(false)}
                if(type == undefined){ type = 'normal'}
				resolve ([roleid, type]) }
			else { resolve(false) }
		})
	})
}

module.exports = { connect, add, rem, getreact }