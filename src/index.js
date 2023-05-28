import ReactDOM from 'react-dom';
import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { FirebaseAppProvider, AuthProvider } from 'reactfire';
import { BrowserRouter } from 'react-router-dom';
import '@fontsource/roboto/300.css';
import '@fontsource/roboto/400.css';
import '@fontsource/roboto/500.css';
import '@fontsource/roboto/700.css';
import App from './App';

const firebaseConfig = {
  apiKey: "AIzaSyCafkF7MUB2dVPOdzrEX6_RvO3UdbUwkNs",
  authDomain: "web-test-4ecc7.firebaseapp.com",
  databaseURL: "https://web-test-4ecc7-default-rtdb.firebaseio.com",
  projectId: "web-test-4ecc7",
  storageBucket: "web-test-4ecc7.appspot.com",
  messagingSenderId: "46290845916",
  appId: "1:46290845916:web:26408ca57eae316b0bb419"
};


const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);

ReactDOM.render(
  <FirebaseAppProvider firebaseConfig={firebaseConfig}>
    <BrowserRouter>
      <AuthProvider sdk={auth}>
        <App />
      </AuthProvider>
    </BrowserRouter>
  </FirebaseAppProvider>,
  document.getElementById('root')
);


