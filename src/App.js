import { getFirestore } from 'firebase/firestore';
import {
  FirestoreProvider,
} from 'reactfire';
import Routing from './routes';

// function BurritoTaste() {
//   const burritoRef = doc(useFirestore(), 'tryreactfire', 'burrito');
//   const { status, data } = useFirestoreDocData(burritoRef);

//   if (status === 'loading') {
//     return <p>Fetching burrito flavor...</p>;
//   }

//   return <p>The burrito is {data.yummy ? 'good' : 'bad'}!</p>;
// }

function App() {
  const firestoreInstance = getFirestore();
  return (
    <FirestoreProvider sdk={firestoreInstance}>
      <Routing />
    </FirestoreProvider>
  );
}

export default App;
