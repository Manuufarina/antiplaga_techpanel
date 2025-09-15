import React from "react"
import { IonIcon, IonLabel, IonTabBar, IonTabButton } from "@ionic/react"
import { build, home, person } from "ionicons/icons"
import "./MainLayout.css"

interface MainLayoutProps {
  children: React.ReactNode;
}

const MainLayout: React.FC<MainLayoutProps> = ({children}) => {
  return (
    <>
      <IonTabBar slot="bottom">
        <IonTabButton tab="home" href="/home">
          <IonIcon icon={home} />
          <IonLabel>Inicio</IonLabel>
        </IonTabButton>
        <IonTabButton tab="subsidiaries" href="/subsidiaries">
          <IonIcon icon={build} />
          <IonLabel>Sucursales</IonLabel>
        </IonTabButton>
        <IonTabButton tab="profile" href="/profile">
          <IonIcon icon={person} />
          <IonLabel>Perfil</IonLabel>
        </IonTabButton>
      </IonTabBar>
      {children}
    </>
  )
}

export default MainLayout