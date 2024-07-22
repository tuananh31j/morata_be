// Import the functions you need from the SDKs you need
import { initializeApp } from 'firebase/app';
import config from './env.config';

const firebaseConfig = {
    apiKey: config.firebaseConfig.apiKey,
    authDomain: config.firebaseConfig.authDomain,
    projectId: config.firebaseConfig.projectId,
    storageBucket: config.firebaseConfig.storageBucket,
    messagingSenderId: config.firebaseConfig.messagingSenderId,
    appId: config.firebaseConfig.appId,
    measurementId: config.firebaseConfig.measurementId,
};

export default firebaseConfig;
