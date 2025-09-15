import React, {useState, useEffect, useRef} from "react";
import {
  IonPage, IonHeader, IonToolbar, IonTitle, IonContent, IonImg,
  IonItemDivider, IonAccordionGroup, IonAccordion, IonItem,
  IonLabel, IonList, IonButton, IonSpinner, IonCard,
  IonCardHeader, IonCardTitle, IonCardContent, useIonViewWillEnter,
  IonIcon
} from "@ionic/react";
import { checkmarkCircle, closeCircle } from "ionicons/icons";
import { useHistory } from "react-router";
import AntiplagaLogoImage from "../images/antiplagalogo.jpg";
import { useAuthStore } from "../store/authStore";
import { useVisitsStore } from "../store/visitsStore";
import { VisitEntity } from "../models/VisitEntity";
import Antiplaga from "../api/Antiplaga";
import "./Home.css";
import { goToDashboard } from "../helpers/visitNavigation";

const Home: React.FC = () => {
  const user = useAuthStore(s => s.user)!;
  const history            = useHistory();
  const drafts             = useVisitsStore(s => s.drafts);
  const loadDraft          = useVisitsStore(s => s.loadDraft);

  const [lastVisits, setLastVisits] = useState<VisitEntity[]>([]);
  const [syncingIds, setSyncingIds] = useState<number[]>([]);
  const [expanded, setExpanded]     = useState<string[]>([]);
  const initialized = useRef(false);

  useIonViewWillEnter(() => {
    (async () => {
      const api = new Antiplaga();
      const res = await api.getLastVisits(user.id);
      if (res.isSuccess) {
        const backend = res.getValue()!;
        const offline = useVisitsStore.getState().list.filter(v => v.sync_status === "failed");
        setLastVisits([...backend, ...offline]);
      }
    })();
  });

  const confirmed = lastVisits.filter(v => v.sync_status !== "failed");
  const offline   = lastVisits.filter(v => v.sync_status === "failed");

  useEffect(() => {
    if (initialized.current) return;

    if (lastVisits.length === 0 && drafts.length === 0) return;

    if (drafts.length > 0) {
      setExpanded(["draft"]);
    } else if (offline.length > 0) {
      setExpanded(["offline"]);
    } else {
      setExpanded([]);
    }

    initialized.current = true;
  }, [lastVisits.length, drafts.length, offline.length]);

  const retrySingleOffline = async (visit: any) => {
    console.log("🔄 retrySingleOffline - Sincronizando visita individual:", visit);
    setSyncingIds([visit.id]);
    
    try {
      await useVisitsStore.getState().syncVisit(visit);
      console.log("✅ retrySingleOffline - Visita sincronizada exitosamente");
      
      // Actualizar la lista de visitas
      const api = new Antiplaga();
      const res = await api.getLastVisits(user.id);
      if (res.isSuccess) {
        const backend = res.getValue()!;
        const offline = useVisitsStore.getState().list.filter(v => (v as any).sync_status === "failed");
        setLastVisits([...backend, ...offline]);
      }
    } catch (error) {
      console.error("❌ retrySingleOffline - Error al sincronizar:", error);
    } finally {
      setSyncingIds(ids => ids.filter(id => id !== visit.id));
    }
  };

  const retryAllOffline = async () => {
    const fails = useVisitsStore.getState().list.filter(v => (v as any).sync_status === "failed");
    setSyncingIds(fails.map(f => f.id));
    for (const v of fails) {
      await useVisitsStore.getState().syncVisit(v);
      setSyncingIds(ids => ids.filter(id => id !== v.id));
    }
    const api = new Antiplaga();
    const res = await api.getLastVisits(user.id);
    if (res.isSuccess) {
      const backend = res.getValue()!;
              const offline = useVisitsStore.getState().list.filter(v => (v as any).sync_status === "failed");
      setLastVisits([...backend, ...offline]);
    }
  };

  return (
      <IonPage>
        <IonHeader>
          <IonToolbar>
            <IonTitle>AntiplagaNorte</IonTitle>
          </IonToolbar>
        </IonHeader>
        <IonContent fullscreen>
          <div className="welcome-section">
            <p>Bienvenido de nuevo, {user.first_name}</p>
          </div>
          <div className="logo-container">
            <IonImg src={AntiplagaLogoImage} />
          </div>

          <IonButton expand="block" routerLink="/visit-log">
            Registro mensual de visitas
          </IonButton>

          <IonAccordionGroup
              multiple
              value={expanded}
              onIonChange={e => setExpanded(e.detail.value as string[])}
          >
            <IonAccordion value="draft">
              <IonItem slot="header">
                <IonLabel>
                  <strong>Visitas sin terminar</strong>
                  <span className={`count-badge ${drafts.length > 0 ? 'has-items' : ''}`}>
                    ({drafts.length})
                  </span>
                </IonLabel>
              </IonItem>
              <div slot="content">
                {drafts.length > 0 ? (
                    <IonList>
                      {drafts.map((draft, index) => (
                        <IonCard key={draft.draftId} className="unfinished-visit" button onClick={() => {
                          loadDraft(index);
                          history.push("/new-visit/dashboard");
                        }}>
                          <IonCardHeader>
                            <IonCardTitle>
                              {draft.selectedSpreadsheet?.name}
                            </IonCardTitle>
                          </IonCardHeader>
                          <IonCardContent>
                            <div className="steps-info">
                              <span>Te faltan</span>
                              <span className="steps-badge">
                                {useVisitsStore.getState().getMissingSteps().filter(step => 
                                  step !== 'Observaciones' && 
                                  step !== 'Firma Cliente' && 
                                  step !== 'Documentos' &&
                                  step !== 'Productos'
                                ).length} pasos
                              </span>
                            </div>
                            <div className="draft-info">
                              <small>Guardado: {new Date(draft.draftTimestamp!).toLocaleString()}</small>
                            </div>
                            <IonButton className="continue-button" fill="clear">
                              Continuar
                            </IonButton>
                          </IonCardContent>
                        </IonCard>
                      ))}
                    </IonList>

) : (
                    <IonItem className="empty-state">
                      <IonLabel>No hay visitas sin terminar</IonLabel>
                    </IonItem>
                )}
              </div>
            </IonAccordion>

            <IonAccordion value="offline">
              <IonItem slot="header">
                <IonLabel>
                  <strong>Visitas offline</strong>
                  <span className={`count-badge ${offline.length > 0 ? 'has-items' : ''}`}>
                    ({offline.length})
                  </span>
                </IonLabel>
              </IonItem>
              <div slot="content">
                <IonList>
                  {offline.length ? offline.map(v => {
                    const syncing = syncingIds.includes(v.id);
                    return (
                        <IonItem
                            key={v.id}
                            button
                            onClick={() => retrySingleOffline(v)}
                        >
                          <IonLabel>
                            <h3>{v.spreadsheet?.name} – #{v.number}</h3>
                            <p>{v.date}</p>
                          </IonLabel>
                          {syncing
                              ? <IonSpinner slot="end" color="warning" />
                              : <IonIcon slot="end" icon={closeCircle} color="danger" />
                          }
                        </IonItem>
                    );
                  }) : (
                      <IonItem className="empty-state">
                        <IonLabel>No hay visitas offline</IonLabel>
                      </IonItem>
                  )}
                </IonList>
                {offline.length > 0 && (
                    <IonButton
                        expand="block"
                        color="warning"
                        onClick={retryAllOffline}
                    >
                      Reintentar todas
                    </IonButton>
                )}
              </div>
            </IonAccordion>

            <IonAccordion value="confirmed">
              <IonItem slot="header">
                <IonLabel>
                  <strong>Últimas visitas</strong>
                  <span className={`count-badge ${confirmed.length > 0 ? 'has-items' : ''}`}>
                    ({confirmed.length})
                  </span>
                </IonLabel>
              </IonItem>
              <div slot="content">
                <IonList>
                  {confirmed.length ? confirmed.map(v => (
                      <IonItem key={v.id} button onClick={() => goToDashboard(v, history)}>
                        <IonLabel>
                          <h3>{v.spreadsheet?.name} – #{v.number}</h3>
                          <p>{v.date}</p>
                        </IonLabel>
                        <IonIcon slot="end" icon={checkmarkCircle} color="success" />
                      </IonItem>
                  )) : (
                      <IonItem className="empty-state">
                        <IonLabel>No hay últimas visitas</IonLabel>
                      </IonItem>
                  )}
                </IonList>
              </div>
            </IonAccordion>
          </IonAccordionGroup>

          <p className="versionNumber">Versión 1.1.0</p>
        </IonContent>
      </IonPage>
  );
};

export default Home;
