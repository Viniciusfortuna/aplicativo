import style from "../styles/styles";
import { ActivityIndicator, Modal, Text, View} from "react-native";


export default function ModalLoading({loading}){
    return (
        <Modal transparent={true} animationType="fade" visible={loading}>
            <View style={style.container}>
                <ActivityIndicator size="large" color="#FFF" />
                <Text style={style.label}>Carregando...</Text>
            </View>
        </Modal>
    );
}