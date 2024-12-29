import React, { useState } from "react";
import {
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  Alert,
  Linking,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import * as ImagePicker from "expo-image-picker";
import { UploadFile } from "../constants/appwrite";

const App = () => {
  const [imageUrl, setImageUrl] = useState("");
  const [videoUrl, setVideoUrl] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handlePickFile = async (mediaType) => {
    try {
      const pickerResult = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: mediaType,
        allowsEditing: true,
        quality: 1,
      });

      if (pickerResult.canceled) {
        Alert.alert("No file selected");
        return;
      }

      const fileUri = pickerResult.assets[0].uri;
      setIsLoading(true);

      const uploadedFileUrl = await UploadFile(fileUri);

      if (mediaType === ImagePicker.MediaTypeOptions.Images) {
        setImageUrl(uploadedFileUrl);
      } else {
        setVideoUrl(uploadedFileUrl);
      }

      Alert.alert("Upload Successful", "File uploaded successfully!");
    } catch (error) {
      Alert.alert("Upload Failed", error.message);
    } finally {
      setIsLoading(false);
    }
  };

  const openUrl = (url) => {
    if (!url) {
      Alert.alert("No URL available");
      return;
    }
    Linking.openURL(url);
  };

  return (
    <SafeAreaView style={styles.container}>
      <TouchableOpacity
        style={styles.button}
        onPress={() => handlePickFile(ImagePicker.MediaTypeOptions.Images)}
        disabled={isLoading}
      >
        <Text style={styles.buttonText}>
          {isLoading ? "Uploading..." : "Pick an Image"}
        </Text>
      </TouchableOpacity>

      <TouchableOpacity
        style={styles.button}
        onPress={() => handlePickFile(ImagePicker.MediaTypeOptions.Videos)}
        disabled={isLoading}
      >
        <Text style={styles.buttonText}>
          {isLoading ? "Uploading..." : "Pick a Video"}
        </Text>
      </TouchableOpacity>

      <TouchableOpacity style={styles.button} onPress={() => openUrl(imageUrl)}>
        <Text style={styles.buttonText}>Open Uploaded Image</Text>
      </TouchableOpacity>

      <TouchableOpacity style={styles.button} onPress={() => openUrl(videoUrl)}>
        <Text style={styles.buttonText}>Open Uploaded Video</Text>
      </TouchableOpacity>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#f5f5f5",
    paddingHorizontal: 20,
  },
  button: {
    backgroundColor: "#007bff",
    paddingVertical: 15,
    paddingHorizontal: 20,
    marginVertical: 10,
    borderRadius: 5,
    width: "100%",
    alignItems: "center",
  },
  buttonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "bold",
  },
});

export default App;
