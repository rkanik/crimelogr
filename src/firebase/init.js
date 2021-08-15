import firebase from 'firebase/app'
import { _firebaseConfig } from '../consts';

import 'firebase/auth'
import 'firebase/firestore'

const firebaseApp = firebase.initializeApp(_firebaseConfig)

const Auth = firebase.auth()
const Users = firebaseApp.firestore().collection('crimelogr_users')
const Buildings = firebaseApp.firestore().collection('crimelogr_crimes')

export { Auth, Users, Buildings, Buildings as Crimes };
export default { Auth, Users, Buildings, Crimes: Buildings }