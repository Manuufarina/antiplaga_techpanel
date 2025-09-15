// src/layout/MainRouter.tsx

import React, { useEffect, useState } from "react";
import { useIonRouter } from "@ionic/react";
import { Route, Redirect, useHistory } from "react-router-dom";
import SubsidiaryPage from "../pages/SubsidiaryPage";
import SubsidiariesPage from "../pages/SubsidiariesPage";
import Home from "../pages/Home";
import Profile from "../pages/Profile";
import IncidentsPage from "../pages/IncidentsPage";
import IncidentDetailPage from "../pages/IncidentDetailPage";
import { IonIcon, IonLabel, IonPage, IonRouterOutlet, IonTabBar, IonTabButton, IonTabs } from "@ionic/react";
import { build, home, person, alertCircle } from "ionicons/icons";
import { useAuthStore } from "../store/authStore";
import "./MainLayout.css";

const MainRouter: React.FC = () => {
  const token = useAuthStore(state => state.token);
  const history = useHistory();
  const router = useIonRouter();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!token) {
      console.log("Token not found");
      window.location.replace("/login");
      return;
    }
    setLoading(false);
  }, [token]);

  if (loading) {
    return null;
  }

  return (
      <IonPage>
        <IonTabs>
          <IonRouterOutlet>
            <Route exact path="/subsidiaries/:id" component={SubsidiaryPage} />
            <Route exact path="/subsidiaries" component={SubsidiariesPage} />
            <Route exact path="/home" component={Home} />
            <Route exact path="/profile" component={Profile} />
            <Route exact path="/incidents" component={IncidentsPage} />
            <Route exact path="/incidents/:id" component={IncidentDetailPage} />
            <Redirect exact path="/" to="/home" />
          </IonRouterOutlet>

          <IonTabBar slot="bottom" className="main-tab-bar">
            <IonTabButton tab="home" href="/home">
              <IonIcon icon={home} />
              <IonLabel>Inicio</IonLabel>
            </IonTabButton>
            <IonTabButton tab="subsidiaries" href="/subsidiaries">
              <IonIcon icon={build} />
              <IonLabel>Sucursales</IonLabel>
            </IonTabButton>
            <IonTabButton tab="incidents" href="/incidents">
              <IonIcon icon={alertCircle} />
              <IonLabel>Incidentes</IonLabel>
            </IonTabButton>
            <IonTabButton tab="profile" href="/profile">
              <IonIcon icon={person} />
              <IonLabel>Perfil</IonLabel>
            </IonTabButton>
          </IonTabBar>
        </IonTabs>
      </IonPage>
  );
};

export default MainRouter;
