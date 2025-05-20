import React, { useState } from "react";
import { View, Text, TextInput, Button, StyleSheet, Alert } from "react-native";
import axios from "axios";

export default function LoginScreen({ navigation }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleAuth = async (mode) => {
    const endpoint = mode === "login" ? "login" : "signup";

    try {
      const response = await axios.post(
        `http://localhost:3000/api/auth/${endpoint}`,
        {
          email,
          password,
        }
      );

      const token = response.data.token;
      // TODO : stocker le token si besoin
      navigation.navigate("Borrow"); // Écran principal après login/signup
    } catch (err) {
      Alert.alert(
        "Erreur",
        err.response?.data?.message || "Échec de l’opération"
      );
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Bienvenue</Text>

      <TextInput
        placeholder="Email"
        value={email}
        onChangeText={setEmail}
        style={styles.input}
        autoCapitalize="none"
        keyboardType="email-address"
      />

      <TextInput
        placeholder="Mot de passe"
        value={password}
        onChangeText={setPassword}
        style={styles.input}
        secureTextEntry
      />

      <View style={styles.buttonGroup}>
        <Button title="Se connecter" onPress={() => handleAuth("login")} />
        <View style={{ height: 10 }} />
        <Button title="Créer un compte" onPress={() => handleAuth("signup")} />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: "center", padding: 20 },
  title: { fontSize: 24, marginBottom: 20, textAlign: "center" },
  input: {
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 6,
    padding: 12,
    marginBottom: 16,
  },
  buttonGroup: { marginTop: 20 },
});
