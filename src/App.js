import { getFirestore } from 'firebase/firestore';
import {
  FirestoreProvider,
} from 'reactfire';
import Routing from './routes';

function App() {
  const firestoreInstance = getFirestore();
  return (
    <FirestoreProvider sdk={firestoreInstance}>
      <Routing />
    </FirestoreProvider>
  );
}

export default App;
