import { Modal as RNModal, ModalProps, KeyboardAvoidingView, View, Platform} from 'react-native'

type NewModalProps = ModalProps & {
    isOpen: boolean,
    withInput?: boolean,
}

export const Modal = ({isOpen, withInput, children, ...props}: NewModalProps) => {
    const content = withInput ? 
        (<KeyboardAvoidingView
            className="flex flex-col items-center justify-center px-3 bg-zinc-900/40"
            behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        >
            {children}
        </KeyboardAvoidingView>)
        :
        (<View className="flex flex-col items-center justify-center px-3 bg-zinc-900/40">
            {children}
        </View>)

    return(
        <RNModal
            visible={isOpen}
            transparent
            animationType='fade'
            statusBarTranslucent
            {...props}
        >
            {content}
        </RNModal>
    )
}