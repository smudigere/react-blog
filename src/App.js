import './App.css';

import firebase from 'firebase/app';
import 'firebase/firestore';
import 'firebase/auth';

import { useAuthState } from 'react-firebase-hooks/auth';
import { useCollectionData } from 'react-firebase-hooks/firestore';
import React, { useRef, useState, useEffect } from 'react';

import appConfig from './appConfig.json';

firebase.initializeApp(appConfig.firebaseConfig);

const auth = firebase.auth();
const firestore = firebase.firestore();

// function ChatMessage(props) {

//   const { text, uid, photoURL } = props.message;
//   const messageClass = uid === auth.currentUser.uid ? 'sent' : 'received';

//   return(
//     <div className={`message ${messageClass}`}>
//       <img src={photoURL} alt='User Profile'/>
//       <p>{text}</p>
//     </div>
//   )
// }

// function ChatRoom() {

//   const messageRef = firestore.collection('messages');
//   const query = messageRef.orderBy('createdAt').limit(25);

//   const [messages] = useCollectionData(query, {idField: 'id'});
//   const [formValue, setFormValue] = useState('');

//   const scrollDown = useRef();

//   const sendMessage = async(e) => {

//     e.preventDefault();

//     const {uid, photoURL} = auth.currentUser;

//     await messageRef.add({
//       text: formValue,
//       createdAt: firebase.firestore.FieldValue.serverTimestamp(),
//       uid,
//       photoURL
//     });

//     setFormValue('');

//     scrollDown.current.scrollIntoView({ behavior: 'smooth'});
//   }

//   useEffect(() => {
//     scrollDown.current.scrollIntoView({ behavior: 'smooth'});
//   });

//   return(
//     <>
//     <main>

//       {messages && messages.map(msg => <ChatMessage key={msg.id} message={msg} />)}

//       <span ref={scrollDown}></span>

//     </main>

//     <form onSubmit={sendMessage}>

//       <input value={formValue} onChange={(e) => setFormValue(e.target.value)} placeholder="say something" />

//       <button type="submit" disabled={!formValue}>Send</button>

//     </form>
//   </>
//   );
// }

// function SignOut()  {
//   return auth.currentUser && (
//     <button onClick={() => auth.signOut()}>Sign Out</button>
//   )
// }

// function SignIn() {

//   const signInWithGoogle = () =>  {
//     const provider = new firebase.auth.GoogleAuthProvider();
//     auth.signInWithPopup(provider);
//   };

//   return(
//     <button onClick={signInWithGoogle}>Sign in with Google</button>
//   );
// }

function Blog(props) {
  const { title, body, blogImage, imgAlt } = props.post;
  const gridSide = (props.index % 2 === 0 ? 'grid-item-right' : 'grid-item-left');

  return (
    <div style={{backgroundImage: `url(${blogImage})`}} className={gridSide}>
      <h2>{title}</h2>
      <br />
      <div>{body}</div>
      <br />
    </div>
  );
}

function BlogLatest(props) {
  const { title, body, blogImage, imgAlt } = props.post;

  const divStyle = {
    height: '250px',
    margin: '2% auto',
    alignContent: 'center',
    backgroundImage: `url(${blogImage})`,
    backgroundRepeat: 'no-repeat',
    backgroundSize: '100% 100%',
    fontWeight: 'bold',
    fontSize: 'larger'
  };

  return <div style={divStyle}>{title}</div>;
}

function App() {
  //const [user] = useAuthState(auth);

  const postsRef = firestore.collection('posts');
  const query = postsRef.orderBy('createdAt', 'desc').limit(25);

  const [posts] = useCollectionData(query, { idField: 'id' });
  
  return (
    <div className="App">
      <header>React Blog</header>
      {posts &&
          posts.map((post, index) => {
              if (index === 0)
                return <BlogLatest key={post.id} post={post} />;
            })}
      <section className='grid'>
        {posts &&
          posts.map((post, index) => {
            if (index !== 0)
              return <Blog key={post.id} post={post} index={index}/>;
          })}
      </section>
    </div>
  );
}

export default App;
