import React, { useEffect } from "react";
import { View, Text } from "react-native";

export default function Chat(props) {
  let { name, bgColor } = props.route.params;

  useEffect(() => {
    props.navigation.setOptions({ title: name });
  }, []);

  return (
    <View
      style={{
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
        backgroundColor: bgColor,
      }}
    >
      <Text>Hello Screen2!</Text>
    </View>
  );
}
