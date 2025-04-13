import {ActivityIndicator, Button, Text, View} from "react-native";
import {useAuth} from "@/context/auth";
import LoginForm from "%/LoginForm";

const Index = () => {
    const {user, isLoading, signOut} = useAuth();

    if(isLoading) {
        return <View className="flex justify-center items-center"><ActivityIndicator /></View>
    }

    if(!user){
        return <LoginForm />
    }

    return (
      <View
        style={{
          flex: 1,
          justifyContent: "center",
          alignItems: "center",
        }}
      >
          <Text>{JSON.stringify(user)}</Text>
          <Button title="Sign out" onPress={signOut} />
      </View>
    );
};

export default Index;
