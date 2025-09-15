import { useEffect, useState } from "react";
import { IonContent, IonHeader, IonItem, IonLabel, IonList, IonPage, IonTitle, IonToolbar } from "@ionic/react";
import { useHistory } from "react-router";
import Antiplaga from "../api/Antiplaga";
import { useAuthStore } from "../store/authStore";
import { VisitEntity } from "../models/VisitEntity";
import { goToDashboard } from "../helpers/visitNavigation";

const VisitLog: React.FC = () => {
  const user = useAuthStore(s => s.user)!;
  const history = useHistory();
  const [visits, setVisits] = useState<VisitEntity[]>([]);

  useEffect(() => {
    (async () => {
      const api = new Antiplaga();
      const now = new Date();
      const from = new Date(now.getFullYear(), now.getMonth(), 1).toISOString().slice(0, 10);
      const to = new Date(now.getFullYear(), now.getMonth() + 1, 0).toISOString().slice(0, 10);
      const res = await api.getMonthlyVisitLog(user.id, from, to);
      if (res.isSuccess) {
        setVisits(res.getValue()!);
      }
    })();
  }, [user.id]);

  return (
    <IonPage>
      <IonHeader>
        <IonToolbar>
          <IonTitle>Visitas del mes</IonTitle>
        </IonToolbar>
      </IonHeader>
      <IonContent fullscreen>
        <IonList>
          {visits.map(v => (
            <IonItem key={v.id} button onClick={() => goToDashboard(v, history)}>
              <IonLabel>
                <h3>{v.spreadsheet?.name} – #{v.number}</h3>
                <p>{v.date}</p>
              </IonLabel>
            </IonItem>
          ))}
        </IonList>
      </IonContent>
    </IonPage>
  );
};

export default VisitLog;
