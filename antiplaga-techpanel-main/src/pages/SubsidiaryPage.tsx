import {
  IonAlert,
  IonLoading,
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
  IonChip,
  IonText,
  useIonViewWillEnter,
} from "@ionic/react";
import React, { useState, useEffect } from "react";
import { RouteComponentProps, useHistory } from "react-router";
import { SpreadsheetTypePill } from "../components/SpreadsheetTypePill";
import { useSpreadsheetsStore } from "../store/spreadsheetsStore";
import { useVisitsStore } from "../store/visitsStore";
import { SpreadsheetEntity } from "../models/SpreadsheetEntity";
import { documentTextOutline } from 'ionicons/icons';

interface SubsidiaryPageProps
    extends RouteComponentProps<{ id: string }> {}

const SubsidiaryPage: React.FC<SubsidiaryPageProps> = ({ match }) => {
  const [isLoadingList, setIsLoadingList] = useState(false);
  const [isPreloadingVisit, setIsPreloadingVisit] = useState(false);
  const spreadsheets = useSpreadsheetsStore((s) => s.list);
  const { getSpreadsheets } = useSpreadsheetsStore();
  const draft = useVisitsStore((s) => s.draft);
  const {
    resetVisitCreation,
    saveSelectedSpreadsheet,
    deleteDraft,
    loadDraft,
    getMasterData,
  } = useVisitsStore();
  const [selectedSpreadsheet, setSelectedSpreadsheet] =
      useState<SpreadsheetEntity | null>(null);
  const [showConfirm, setShowConfirm] = useState(false);
  const history = useHistory();

  useIonViewWillEnter(() => {
    (async () => {
      if (isLoadingList) return;
      setIsLoadingList(true);
      await getSpreadsheets(+match.params.id);
      setIsLoadingList(false);
    })();
  });

  const onSpreadsheetClick = async (sheet: SpreadsheetEntity) => {
    setIsPreloadingVisit(true);
    if (!draft) {
      resetVisitCreation();
      saveSelectedSpreadsheet(sheet);
      await getMasterData(sheet);
      setIsPreloadingVisit(false);
      history.replace(`/new-visit/dashboard`);
      return;
    }

    console.log('tucson 4')
    if (draft.selectedSpreadsheet?.id === sheet.id) {
      loadDraft();
      await getMasterData(draft.selectedSpreadsheet);
      setIsPreloadingVisit(false);
      history.replace(`/new-visit/dashboard`);
      return;
    }

    setIsPreloadingVisit(false);
    setSelectedSpreadsheet(sheet);
    setShowConfirm(true);
  };

  return (
      <IonPage>
        <IonHeader>
          <IonToolbar>
            <IonTitle>Sucursal</IonTitle>
          </IonToolbar>
        </IonHeader>

        <IonLoading
            isOpen={isPreloadingVisit}
            message="Cargando visita…"
            spinner="crescent"
        />

        <IonAlert
            isOpen={showConfirm}
            onDidDismiss={() => setShowConfirm(false)}
            header="Un momento"
            message="Ya tenés guardada una visita pendiente…"
            buttons={[
              {
                text: "Crear una nueva",
                handler: async () => {
                  setIsPreloadingVisit(true);
                  deleteDraft();
                  resetVisitCreation();
                  saveSelectedSpreadsheet(selectedSpreadsheet!);
                  await getMasterData(selectedSpreadsheet!);
                  setIsPreloadingVisit(false);
                  history.replace(`/new-visit/dashboard`);
                },
              },
              {
                text: "Usar visita previa",
                handler: async () => {
                  setIsPreloadingVisit(true);
                  loadDraft();
                  if (draft?.selectedSpreadsheet) {
                    await getMasterData(draft.selectedSpreadsheet);
                    setIsPreloadingVisit(false);
                    history.replace(`/new-visit/dashboard`);
                  }
                },
              },
            ]}
        />

        <IonContent fullscreen>
          <div className="ion-padding">
            <h2 style={{ 
              fontSize: '24px',
              fontWeight: '600',
              marginBottom: '24px',
              color: 'var(--ion-color-dark)'
            }}>
              Crear nueva visita
            </h2>

            {isLoadingList ? (
              <div className="ion-text-center ion-padding">
                <IonSpinner />
              </div>
            ) : (
              <IonList lines="none" style={{ 
                background: 'transparent',
                padding: '0 8px'
              }}>
                {spreadsheets.map((sheet) => (
                  <IonItem
                    button
                    key={sheet.id}
                    onClick={() => onSpreadsheetClick(sheet)}
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
                      icon={documentTextOutline}
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
                        {sheet.name}
                      </h2>
                    </IonLabel>
                  </IonItem>
                ))}
              </IonList>
            )}
          </div>
        </IonContent>
      </IonPage>
  );
};

export default SubsidiaryPage;
