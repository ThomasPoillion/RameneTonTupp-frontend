import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  Button,
  Image,
  StyleSheet,
  Alert,
} from "react-native";
import * as ImagePicker from "expo-image-picker";
import axios from "axios";

export default function BorrowScreen() {
  const [name, setName] = useState("");
  const [surname, setSurname] = useState("");
  const [phone, setPhone] = useState("");
  const [date, setDate] = useState("");
  const [image, setImage] = useState(null);

  const pickImage = async () => {
    const permission = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (!permission.granted) {
      return Alert.alert(
        "Permission refusée",
        "Autorise l’accès à la galerie."
      );
    }

    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      quality: 0.7,
    });

    if (!result.canceled) {
      setImage(result.assets[0].uri);
    }
  };

  const handleSubmit = async () => {
    if (!name || !surname || !date || !image) {
      return Alert.alert(
        "Champs manquants",
        "Remplis tous les champs et ajoute une photo."
      );
    }

    const formData = new FormData();
    formData.append("name", name);
    formData.append("surname", surname);
    formData.append("phone", phone);
    formData.append("date", date);
    formData.append("photo", {
      uri: image,
      type: "image/jpeg",
      name: "photo.jpg",
    });

    try {
      await axios.post("http://localhost:3000/api/borrow", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      Alert.alert("Succès", "Prêt enregistré avec succès");
      setName("");
      setSurname("");
      setPhone("");
      setDate("");
      setImage(null);
    } catch (err) {
      Alert.alert(
        "Erreur",
        err.response?.data?.message || "Échec de l’enregistrement"
      );
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Nouveau prêt</Text>

      <TextInput
        placeholder="Nom"
        value={surname}
        onChangeText={setSurname}
        style={styles.input}
      />
      <TextInput
        placeholder="Prénom"
        value={name}
        onChangeText={setName}
        style={styles.input}
      />
      <TextInput
        placeholder="Numéro (optionnel)"
        value={phone}
        onChangeText={setPhone}
        style={styles.input}
        keyboardType="phone-pad"
      />
      <TextInput
        placeholder="Date du prêt (JJ/MM/AAAA)"
        value={date}
        onChangeText={setDate}
        style={styles.input}
      />

      <Button title="Ajouter une photo" onPress={pickImage} />
      {image && <Image source={{ uri: image }} style={styles.image} />}

      <Button title="Enregistrer le prêt" onPress={handleSubmit} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20, justifyContent: "center" },
  title: { fontSize: 24, marginBottom: 20, textAlign: "center" },
  input: {
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 6,
    padding: 12,
    marginBottom: 12,
  },
  image: { width: "100%", height: 200, marginTop: 12, borderRadius: 8 },
});
