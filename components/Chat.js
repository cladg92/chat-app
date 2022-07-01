import React, { useEffect, useState } from "react";
import { View, Platform, KeyboardAvoidingView } from "react-native";
import { GiftedChat, Bubble } from "react-native-gifted-chat";

export default function Chat(props) {
  let { name, bgColor } = props.route.params;
  const [messages, setMessages] = useState([]);

  //Run once after component mount
  useEffect(() => {
    props.navigation.setOptions({ title: name });
    setMessages([
      {
        _id: 1,
        text: `${name} has entered the chat`,
        createdAt: new Date(),
        system: true,
      },
      {
        _id: 2,
        text: "Hello developer",
        createdAt: new Date(),
        user: {
          _id: 2,
          name: "React Native",
          avatar: "https://placeimg.com/140/140/any",
        },
      },
    ]);
  }, []);

  const onSend = (newMessages = []) => {
    setMessages((prevMessages) => GiftedChat.append(prevMessages, newMessages));
  };

  // style message bubble
  const renderBubble = (props) => (
    <Bubble
      {...props}
      // renderTime={() => <Text>Time</Text>}
      // renderTicks={() => <Text>Ticks</Text>
      wrapperStyle={{
        left: { borderColor: "orange", borderWidth: 4 },
        right: { backgroundColor: "orange" },
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
      {/* Chat UI */}
      <GiftedChat
        messages={messages}
        onSend={onSend}
        user={{
          _id: 1,
        }}
        renderBubble={renderBubble}
      />
      {/* Ensures that the input field won’t be hidden beneath the keyboard */}
      {Platform.OS === "android" ? (
        <KeyboardAvoidingView behavior="height" />
      ) : null}
    </View>
  );
}
