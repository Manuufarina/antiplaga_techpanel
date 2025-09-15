import React from 'react';
import { IonPage, IonRouterOutlet, useIonRouter } from '@ionic/react';
import { Route } from 'react-router-dom';

import VisitDashboard from '../pages/NewVisit/VisitDashboard';
import StepSelectDate from '../pages/NewVisit/Steps/StepSelectDate';
import StepBugSelector from '../pages/NewVisit/Steps/StepBugSelector';
import StepRodentSelector from '../pages/NewVisit/Steps/StepRodentSelector';
import StepObservations from '../pages/NewVisit/Steps/StepObservations';
import StepSelectProducts from '../pages/NewVisit/Steps/StepSelectProducts';
import StepDocuments from '../pages/NewVisit/Steps/StepDocuments';
import StepTechnicianSignature from '../pages/NewVisit/Steps/StepTechnicianSignature';
import StepClientSignature from '../pages/NewVisit/Steps/StepClientSignature';
import StepReceiptNumber from '../pages/NewVisit/Steps/StepReceiptNumber';
import StepConfirmation from '../pages/NewVisit/Steps/StepConfirmation';

const VisitRouter: React.FC = () => {
    const router = useIonRouter();

    const stepComponents: Record<string, React.FC<any>> = {
        StepSelectDate,
        StepBugSelector,
        StepRodentSelector,
        StepObservations,
        StepSelectProducts,
        StepDocuments,
        StepTechnicianSignature,
        StepClientSignature,
        StepReceiptNumber,
        StepConfirmation
    };

    const orderedSteps = [
        'StepSelectDate',
        'StepBugSelector',
        'StepRodentSelector',
        'StepObservations',
        'StepSelectProducts',
        'StepDocuments',
        'StepTechnicianSignature',
        'StepClientSignature',
        'StepReceiptNumber',
        'StepConfirmation'
    ];

    return (
        <IonPage>
            <IonRouterOutlet>
                <Route exact path="/new-visit/dashboard" component={VisitDashboard} />
                {orderedSteps.map((stepKey, index) => {
                    const StepComponent = stepComponents[stepKey];
                    const nextStep = index < orderedSteps.length - 1 ? orderedSteps[index + 1] : 'dashboard';
                    return (
                        <Route
                            key={stepKey}
                            exact
                            path={`/new-visit/${stepKey}`}
                            render={() => (
                                <StepComponent onNext={() => router.push(`/new-visit/${nextStep}`, 'forward')} />
                            )}
                        />
                    );
                })}
            </IonRouterOutlet>
        </IonPage>
    );
};

export default VisitRouter;
