import { useLocalSearchParams } from 'expo-router';
import { Text, SafeAreaView, View, TouchableOpacity, TextInput,  StyleSheet, Alert, ActivityIndicator } from 'react-native';
import { useGetHolidaysById } from '@/components/hooks/useGetHolidaysById';
import { useMemo, useState } from 'react';
import { useDeleteHoliday } from '@/components/hooks/useDeleteHoliday';
import { useRouter } from 'expo-router';
import classNames from 'classnames';
import { ScrollView } from 'react-native-gesture-handler';
import RadioGroup from 'react-native-radio-buttons-group';
import { useRespondRequest } from '@/components/hooks/useRespondRequest';
import AntDesign from '@expo/vector-icons/AntDesign';
import { getTypeById } from '@/lib/getTypeById';

interface FormData {
    comment: string;
    status: string;
}

const HolidayItem = () => {
    // Init constants and hooks
    const {id} = useLocalSearchParams<{ id: string }>();
    const {data} = useGetHolidaysById(id) as any;
    const deleteHoliday = useDeleteHoliday(id);
    const updateHoliday = useRespondRequest(id);
    const router = useRouter()

    // Modals hooks
    const [openEdit, setOpenEdit] = useState<boolean>(false)
    const [openDelete, setOpenDelete] = useState<boolean>(false)
    const [openStatus, setOpenStatus] = useState<boolean>(false)
    const [openCancel, setOpenCancel] = useState<boolean>(false)
    const [openRefuse, setOpenRefuse] = useState<boolean>(false)

    // Others hooks
    const [type, setType] = useState<string>("");

    // Review
    const [formData, setFormData] = useState<FormData>({ comment: '', status: 'ACCEPTER' });
    const [confirm, setConfirm] = useState<boolean>(false);

    const emptyComment = () =>
        Alert.alert('Informations manquantes', 'Vous devez remplir votre formulaire avec un commentaire.', [
          {text: "J'ai comrpis", onPress: () => setConfirm(false)},
        ]
    );

    const radioButtons = useMemo(() => ([
        {
            id: 'ACCEPTER',
            label: 'Accepter',
            value: 'ACCEPTER'
        },
        {
            id: 'REFUSER',
            label: 'Refuser',
            value: 'REFUSER'
        },
    ]), []);

    const DoReview = async () => {
        if(formData.comment.length <= 0){
            emptyComment();
        } else {
            try{
                await updateHoliday.mutateAsync({holidayId : id, comment : formData.comment, status : formData.status});
            }catch (e){
                console.log(e)
            }finally{
                setFormData({ comment: '', status: 'ACCEPTER' });
                setOpenCancel(false);
                setOpenRefuse(false);
                setOpenStatus(false);
                setConfirm(false);
                router.push({pathname: '/Requests/MyHolidays'});
            }
        }
    }

    // Delete
    const DeleteHoliday = async (id: string) => {
        try {
            await deleteHoliday.mutateAsync(id);
        } catch (error) {
            console.error("Error deleting donation:", error);
        }finally{
            setOpenDelete(false);
            router.push({pathname: '/Requests/MyHolidays'});
        }
    }

    const EditHoliday = () => {}

    // Get type of holiday
    const initInfo = async () => {
        const type = await getTypeById(data?.typeId);
        setType(type);
    }

    // Classnames effects
    const pageClass = classNames({
        "p-4 h-[100%] w-[100%]" : true,
        "bg-white" : !openDelete && !openEdit && !openStatus,
        "bg-gray-500" : openDelete || openEdit || openStatus
    });

    if(!data){
        return <SafeAreaView className="flex flex-col justify-content items-center"><ActivityIndicator /></SafeAreaView>;
    }

    if(type.length <= 0){
        initInfo();
    }

    return (
        <SafeAreaView className={pageClass}>
            <View className='flex flex-row justify-end mx-2'>
                <AntDesign disabled={openDelete || openEdit || openStatus} onPress={() => router.push({pathname: '/Requests/MyHolidays'})} name="leftcircleo" size={24} color="black" />
            </View>
            <View>
                <Text className={('text-lg font-bold text-gray-800')}>{data?.title ?? "Chargement"}</Text>
                <Text className={('text-gray-600')}>Type : {type ?? "Chargement"}</Text>
                <Text className={('text-gray-600')}>Statut : {data?.status ?? "Chargement"}</Text>
                <Text className={('text-gray-600')}>Commentaire : {data?.commentaire ?? "Chargement"}</Text>
                <Text className={('text-gray-600')}>Date de début : {data?.startDate ?? "Chargement"}</Text>
                <Text className={('text-gray-600')}>Date de fin : {data?.endDate ?? "Chargement"}</Text>
                <Text className={('text-gray-600')}>Mise à jour le : {data?.updateAt ?? "Chargement"}</Text>
            </View>
            <View className={('flex-row justify-around p-4')}>

                {/* Edit button */}
                <TouchableOpacity
                    disabled={openDelete || openEdit || openStatus}
                    className={'bg-blue-500 hover:bg-blue-700 py-2 px-4 rounded'}
                    onPress={() => setOpenEdit(true)}
                >
                    <Text className='text-white font-bold'>Editer</Text>
                </TouchableOpacity>

                {/* Delete modal */}
                <TouchableOpacity
                    disabled={openDelete || openEdit || openStatus}
                    className={'bg-red-500 hover:bg-red-700 py-2 px-4 rounded'}
                    onPress={() => setOpenDelete(true)}
                >
                    <Text className='text-white font-bold'>Effacer</Text>
                </TouchableOpacity>

                {/* Review modal */}
                {data?.status === 'ANALYSE' || data?.status === 'ANNULER' && <TouchableOpacity
                    disabled={openDelete || openEdit || openStatus}
                    className={'bg-green-500 hover:bg-green-700 py-2 px-4 rounded'}
                    onPress={() => setOpenStatus(true)}
                >
                    <Text className='text-white font-bold'>Répondre</Text>
                </TouchableOpacity>}

                {/* Cancel modal */}
                {data?.status === 'ACCEPTER' && <TouchableOpacity
                    disabled={openDelete || openEdit || openStatus}
                    className={'bg-gray-500 hover:bg-gray-700 py-2 px-4 rounded'}
                    onPress={() => {
                        setOpenStatus(true);
                        setOpenCancel(true);
                        setFormData({ ...formData, status: 'ANNULER' });
                    }}
                >
                    <Text className='text-white font-bold'>Annuler</Text>
                </TouchableOpacity>}

                {/* Change modal */}
                {data?.status === 'REFUSER' && <TouchableOpacity
                    disabled={openDelete || openEdit || openStatus}
                    className={'bg-green-500 hover:bg-green-700 py-2 px-4 rounded'}
                    onPress={() => {
                        setOpenStatus(true);
                        setOpenRefuse(true);
                        setFormData({ ...formData, status: 'ACCEPTER' });
                    }}
                >
                    <Text className='text-white font-bold'>Accepter</Text>
                </TouchableOpacity>}
            </View>
            <View className='flex justify-center items-center mt-20'>
                {/* Edit modal */}
                {openEdit &&
                    <View className='absolute z-10'>
                        <View className={'flex items-center justify-center bg-white w-full p-4 rounded-xl'}>
                            <Text>Editer</Text>
                            <TouchableOpacity
                                onPress={() => {setOpenEdit(false)}}
                            >
                                <Text>Fermer</Text>
                            </TouchableOpacity>
                        </View>
                    </View>}

                {/* Delete modal */}
                {openDelete &&
                    <View className="absolute z-10">
                        <View className={'flex items-center justify-center bg-white w-full p-4 rounded-xl'}>
                            <Text className='text-red-500 font bold m-4'>Etes-vous sûr de vouloir effacer ce congé ?</Text>
                            <Text className='text-xs text-gray-500 font bold m-2'>Vous ne pourrez plus le récuper par la suite.</Text>
                            <TouchableOpacity
                                onPress={() => DeleteHoliday(id)}
                                className='flex flex-col items-center justify-center bg-red-100 m-4 p-2 rounded-lg w-[8em] h-[4em]'
                            >
                                <Text>Oui</Text>
                            </TouchableOpacity>
                            <TouchableOpacity
                                onPress={() => {setOpenDelete(false)}}
                                className='flex flex-col items-center justify-center bg-blue-100 m-4 p-2 rounded-lg w-[8em] h-[4em]'
                            >
                                <Text>Fermer</Text>
                            </TouchableOpacity>
                        </View>
                    </View>}
                {/* Statuer */}
                {openStatus &&
                    <ScrollView className="absolute z-10">
                        <View className={'flex items-center justify-center bg-white w-full p-4 rounded-xl'}>
                            <Text className='text-3xl font-bold m-4'>{openCancel ? "Annuler" : (openRefuse ? "Accepter" : "Réponse")}</Text>
                            <Text className='text-xs text-gray-500 font bold m-2'>La personne recevra un courriel reprenant votre réponse.</Text>
                            <Text className='text-gray-700 mb-1'>Commentaire:</Text>
                            <TextInput
                                className='border border-gray-300 rounded px-3 py-2 mb-4 w-[18em] h-[4em]'
                                value={formData.comment}
                                onChangeText={(text) => setFormData({ ...formData, comment: text })}
                                multiline
                                numberOfLines={8}
                            />
                            {!openCancel && !openRefuse && <RadioGroup
                                containerStyle={styles.container}
                                radioButtons={radioButtons} 
                                onPress={(value) => setFormData({ ...formData, status: value})}
                                selectedId={formData.status}
                                layout='row'
                            />}
                            {!confirm ?
                            <TouchableOpacity
                            onPress={() => setConfirm(true)}
                            className='bg-blue-500 text-white font-bold my-4 py-2 px-4 rounded'
                            >
                                <Text className='text-white'>Soumettre</Text>
                            </TouchableOpacity>
                            :
                            <TouchableOpacity
                            onPress={DoReview}
                            className='bg-green-500 text-lime font-bold my-4 py-2 px-4 rounded'
                            >
                                <Text className='text-white'>Etes-vous sûr ?</Text>
                            </TouchableOpacity>
                            }
                            <TouchableOpacity
                                onPress={() => {setOpenStatus(false)}}
                                className='flex flex-col items-center justify-center bg-blue-100 m-4 p-2 rounded-lg w-[8em] h-[4em]'
                            >
                                <Text>Fermer</Text>
                            </TouchableOpacity>
                        </View>
                    </ScrollView>}
            </View>
        </SafeAreaView>
    );
};

const styles = StyleSheet.create({
    container: {
      margin: 10,
      borderWidth: 1,
      boxShadow: "6px 6px 2px 1px rgba(0, 0, 255, 0.1)",
    },
  });

export default HolidayItem;