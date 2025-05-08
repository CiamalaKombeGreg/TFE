import { useLocalSearchParams } from 'expo-router';
import { Text, SafeAreaView, ActivityIndicator, View, TouchableOpacity, Pressable } from 'react-native';
import { useGetHolidaysById } from '@/components/hooks/useGetHolidaysById';
import { useState } from 'react';
import { Modal } from '@/components/element/RequestsId/Modal';
import { useDeleteHoliday } from '@/components/hooks/useDeleteHoliday';
import { useRouter } from 'expo-router';

const HolidayItem = () => {
    // Init constants and hooks
    const {id} = useLocalSearchParams<{ id: string }>();
    const {data} = useGetHolidaysById(id) as any;
    const deleteHoliday = useDeleteHoliday(id);
    const router = useRouter()

    // Modals constants
    const [openEdit, setOpenEdit] = useState<boolean>(false)
    const [openDelete, setOpenDelete] = useState<boolean>(false)
    const [openStatus, setOpenStatus] = useState<boolean>(false)

    const DoReview = () => {}

    const DeleteHoliday = async (id: string) => {
        try {
            await deleteHoliday.mutateAsync(id);
        } catch (error) {
            console.error("Error deleting donation:", error);
        }finally{
            router.push({pathname: '/Requests/MyHolidays'})
        }
    }

    const EditHoliday = () => {}

    return (
        <SafeAreaView className={('bg-white p-4 rounded-lg shadow-md')}>
            <View>
                <Text className={('text-lg font-bold text-gray-800')}>{data?.title ?? "Chargement"}</Text>
                <Text className={('text-gray-600')}>Type : {data?.typeId ?? "Chargement"}</Text>
                <Text className={('text-gray-600')}>Statut : {data?.status ?? "Chargement"}</Text>
                <Text className={('text-gray-600')}>Commentaire : {data?.commentaire ?? "Chargement"}</Text>
                <Text className={('text-gray-600')}>Date de début : {data?.startDate ?? "Chargement"}</Text>
                <Text className={('text-gray-600')}>Date de fin : {data?.endDate ?? "Chargement"}</Text>
                <Text className={('text-gray-600')}>Créé le : {data?.createAt ?? "Chargement"}</Text>
                <Text className={('text-gray-600')}>Mis à jour le : {data?.updateAt ?? "Chargement"}</Text>
            </View>
            <View className={('flex-row justify-around p-4')}>

                {/* Edit button */}
                <TouchableOpacity
                    className={'bg-blue-500 hover:bg-blue-700 py-2 px-4 rounded'}
                    onPress={() => setOpenEdit(true)}
                >
                    <Text className='text-white font-bold'>Editer</Text>
                </TouchableOpacity>

                {/* Delete modal */}
                <TouchableOpacity
                    className={'bg-red-500 hover:bg-red-700 py-2 px-4 rounded'}
                    onPress={() => setOpenDelete(true)}
                >
                    <Text className='text-white font-bold'>Effacer</Text>
                </TouchableOpacity>

                {/* Review modal */}
                <TouchableOpacity
                    className={'bg-green-500 hover:bg-green-700 py-2 px-4 rounded'}
                    onPress={() => console.log("Statuer")}
                >
                    <Text className='text-white font-bold'>Statuer</Text>
                </TouchableOpacity>
            </View>
            <View className='flex justify-center items-center'>
                {/* Edit modal */}
                <Modal isOpen={openEdit}>
                    <View className={'flex items-center justify-center bg-white w-full p-4 rounded-xl'}>
                        <Text>Editer</Text>
                        <Pressable
                            onPress={() => {setOpenEdit(false)}}
                        >
                            <Text>Fermer</Text>
                        </Pressable>
                    </View>
                </Modal>

                {/* Delete modal */}
                <Modal isOpen={openDelete}>
                    <View className={'flex items-center justify-center bg-white w-full p-4 rounded-xl'}>
                        <Text className='text-red-500 font bold'>Etes-vous sûr de vouloir effacer ce congé ?</Text>
                        <Pressable
                            onPress={() => DeleteHoliday(id)}
                            className='bg-red-100 p-5'
                        >
                            <Text>Oui</Text>
                        </Pressable>
                        <Pressable
                            onPress={() => {setOpenDelete(false)}}
                            className='bg-green-100 p-5'
                        >
                            <Text>Fermer</Text>
                        </Pressable>
                    </View>
                </Modal>
            </View>
        </SafeAreaView>
    );
};

export default HolidayItem;