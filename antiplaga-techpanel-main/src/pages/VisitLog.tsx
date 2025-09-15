import { useCallback, useMemo, useState } from "react";
import {
  IonContent,
  IonHeader,
  IonItem,
  IonLabel,
  IonList,
  IonPage,
  IonRefresher,
  IonRefresherContent,
  IonSpinner,
  IonTitle,
  IonToolbar,
  RefresherEventDetail,
  useIonViewWillEnter,
} from "@ionic/react";
import { useHistory } from "react-router";
import Antiplaga from "../api/Antiplaga";
import { useAuthStore } from "../store/authStore";
import { VisitEntity } from "../models/VisitEntity";
import { goToDashboard } from "../helpers/visitNavigation";

const VisitLog: React.FC = () => {
  const user = useAuthStore((state) => state.user)!;
  const history = useHistory();
  const [visits, setVisits] = useState<VisitEntity[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const range = useMemo(() => {
    const today = new Date();
    const startOfMonth = new Date(today.getFullYear(), today.getMonth(), 1);
    const endOfMonth = new Date(today.getFullYear(), today.getMonth() + 1, 0);
    const format = (date: Date) => date.toISOString().slice(0, 10);
    const formatter = new Intl.DateTimeFormat("es-AR", {
      month: "long",
      year: "numeric",
    });
    const rawLabel = formatter.format(startOfMonth);
    const label = rawLabel.charAt(0).toUpperCase() + rawLabel.slice(1);

    return {
      from: format(startOfMonth),
      to: format(endOfMonth),
      label,
    };
  }, []);

  const loadVisits = useCallback(
    async (withLoader: boolean = true) => {
      if (withLoader) {
        setLoading(true);
      }
      setError(null);

      try {
        const api = new Antiplaga();
        const response = await api.getMonthlyVisitLog(user.id, range.from, range.to);

        if (response.isSuccess) {
          const data = response.getValue() ?? [];
          const ordered = [...data].sort((a, b) => {
            const dateA = new Date(a.date).getTime();
            const dateB = new Date(b.date).getTime();
            return dateB - dateA;
          });

          setVisits(ordered);
        } else {
          setVisits([]);
          const message =
            typeof response.error === "string"
              ? response.error
              : "No se pudo cargar el registro de visitas.";
          setError(message);
        }
      } catch (err) {
        console.error("Error al cargar el registro mensual de visitas", err);
        setVisits([]);
        setError("No se pudo cargar el registro de visitas.");
      } finally {
        setLoading(false);
      }
    },
    [range.from, range.to, user.id]
  );

  useIonViewWillEnter(() => {
    loadVisits();
  });

  const handleRefresh = async (event: CustomEvent<RefresherEventDetail>) => {
    await loadVisits(false);
    event.detail.complete();
  };

  const formatVisitDate = (iso: string) => {
    const parsed = new Date(iso);
    if (Number.isNaN(parsed.getTime())) {
      return iso;
    }

    return parsed.toLocaleDateString("es-AR", {
      day: "2-digit",
      month: "long",
      year: "numeric",
    });
  };

  return (
    <IonPage>
      <IonHeader>
        <IonToolbar>
          <IonTitle>Registro de visitas</IonTitle>
        </IonToolbar>
      </IonHeader>
      <IonContent fullscreen>
        <IonRefresher slot="fixed" onIonRefresh={handleRefresh}>
          <IonRefresherContent pullingText="Desliza para actualizar" />
        </IonRefresher>

        <IonList>
          <IonItem lines="full">
            <IonLabel>
              <h2>Visitas de {range.label}</h2>
              <p>Selecciona una visita para abrirla en modo edición.</p>
            </IonLabel>
          </IonItem>

          {loading && (
            <div className="ion-padding ion-text-center">
              <IonSpinner name="crescent" />
            </div>
          )}

          {!loading && error && (
            <IonItem lines="none" color="danger">
              <IonLabel className="ion-text-wrap">{error}</IonLabel>
            </IonItem>
          )}

          {!loading && !error && visits.length === 0 && (
            <IonItem lines="none">
              <IonLabel className="ion-text-wrap">
                No se encontraron visitas para este período.
              </IonLabel>
            </IonItem>
          )}

          {!loading && !error &&
            visits.map((visit) => (
              <IonItem
                key={visit.id}
                button
                detail
                onClick={() => goToDashboard(visit, history)}
              >
                <IonLabel>
                  <h3>
                    {visit.spreadsheet?.name ?? "Visita"} – #{visit.number}
                  </h3>
                  <p>{formatVisitDate(visit.date)}</p>
                </IonLabel>
              </IonItem>
            ))}
        </IonList>
      </IonContent>
    </IonPage>
  );
};

export default VisitLog;
