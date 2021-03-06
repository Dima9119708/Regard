import firebase from 'firebase/app'
import 'firebase/auth';
import 'firebase/database';

export class DATABASE {

    // Получение базы данных
    static DATA () {
        return new Promise((resolve,reject) => {

            try {
                firebase
                    .database()
                    .ref(`base/`)
                    .on('value', function (dataSnapshot) {
                        resolve(dataSnapshot.val())
                    })
            }
            catch (err) {
                reject(err)
            }
        })
    }

    // Входил ли юзер
    static whetherTheUserIsSaved() {

        return new Promise(resolve => {

            firebase.auth().onAuthStateChanged(function (user) {
                if (user) {
                    resolve(user)
                }
                else {
                    resolve(user)
                }
            })

        });
    }

    // Получение данных о юзере если они есть
    static retrievingSpecificUserData(user) {

        return new Promise(resolve => {
            firebase
                .database()
                .ref(`users/${user.uid}/`)
                .on('value', function (dataSnapshot) {
                    resolve(dataSnapshot.val())
                })
        })

    }

    // Получение отзывов
    static reviews() {

        return new Promise(resolve => {

            firebase
                .database()
                .ref(`reviews/`)
                .on('value', function (dataSnapshot) {
                    resolve(dataSnapshot.val())
                })

        })

    }

    // Отправка отзыва о товаре или ответ
    static async sendFeedback(Card, review, id, flag) {

        if (flag === 'Отзыв') {
            await firebase
                .database()
                .ref(`reviews/${Card.id}/${review.id}/`)
                .set(review.review)
        }
        else if (flag === 'Ответ') {
            await firebase
                .database()
                .ref(`reviews/${Card.id}/${id}/answer/${review.id}`)
                .set(review.review)
        }

        Card.review = {}
    }

    static __INIT__() {
        firebase.initializeApp({
            apiKey: "AIzaSyCOOBwnyg2X4AwOCwobaMjOBx5386lex0k",
            authDomain: "client-base-regard.firebaseapp.com",
            databaseURL: "https://client-base-regard.firebaseio.com",
            projectId: "client-base-regard",
            storageBucket: "client-base-regard.appspot.com",
            messagingSenderId: "725206410086",
            appId: "1:725206410086:web:6a66e94c39e5b6ea7d1ea7"
        });
    }
}