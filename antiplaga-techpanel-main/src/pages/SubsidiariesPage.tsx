import {
  IonContent,
  IonHeader,
  IonItem,
  IonLabel,
  IonList,
  IonPage,
  IonSpinner,
  IonTitle,
  IonToolbar,
  IonIcon,
  useIonViewWillEnter,
} from "@ionic/react"
import { useState } from "react"
import { useSubsidiariesStore } from "../store/subsidiariesStore"
import { businessOutline, locationOutline, briefcaseOutline } from 'ionicons/icons'

const SubsidiariesPage: React.FC = () => {
  const [isLoading, setIsLoading] = useState(false)
  const subsidiaries = useSubsidiariesStore((state) => state.list)
  const { getSubsidiaries } = useSubsidiariesStore()

  useIonViewWillEnter(() => {
    (async () => {
      if (isLoading) return
      setIsLoading(true)
      await getSubsidiaries()
      setIsLoading(false)
    })()
  })

  return (
    <IonPage>
      <IonHeader>
        <IonToolbar>
          <IonTitle>Mis sucursales</IonTitle>
        </IonToolbar>
      </IonHeader>
      <IonContent fullscreen>
        <div className="ion-padding">
          <h2 style={{ 
            fontSize: '24px',
            fontWeight: '600',
            marginBottom: '24px',
            color: 'var(--ion-color-dark)'
          }}>
            Seleccionar sucursal
          </h2>

          {isLoading && subsidiaries.length === 0 ? (
            <div className="ion-text-center ion-padding">
              <IonSpinner />
            </div>
          ) : (
            <IonList lines="none" style={{ 
              background: 'transparent',
              padding: '0 8px'
            }}>
              {subsidiaries.map((subsidiary) => (
                <IonItem
                  button
                  routerLink={`subsidiaries/${subsidiary.id}`}
                  key={subsidiary.id}
                  style={{
                    '--background': 'var(--ion-color-light)',
                    '--border-radius': '12px',
                    '--padding-start': '16px',
                    '--padding-end': '16px',
                    '--padding-top': '12px',
                    '--padding-bottom': '12px',
                    marginBottom: '12px',
                    '--ripple-color': 'var(--ion-color-primary)',
                    '--background-hover': 'var(--ion-color-light-shade)',
                    '--background-activated': 'var(--ion-color-light-shade)',
                  }}
                >
                  <IonIcon
                    icon={businessOutline}
                    slot="start"
                    style={{
                      fontSize: '24px',
                      color: 'var(--ion-color-medium)',
                      marginRight: '12px'
                    }}
                  />
                  <IonLabel>
                    <h2 style={{ 
                      fontSize: '16px',
                      fontWeight: '500',
                      marginBottom: '4px',
                      color: 'var(--ion-color-dark)'
                    }}>
                      {subsidiary.name}
                    </h2>
                    <div style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '8px',
                      marginBottom: '4px'
                    }}>
                      <IonIcon
                        icon={briefcaseOutline}
                        style={{
                          fontSize: '14px',
                          color: 'var(--ion-color-medium)'
                        }}
                      />
                      <span style={{
                        fontSize: '14px',
                        color: 'var(--ion-color-medium)'
                      }}>
                        {subsidiary.client.business_name}
                      </span>
                    </div>
                    {subsidiary.address && (
                      <div style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: '8px'
                      }}>
                        <IonIcon
                          icon={locationOutline}
                          style={{
                            fontSize: '14px',
                            color: 'var(--ion-color-medium)'
                          }}
                        />
                        <span style={{
                          fontSize: '14px',
                          color: 'var(--ion-color-medium)'
                        }}>
                          {subsidiary.address}
                        </span>
                      </div>
                    )}
                  </IonLabel>
                </IonItem>
              ))}
            </IonList>
          )}
        </div>
      </IonContent>
    </IonPage>
  )
}

export default SubsidiariesPage
