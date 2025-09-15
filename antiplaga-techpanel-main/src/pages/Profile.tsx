import {
    IonContent,
    IonHeader,
    IonPage,
    IonTitle,
    IonToolbar,
} from "@ionic/react"
import { useAuthStore } from "../store/authStore"

const Profile: React.FC = () => {
    const { logout } = useAuthStore()

    // useEffect(() => {
    //   (async () => {
    //     const pos = await Geolocation.getCurrentPosition()
    //   })()
    // }, [])

    const onLogoutClick = () => {
        logout()
    }

    return (
        <IonPage>
            <IonHeader>
                <IonToolbar>
                    <IonTitle>Mi perfil</IonTitle>
                </IonToolbar>
            </IonHeader>
            <IonContent fullscreen className="ion-padding">
                <p className="logout" onClick={onLogoutClick}>
                    Cerrar sesión
                </p>
            </IonContent>
        </IonPage>
    )
}

export default Profile
