import {ActivityIndicator, Button, Text, View} from "react-native";
import {
  GoogleSignin,
} from '@react-native-google-signin/google-signin';
import * as React from "react"

const Index = () => {

    return (
      <View
        style={{
          flex: 1,
          justifyContent: "center",
          alignItems: "center",
        }}
      >
          <Text></Text>
          {/* Header (display current status) and holiday */}
          {/* Liste of notifications (requests from the closest to the lastest without order of people) */}
      </View>
    );
};

export default Index;
