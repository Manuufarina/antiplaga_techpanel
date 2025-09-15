import React, { useState, useEffect } from 'react';
import { IonPage, IonContent } from '@ionic/react';
import { useVisitsStore } from '../../store/visitsStore';
import StepBugSelector from './Steps/StepBugSelector';
import StepRodentSelector from './Steps/StepRodentSelector';
import StepObservations from './Steps/StepObservations';
import StepSelectProducts from './Steps/StepSelectProducts';
import StepDocuments from './Steps/StepDocuments';
import StepTechnicianSignature from './Steps/StepTechnicianSignature';
import StepClientSignature from './Steps/StepClientSignature';
import StepReceiptNumber from './Steps/StepReceiptNumber';
import StepConfirmation from './Steps/StepConfirmation';
import StepSelectDate from './Steps/StepSelectDate';

const stepsOrderBug = [
    'StepSelectDate',
    'StepBugSelector',
    'StepObservations',
    'StepSelectProducts',
    'StepDocuments',
    'StepTechnicianSignature',
    'StepClientSignature',
    'StepReceiptNumber',
    'StepConfirmation',
];

const stepsOrderRodent = [
    'StepSelectDate',
    'StepRodentSelector',
    'StepObservations',
    'StepSelectProducts',
    'StepDocuments',
    'StepTechnicianSignature',
    'StepClientSignature',
    'StepReceiptNumber',
    'StepConfirmation',
];

const VisitWizard: React.FC = () => {
    const [currentStepIndex, setCurrentStepIndex] = useState(0);
    const { visitCreation, getMasterData } =
        useVisitsStore();

    const stepsOrder =
        visitCreation.type === 'bug' ? stepsOrderBug : stepsOrderRodent;

    const currentStepKey = stepsOrder[currentStepIndex];

    const goToNextStep = () => {
        if (currentStepIndex < stepsOrder.length - 1) {
            setCurrentStepIndex(currentStepIndex + 1);
        }
    };

    const goToPreviousStep = () => {
        if (currentStepIndex > 0) {
            setCurrentStepIndex(currentStepIndex - 1);
        }
    };

    useEffect(() => {
        const loadMasterData = async () => {
            if (visitCreation.selectedSpreadsheet) {
                await getMasterData(visitCreation.selectedSpreadsheet);
            }
        };
        loadMasterData();
    }, [
        visitCreation.selectedSpreadsheet,
        visitCreation.type
    ]); 

    const renderCurrentStep = () => {
        switch (currentStepKey) {
            case 'StepSelectDate':
                return <StepSelectDate />;
            case 'StepBugSelector':
                return <StepBugSelector />;
            case 'StepRodentSelector':
                return <StepRodentSelector />;
            case 'StepObservations':
                return <StepObservations />;
            case 'StepSelectProducts':
                return <StepSelectProducts />;
            case 'StepDocuments':
                return <StepDocuments />;
            case 'StepTechnicianSignature':
                return <StepTechnicianSignature />;
            case 'StepClientSignature':
                return <StepClientSignature />;
            case 'StepReceiptNumber':
                return <StepReceiptNumber />;
            case 'StepConfirmation':
                return <StepConfirmation />;
            default:
                return <div>Paso no encontrado</div>;
        }
    };

    return (
        <IonPage>
            <IonContent>{renderCurrentStep()}</IonContent>
        </IonPage>
    );
};

export default VisitWizard;
