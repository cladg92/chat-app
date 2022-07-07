import PropTypes from "prop-types";
import React from "react";
import { TouchableNativeFeedback, View, Text, StyleSheet } from "react-native";
import {
  connectActionSheet,
  useActionSheet,
} from "@expo/react-native-action-sheet";

const CustomActions = (props) => {
  const { showActionSheetWithOptions } = useActionSheet();
  const onActionPress = () => {
    const options = [
      "Choose From Library",
      "Take Picture",
      "Send Location",
      "Cancel",
    ];
    const cancelButtonIndex = options.length - 1;
    showActionSheetWithOptions(
      {
        options,
        cancelButtonIndex,
      },
      async (buttonIndex) => {
        switch (buttonIndex) {
          case 0:
            alert("user wants to pick an image");
            return;
          case 1:
            alert("user wants to take a photo");
            return;
          case 2:
            alert("user wants to get their location");
          default:
        }
      }
    );
  };

  return (
    <TouchableNativeFeedback style={styles.container} onPress={onActionPress}>
      <View style={[styles.wrapper, props.wrapperStyle]}>
        <Text style={[styles.iconText, props.iconTextStyle]}>+</Text>
      </View>
    </TouchableNativeFeedback>
  );
};

const styles = StyleSheet.create({
  container: {
    width: 26,
    height: 26,
    marginLeft: 10,
    marginBottom: 10,
  },
  wrapper: {
    borderRadius: 13,
    borderColor: "#b2b2b2",
    borderWidth: 2,
    flex: 1,
  },
  iconText: {
    color: "#b2b2b2",
    fontWeight: "bold",
    fontSize: 16,
    backgroundColor: "transparent",
    textAlign: "center",
  },
});

export default connectActionSheet(CustomActions);
