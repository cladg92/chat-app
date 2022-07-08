import PropTypes from "prop-types";
import React from "react";
import { TouchableOpacity, View, Text, StyleSheet } from "react-native";
import {
  connectActionSheet,
  useActionSheet,
} from "@expo/react-native-action-sheet";

import { getStorage, ref, uploadBytes, getDownloadURL } from "firebase/storage";

// Import communication features
import * as Permissions from "expo-permissions";
import * as ImagePicker from "expo-image-picker";

// Action sheet with options
const CustomActions = (props) => {
  //Function to upload images to Firebase
  const uploadImageFetch = async (uri) => {
    // fetch from given URI & transform data in blob
    const blob = await new Promise((resolve, reject) => {
      const xhr = new XMLHttpRequest();
      xhr.onload = function () {
        resolve(xhr.response);
      };
      xhr.onerror = function (e) {
        console.log(e);
        reject(new TypeError("Network request failed"));
      };
      xhr.responseType = "blob";
      xhr.open("GET", uri, true);
      xhr.send(null);
    });
    console.log("Hy I'm BLOB", blob);
    // create storage reference
    const imageNameBefore = uri.split("/");
    const imageName = imageNameBefore[imageNameBefore.length - 1];
    const storage = getStorage();
    //images will be uploaded in the subfolder "images"
    const storageRef = ref(storage, `images/${imageName}`);
    console.log(storageRef);
    // store blob content in storage
    uploadBytes(storageRef, blob).then((snapshot) => {
      console.log("Uploaded a blob or file!");
    });
    // get image URL from storage
    const downloadUrl = await getDownloadURL(storageRef);
    return downloadUrl;
  };

  // CAMERA FEATURES
  //
  const pickImage = async (props) => {
    // ask user for permission to CAMERA and set state to selected image
    const { status } = await Permissions.askAsync(Permissions.CAMERA);
    try {
      if (status === "granted") {
        let result = await ImagePicker.launchImageLibraryAsync({
          mediaTypes: "Images",
        }).catch((error) => console.log(error));
        if (!result.cancelled) {
          // get the image URL and set it as the image of the message object
          //console.log(result.uri);
          const imageUrl = await uploadImageFetch(result.uri);
          props.onSend({ image: imageUrl });
        }
      }
    } catch (error) {
      console.log(error.message);
    }
  };
  //
  const takePhoto = async () => {
    // ask user for permission to CAMERA and set state to selected image
    const { status } = await Permissions.askAsync(Permissions.CAMERA);
    try {
      if (status === "granted") {
        let result = await ImagePicker.launchCameraAsync({
          mediaTypes: "Images",
        }).catch((error) => console.log(error));
        if (!result.cancelled) {
          // get the image URL and set it as the image of the message object
          const imageUrl = await uploadImageFetch(result.uri);
          props.onSend({ image: imageUrl });
        }
      }
    } catch (error) {
      console.log(error.message);
    }
  };

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
            pickImage();
            return;
          case 1:
            takePhoto();
            return;
          case 2:
            alert("user wants to get their location");
          default:
        }
      }
    );
  };

  return (
    <TouchableOpacity style={styles.container} onPress={onActionPress}>
      <View style={[styles.wrapper, props.wrapperStyle]}>
        <Text style={[styles.iconText, props.iconTextStyle]}>+</Text>
      </View>
    </TouchableOpacity>
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
