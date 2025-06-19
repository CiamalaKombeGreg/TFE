import { useLocalSearchParams } from 'expo-router';
import { Text, SafeAreaView, View, TouchableOpacity, TextInput,  StyleSheet, Alert, ActivityIndicator, Button, Platform } from 'react-native';
import { useGetHolidaysById } from '@/components/hooks/useGetHolidaysById';
import { useEffect, useMemo, useState } from 'react';
import { useDeleteHoliday } from '@/components/hooks/useDeleteHoliday';
import { useRouter } from 'expo-router';
import classNames from 'classnames';
import { ScrollView } from 'react-native-gesture-handler';
import RadioGroup from 'react-native-radio-buttons-group';
import { useRespondRequest } from '@/components/hooks/useRespondRequest';
import AntDesign from '@expo/vector-icons/AntDesign';
import { getTypeById } from '@/lib/getTypeById';
import { AuthResponse } from '@/lib/types';
import { GoogleSignin } from '@react-native-google-signin/google-signin';
import DateTimePicker from "@react-native-community/datetimepicker";
import { useEditRequest } from '@/components/hooks/useEditRequest';
import { getFileByKey } from '@/lib/getFile';
import { getAdmin } from '@/lib/getAdmin';
import { getOwner } from '@/lib/getSupervisor';

interface FormData {
    comment: string;
    status: string;
}

const HolidayItem = () => {
    // Utilisateur
    const [userInfo, setUserInfo] = useState<AuthResponse | null>(null);
        
    const getCurrentUser = async () => {
        const currentUser = GoogleSignin.getCurrentUser() as AuthResponse;
        setUserInfo(currentUser);
    };
    
    useEffect(() => {
        getCurrentUser();
    }, [])
    

    // Init constants and hooks
    const {id} = useLocalSearchParams<{ id: string }>();
    const {data} = useGetHolidaysById(id) as any;
    const deleteHoliday = useDeleteHoliday(id);
    const updateHoliday = useRespondRequest(id);
    const editHoliday = useEditRequest(id);
    const router = useRouter();

    // Modals hooks
    const [openEdit, setOpenEdit] = useState<boolean>(false);
    const [openDelete, setOpenDelete] = useState<boolean>(false);
    const [openStatus, setOpenStatus] = useState<boolean>(false);
    const [openCancel, setOpenCancel] = useState<boolean>(false);
    const [openRefuse, setOpenRefuse] = useState<boolean>(false);

    // Others hooks
    const [type, setType] = useState<string>("");
    const [isAdmin, setIsAdmin] = useState<boolean>(false);
    const [isSupervisor, setIsSupervisor] = useState<boolean>(false);
    const [owner, setOwner] = useState<string>("");

    // Review
    const [formData, setFormData] = useState<FormData>({ comment: '', status: 'ACCEPTER' });
    const [confirm, setConfirm] = useState<boolean>(false);

    const emptyComment = () =>
        Alert.alert('Informations manquantes', 'Vous devez remplir votre formulaire avec un commentaire.', [
          {text: "J'ai comrpis", onPress: () => setConfirm(false)},
        ]
    );

    const wrongStartDate = () =>
        Alert.alert('La date est mauvaise', 'Votre date de retour est ultérieur à votre date de commencement.', [
            {text: "J'ai comrpis", onPress: () => setConfirm(false)},
        ]
    );

    const fileNotFound = () =>
        Alert.alert('Fichier non trouvé', 'Une erreur est survenue lors de la redirection, veuillez contactez un administrateur.', [
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
                if(userInfo?.user.email !== undefined){
                    await updateHoliday.mutateAsync({email: userInfo?.user.email, holidayId : id, comment : formData.comment, status : formData.status});
                }
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

    // Edit holiday
    const [startDate, setStartDate] = useState<Date>(new Date());
    const [endDate, setEndDate] = useState<Date>(new Date());
    const [comment, setComment] = useState<string>("");
    const [showStartDatePicker, setShowStartDatePicker] = useState(false);
    const [showEndDatePicker, setShowEndDatePicker] = useState(false);
    
    const onChangeStartDate = (event: any, selectedDate: Date | undefined) => {
    const currentDate = selectedDate || startDate;
    setShowStartDatePicker(Platform.OS === "ios");
    setStartDate(currentDate);
    };

    const onChangeEndDate = (event: any, selectedDate: Date | undefined) => {
    const currentDate = selectedDate || endDate;
    setShowEndDatePicker(Platform.OS === "ios");
    setEndDate(currentDate);
    };

    const EditHoliday = async () => {
        if(comment.length <= 0){
            emptyComment();
        } else if (startDate > endDate){
            wrongStartDate();
        } else {
            try{
                await editHoliday.mutateAsync({
                    holidayId: id,
                    comment: comment,
                    startDate: startDate,
                    endDate: endDate
                })
            }catch (e){
                console.log(e)
            }finally{
                setComment('');
                setStartDate(new Date())
                setEndDate(new Date())
                setOpenEdit(false);
                setConfirm(false);
                router.push({pathname: '/Requests/MyHolidays'});
            }
        }
    }

    // Get type of holiday
    const initInfo = async () => {
        const type = await getTypeById(data?.typeId);
        setType(type);
        if(userInfo?.user.email !== undefined){
            const data = await getAdmin(userInfo?.user.email);
            if(data.isAdmin){
                setIsSupervisor(true);
                setIsAdmin(true);
            }
        }

        if(id !== undefined && userInfo?.user.email !== undefined){
            const data = await getOwner(id);
            if(data.owner !== userInfo?.user.email){
                setIsSupervisor(true)
            }
            setOwner(data.owner);
        }
    }

    // Download file (if it has one)
    const downloadFile = async () => {
        const url = await getFileByKey(data.fileKey);
        if(url === "ERROR"){
            fileNotFound();
        } else {
            router.push({pathname: url});
        }
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
                <Text className={('text-xs text-gray-800')}>From : {owner}</Text>
                <Text className={('text-xl font-bold text-gray-800 m-2')}>{data?.title ?? "Chargement"}</Text>
                <Text className={('text-gray-600 mt-2')}>Type : {type ?? "Chargement"}</Text>
                <Text className={('text-gray-600 mt-2')}>Statut : {data?.status ?? "Chargement"}</Text>
                <Text className={('text-gray-600 mt-2')}>Commentaire : {data?.commentaire ?? "Chargement"}</Text>
                <Text className={('text-gray-600 mt-2')}>Date de début : {new Date(data?.startDate).toLocaleDateString() ?? "Chargement"}</Text>
                <Text className={('text-gray-600 mt-2')}>Date de fin : {new Date(data?.endDate).toLocaleDateString() ?? "Chargement"}</Text>
                <Text className={('text-gray-600 mt-2')}>Mise à jour le : {new Date(data?.updateAt).toLocaleDateString() ?? "Chargement"} vers {new Date(data?.updateAt).toLocaleTimeString()}</Text>
                {data?.fileKey && !openDelete && !openEdit && !openStatus && <TouchableOpacity disabled={openDelete || openEdit || openStatus} onPress={downloadFile} className="self-center text-gray-600 hover:text-blue-600 m-4 w-[80%] bg-gray-200 p-4 rounded-lg"><Text className='text-center'>Télécharger la pièce jointe</Text></TouchableOpacity>}
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

                {/* Delete button */}
                {isAdmin && <TouchableOpacity
                    disabled={openDelete || openEdit || openStatus}
                    className={'bg-red-500 hover:bg-red-700 py-2 px-4 rounded'}
                    onPress={() => setOpenDelete(true)}
                >
                    <Text className='text-white font-bold'>Effacer</Text>
                </TouchableOpacity>}

                {/* Review button */}
                {isSupervisor && data?.status === 'ANALYSE' && <TouchableOpacity
                    disabled={openDelete || openEdit || openStatus}
                    className={'bg-green-500 hover:bg-green-700 py-2 px-4 rounded'}
                    onPress={() => setOpenStatus(true)}
                >
                    <Text className='text-white font-bold'>Répondre</Text>
                </TouchableOpacity>}

                {/* Annuler button */}
                {isSupervisor && data?.status === 'ANNULER' && <TouchableOpacity
                    disabled={openDelete || openEdit || openStatus}
                    className={'bg-green-500 hover:bg-green-700 py-2 px-4 rounded'}
                    onPress={() => setOpenStatus(true)}
                >
                    <Text className='text-white font-bold'>Activer</Text>
                </TouchableOpacity>}

                {/* Cancel button */}
                {isSupervisor && data?.status === 'ACCEPTER' && <TouchableOpacity
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

                {/* Change button */}
                {isSupervisor && data?.status === 'REFUSER' && <TouchableOpacity
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
                        <Text className='text-3xl font-bold m-4'>Editer</Text>
                        <View className="flex flex-row gap-4">
                            <View style={styles.inputContainer}>
                                <Text style={styles.label}>Date de début : {startDate.toLocaleDateString()}</Text>
                                <Button title="Choisir une date" onPress={() => setShowStartDatePicker(true)} />
                                {showStartDatePicker && (
                                    <DateTimePicker
                                    value={startDate}
                                    mode="date"
                                    is24Hour={true}
                                    onChange={onChangeStartDate}
                                    style={styles.datePicker} // Style pour le DateTimePicker
                                    />
                                )}
                            </View>

                            <View style={styles.inputContainer}>
                                <Text style={styles.label}>Date de fin : {endDate.toLocaleDateString()}</Text>
                                <Button title="Choisir une date" onPress={() => setShowEndDatePicker(true)} />
                                {showEndDatePicker && (
                                    <DateTimePicker
                                    value={endDate}
                                    mode="date"
                                    is24Hour={true}
                                    onChange={onChangeEndDate}
                                    style={styles.datePicker} // Style pour le DateTimePicker
                                    />
                                )}
                            </View>
                        </View>

                        <View style={styles.inputContainer}>
                            <Text className='text-gray-700 mb-1'>Commentaire:</Text>
                            <TextInput
                                className='border border-gray-300 rounded px-3 py-2 mb-4 w-[18em] h-[4em]'
                                value={comment}
                                onChangeText={(text) => setComment(text)}
                                multiline
                                numberOfLines={8}
                            />
                        </View>
                        {!confirm ?
                            <TouchableOpacity
                            onPress={() => setConfirm(true)}
                            className='bg-blue-500 text-white font-bold my-4 py-2 px-4 rounded'
                            >
                                <Text className='text-white'>Soumettre</Text>
                            </TouchableOpacity>
                            :
                            <TouchableOpacity
                            onPress={EditHoliday}
                            className='bg-green-500 text-lime font-bold my-4 py-2 px-4 rounded'
                            >
                                <Text className='text-white'>Etes-vous sûr ?</Text>
                            </TouchableOpacity>
                            }
                            <TouchableOpacity
                                onPress={() => {
                                    setOpenEdit(false);
                                    setConfirm(false);
                                }}
                                className='flex flex-col items-center justify-center bg-blue-100 m-4 p-2 rounded-lg w-[8em] h-[4em]'
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
                                onPress={() => {
                                    setOpenStatus(false);
                                    setConfirm(false);
                                }}
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
    inputContainer: {
        marginBottom: 15,
      },
      label: {
        fontSize: 16,
        marginBottom: 5,
      },
      input: {
        borderWidth: 1,
        borderColor: '#ccc',
        padding: 10,
        borderRadius: 5,
        fontSize: 16, // Augmenter la taille de la police du champ de texte
      },
      datePicker: {
        width: '100%', // Ajuster la largeur du DateTimePicker
      },
  });

export default HolidayItem;