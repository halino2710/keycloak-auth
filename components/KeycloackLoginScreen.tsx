import React, { useState } from "react";
import { View, Text, Button } from "react-native";
import { loginWithKeycloak } from "./KeycloackService";

const KeycloakLoginScreen = () => {
  const [user, setUser] = useState(null);

  const handleLogin = async () => {
    try {
      const tokenData = await loginWithKeycloak();
      // Assuming your Keycloak server returns the user data in the access token
      setUser(tokenData);
    } catch (error) {
      console.error("Login failed:", error);
    }
  };

  const handleLogout = () => {
    setUser(null);
  };

  return (
    <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
      {!user ? (
        <Button title="Log In" onPress={handleLogin} />
      ) : (
        <>
          <Text>User Credentials:</Text>
          <Text>{JSON.stringify(user, null, 2)}</Text>
          <Button title="Log Out" onPress={handleLogout} />
        </>
      )}
    </View>
  );
};

export default KeycloakLoginScreen;
