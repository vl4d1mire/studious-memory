import firebase from "firebase/app"
import "firebase/storage"
import {upload} from "./upload"

const firebaseConfig = {
    apiKey: "AIzaSyCrkbNm8bYoxNWo3750vUDhg6Sj46vliwM",
    authDomain: "web-client-b2cd3.firebaseapp.com",
    projectId: "web-client-b2cd3",
    storageBucket: "web-client-b2cd3.appspot.com",
    messagingSenderId: "982347352642",
    appId: "1:982347352642:web:9876eaaf7020b8989a7bdb"
};

firebase.initializeApp(firebaseConfig)

const storage = firebase.storage()

upload('#file', {
    multi: true,
    accept: ['.jpeg', '.jpg', '.png', '.gif'],
    onUpload(files, blocks) {
        files.forEach((file, index) => {
            const ref = storage.ref(`images/${file.name}`)
            const task = ref.put(file)

            task.on('state_changed', snapshot => {
                    const percentage = ((snapshot.bytesTransferred / snapshot.totalBytes) * 100).toFixed(0) + '%'
                    const block = blocks[index].querySelector('.preview-info-progress')
                    block.textContent = percentage
                    block.style.width = percentage
                },
                error => {
                    console.log(error)
                },
                () => {
                    task.snapshot.ref.getDownloadURL().then(url => {
                        console.log('Download url', url)
                    })
                })
        })
    }
})
