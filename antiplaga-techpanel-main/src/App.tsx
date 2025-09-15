import { IonApp, IonRouterOutlet } from '@ionic/react';
import { IonReactRouter } from '@ionic/react-router';

/* Core CSS required for Ionic components to work properly */
import '@ionic/react/css/core.css';

/* Basic CSS for apps built with Ionic */
import '@ionic/react/css/normalize.css';
import '@ionic/react/css/structure.css';
import '@ionic/react/css/typography.css';

/* Optional CSS utils that can be commented out */
import '@ionic/react/css/padding.css';
import '@ionic/react/css/float-elements.css';
import '@ionic/react/css/text-alignment.css';
import '@ionic/react/css/text-transformation.css';
import '@ionic/react/css/flex-utils.css';
import '@ionic/react/css/display.css';
import './theme/app.scss';

/* Theme variables */
import './theme/variables.css';
import MainRouter from './layout/MainRouter';
import LoginRouter from './layout/LoginRouter';
import React from 'react';
import { Route, Switch } from 'react-router-dom';
import GlobalLoader from './components/GlobalLoader';

import VisitRouter from "./layout/VisitRouter";

const App: React.FC = () => {
    return (
        <IonApp>
            <GlobalLoader />
            <IonReactRouter>
                <IonRouterOutlet>
                    <Switch>
                        <Route path="/login" component={LoginRouter} />
                        <Route path="/new-visit" component={VisitRouter} />
                        <Route path="/" component={MainRouter} />

                    </Switch>
                </IonRouterOutlet>
            </IonReactRouter>
        </IonApp>
    );
};

export default App;
