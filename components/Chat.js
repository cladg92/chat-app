import React, { useEffect, useState } from "react";
import { View, Platform, KeyboardAvoidingView, Text } from "react-native";
import { GiftedChat, Bubble } from "react-native-gifted-chat";
import { db } from "../config/firebase";
import {
  collection,
  onSnapshot,
  addDoc,
  query,
  orderBy,
} from "firebase/firestore";
import { getAuth, signInAnonymously, onAuthStateChanged } from "firebase/auth";

export default function Chat(props) {
  let { name, bgColor } = props.route.params;
  const [messages, setMessages] = useState([]);
  const [uid, setUid] = useState("");
  const [loggedInText, setText] = useState("");

  const auth = getAuth();
  // creating a references to messages collection
  const messagesCollection = collection(db, "messages");

  //Run once after component mount
  useEffect(() => {
    props.navigation.setOptions({ title: name });

    // Fetch collection and query on it
    const messagesQuery = query(
      messagesCollection,
      orderBy("createdAt", "desc")
    );

    // listen to authentication events
    const authUnsubscribe = onAuthStateChanged(auth, (user) => {
      if (!user) {
        signInAnonymously(auth);
      }

      //update user state with currently active user data
      setUid(user.uid);
      setText(`User ${user.uid}`);
      console.log(user.uid);
      console.log(loggedInText);
    });

    // listen for collection changes
    const stopListeningToSnapshots = onSnapshot(
      messagesQuery,
      onCollectionUpdate
    );

    //In here code will run once the component will unmount
    return () => {
      // stop listening for changes
      stopListeningToSnapshots();
      // stop listening to authentication
      authUnsubscribe();
    };
  }, []);

  //Append new messages to the State and add to collection
  const onSend = (newMessages = []) => {
    setMessages((prevMessages) => GiftedChat.append(prevMessages, newMessages));
    addMessage(newMessages[0]);
  };

  // Update state based on database snapshot
  const onCollectionUpdate = (querySnapshot) => {
    let messages = [];
    // go through each document
    querySnapshot.forEach((doc) => {
      // get the QueryDocumentSnapshot's data
      var data = doc.data();
      messages.push({
        _id: data._id,
        createdAt: data.createdAt.toDate(),
        text: data.text,
        user: data.user,
      });
    });
    setMessages(messages);
  };

  // Add document(message) to collection
  const addMessage = (message) => {
    addDoc(messagesCollection, {
      _id: message._id,
      createdAt: message.createdAt,
      text: message.text,
      user: message.user,
    });
  };

  // style message bubble
  const renderBubble = (props) => (
    <Bubble
      {...props}
      // renderTime={() => <Text>Time</Text>}
      // renderTicks={() => <Text>Ticks</Text>
      textStyle={{
        right: {
          color: "black",
        },
        left: {
          color: "white",
        },
      }}
      wrapperStyle={{
        left: {
          backgroundColor: "teal",
          padding: 7,
        },
        right: {
          backgroundColor: "darkorange",
          padding: 7,
        },
      }}
    />
  );

  return (
    <View
      style={{
        flex: 1,
        backgroundColor: bgColor,
      }}
    >
      <Text>{loggedInText}</Text>
      {/* Chat UI */}
      <GiftedChat
        messages={messages}
        onSend={onSend}
        user={{
          _id: uid,
          name: name,
          avatar:
            "http://www.hidoctor.ir/wp-content/uploads/2014/02/Model-lebas-parastar-24.jpg",
        }}
        showUserAvatar={true}
        showAvatarForEveryMessage={true}
        renderBubble={renderBubble}
      />
      {/* Ensures that the input field won’t be hidden beneath the keyboard */}
      {Platform.OS === "android" ? (
        <KeyboardAvoidingView behavior="height" />
      ) : null}
    </View>
  );
}
