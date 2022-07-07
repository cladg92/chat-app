import React, { useEffect, useState } from "react";
import { View, Platform, KeyboardAvoidingView, Text } from "react-native";
import { GiftedChat, Bubble, InputToolbar } from "react-native-gifted-chat";
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
import NetInfo from "@react-native-community/netinfo";

export default function Chat(props) {
  let { name, bgColor } = props.route.params;
  const [messages, setMessages] = useState([]);
  const [uid, setUid] = useState("");
  const [loggedInText, setText] = useState("");
  const [isOnline, setOnline] = useState();

  const auth = getAuth();
  // creating a references to messages collection
  const messagesCollection = collection(db, "messages");

  //Run once after component mount
  useEffect(() => {
    props.navigation.setOptions({ title: name });

    // If user is online, retrieve messages from firebase store, if offline use AsyncStorage
    NetInfo.fetch().then((connection) => {
      setOnline(connection.isConnected);
      if (!connection.isConnected) {
        // WORKING WITH ASYNCSTORAGE: get messages for asyncStorage and set the state
        getMessages();
      } else {
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
        });

        // listen for collection changes (Update state based on database snapshot)
        let stopListeningToSnapshots = onSnapshot(
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
      }
    });
  }, [isOnline]);

  // WORKING WITH FIRESTORE //

  // GET messages from firestore collection(snapshot) and update state
  const onCollectionUpdate = (querySnapshot) => {
    let mess = [];
    // go through each document
    querySnapshot.forEach((doc) => {
      // get the QueryDocumentSnapshot's data
      mess.push({
        _id: doc.data()._id,
        createdAt: doc.data().createdAt.toDate(),
        text: doc.data().text,
        user: doc.data().user,
      });
    });
    console.log(mess);
    //Update state
    setMessages(mess);
    saveMessages(mess);
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

  //Append new messages to the State and add to firestore collection (addMessage) and asyncStorage (saveMessages)
  const onSend = (newMessages = []) => {
    setMessages((prevMessages) => GiftedChat.append(prevMessages, newMessages));
    //Last message appended to collection
    addMessage(newMessages[0]);
  };

  // WORKING WITH ASYNCSTORAGE (local storage) //
  // GET messages from asyncStorage
  const getMessages = async () => {
    let mesg = "";
    try {
      mesg = (await AsyncStorage.getItem("messages")) || [];
      setMessages(JSON.parse(mesg));
      console.log("Messages fetched from Async Storage", mesg);
    } catch (error) {
      console.log(error.message);
    }
  };
  // ADD messages to asyncStorage
  const saveMessages = async (messages) => {
    try {
      await AsyncStorage.setItem("messages", JSON.stringify(messages));
      console.log("Messages: ", messages);
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

  const renderInputToolbar = (props) => {
    if (!isOnline) {
      return <></>;
    } else {
      return <InputToolbar {...props} />;
    }
  };

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
        renderInputToolbar={renderInputToolbar}
      />
      {/* Ensures that the input field won’t be hidden beneath the keyboard */}
      {Platform.OS === "android" ? (
        <KeyboardAvoidingView behavior="height" />
      ) : null}
    </View>
  );
}
