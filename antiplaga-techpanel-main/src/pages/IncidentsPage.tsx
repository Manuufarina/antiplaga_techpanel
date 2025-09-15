import React, { useEffect, useState } from "react";
import {
  IonPage,
  IonHeader,
  IonToolbar,
  IonTitle,
  IonContent,
  IonList,
  IonItem,
  IonLabel,
  IonButton,
  IonSpinner,
  IonIcon
} from "@ionic/react";
import { useHistory } from "react-router";
import { useAuthStore } from "../store/authStore";
import Antiplaga from "../api/Antiplaga";
import { IncidentEntity } from "../models/IncidentEntity";
import { checkmarkCircle, timeOutline, closeCircle, ellipsisHorizontal, warningOutline } from "ionicons/icons";
import { useIonViewWillEnter } from "@ionic/react";

const statusIcon = {
  Pendiente: warningOutline,
  'En Proceso': timeOutline,
  Resuelto: checkmarkCircle,
  Rechazado: closeCircle
};

// Mapeo de estados del backend a frontend
const statusMapping = {
  pending: 'Pendiente',
  'in-process': 'En Proceso',
  resolved: 'Resuelto',
  rejected: 'Rechazado'
};

const getStatusDisplay = (status: string) => {
  return statusMapping[status as keyof typeof statusMapping] || status;
};

const getStatusColor = (status: string) => {
  const statusKey = getStatusDisplay(status);
  switch (statusKey) {
    case 'Pendiente': return 'warning';
    case 'En Proceso': return 'orange';
    case 'Resuelto': return 'success';
    case 'Rechazado': return 'danger';
    default: return 'medium';
  }
};

const IncidentsPage: React.FC = () => {
  const user = useAuthStore(s => s.user)!;
  const [incidents, setIncidents] = useState<IncidentEntity[]>([]);
  const [loading, setLoading] = useState(false);
  const history = useHistory();

  useEffect(() => {
    const fetchIncidents = async () => {
      setLoading(true);
      const api = new Antiplaga();
      const res = await api.getIncidents();
      if (res.isSuccess) {
        const value: any = res.getValue();
        const incidentsArray: any[] = Array.isArray(value) ? value : (value?.data || []);
        const filteredIncidents = incidentsArray.filter((i: any) => i.user_id === user.id);
        setIncidents(filteredIncidents);
      }
      setLoading(false);
    };
    fetchIncidents();
  }, [user.id]);

  useIonViewWillEnter(() => {
    const fetchIncidents = async () => {
      setLoading(true);
      const api = new Antiplaga();
      const res = await api.getIncidents();
      if (res.isSuccess) {
        const value: any = res.getValue();
        const incidentsArray: any[] = Array.isArray(value) ? value : (value?.data || []);
        const filteredIncidents = incidentsArray.filter((i: any) => i.user_id === user.id);
        setIncidents(filteredIncidents);
      }
      setLoading(false);
    };
    fetchIncidents();
  });

  return (
    <IonPage>
      <IonHeader>
        <IonToolbar>
          <IonTitle>Incidentes</IonTitle>
        </IonToolbar>
      </IonHeader>
      <IonContent fullscreen>
        {loading ? (
          <IonSpinner />
        ) : (
          <IonList>
            {incidents.length === 0 ? (
              <IonItem>
                <IonLabel>No hay incidentes asignados</IonLabel>
              </IonItem>
            ) : (
              incidents.map(incident => (
                <IonItem key={incident.id} button onClick={() => history.push(`/incidents/${incident.id}`)}>
                  <IonLabel>
                    <h3>Incidente #{incident.id}</h3>
                    <p>{incident.location} <span style={{ fontSize: '0.9em', color: '#666' }}>{getStatusDisplay(incident.status)}</span></p>
                  </IonLabel>
                  <IonIcon 
                    slot="end" 
                    icon={statusIcon[getStatusDisplay(incident.status) as keyof typeof statusIcon]} 
                    style={{ color: getStatusColor(incident.status) === 'warning' ? '#ffc409' : 
                             getStatusColor(incident.status) === 'orange' ? '#ff6b35' :
                             getStatusColor(incident.status) === 'success' ? '#2dd36f' :
                             getStatusColor(incident.status) === 'danger' ? '#eb445a' : '#6c757d' }}
                  />
                </IonItem>
              ))
            )}
          </IonList>
        )}
      </IonContent>
    </IonPage>
  );
};

export default IncidentsPage; 