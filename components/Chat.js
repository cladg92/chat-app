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
import AsyncStorage from "@react-native-async-storage/async-storage";

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

    // WORKING WITH FIRESTORE
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

      // update user state with user data
      setUid(user.uid);
      setText(`User ${user.uid}`);
      console.log(user.uid);
      console.log(loggedInText);
    });

    // listen for collection changes (Update state based on database snapshot)
    const stopListeningToSnapshots = onSnapshot(
      messagesQuery,
      onCollectionUpdate
    );

    // WORKING WITH ASYNCSTORAGE
    getMessages();

    //In here code will run once the component will unmount
    return () => {
      // stop listening for changes
      stopListeningToSnapshots();
      // stop listening to authentication
      authUnsubscribe();
    };
  }, []);

  // WORKING WITH FIRESTORE

  // GET messages from firestore collection(snapshot) and update state
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
    //Update state
    setMessages(messages);
  };

  // ADD/PUT document(message) to firestore collection
  const addMessage = (message) => {
    addDoc(messagesCollection, {
      _id: message._id,
      createdAt: message.createdAt,
      text: message.text,
      user: message.user,
    });
  };

  //Append new messages to the State and add to firestore collection (addMessage)
  const onSend = (newMessages = []) => {
    setMessages((prevMessages) => GiftedChat.append(prevMessages, newMessages));
    //Last message appended to collection
    addMessage(newMessages[0]);
    //Save messages to asyncStorage
    saveMessages(messages);
  };

  // WORKING WITH ASYNCSTORAGE (local storage)
  // GET messages from asyncStorage
  const getMessages = async () => {
    let messages = "";
    try {
      messages = (await AsyncStorage.getItem("messages")) || [];
      this.setState({
        messages: JSON.parse(messages),
      });
    } catch (error) {
      console.log(error.message);
    }
  };
  // ADD messages to asyncStorage
  const saveMessages = async () => {
    try {
      await AsyncStorage.setItem("messages", JSON.stringify(messages));
    } catch (error) {
      console.log(error.message);
    }
  };
  // DELETE messages from asyncStorage and state
  const deleteMessages = async () => {
    try {
      await AsyncStorage.removeItem("messages");
      setMessages([]);
    } catch (error) {
      console.log(error.message);
    }
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
