import {View, Text, Button} from "react-native";
import {useAuth} from "@/context/auth";

export default function LoginForm(){
    const { signIn } = useAuth();

    return (
        <View className="flex justify-center items-center">
            <Text>Login</Text>
            <Button title="Sign in with Google" onPress={signIn} />
        </View>
    )
}