import React, { Fragment } from "react"
import { Route } from "react-router-dom"
import LoginPage from "../pages/LoginPage"
import { IonPage, IonRouterOutlet } from "@ionic/react"

const LoginRouter: React.FC = ({ children }) => {
  return (
    <IonPage>
      <IonRouterOutlet>
        <Route path="/" component={LoginPage} />
      </IonRouterOutlet>
    </IonPage>
  )
}

export default LoginRouter