import React, { useState, useEffect } from 'react';
import {
    IonPage, IonHeader, IonToolbar, IonTitle,
    IonContent, IonItem, IonLabel, IonTextarea,
    IonFooter, IonButton
} from '@ionic/react';
import { useVisitsStore } from '../../../store/visitsStore';
import { useHistory } from 'react-router';

const StepObservations: React.FC = () => {
    const { visitCreation, saveVisitCreation, saveDraft } = useVisitsStore();
    const [comment, setComment] = useState(visitCreation.comment || '');
    const history = useHistory();

    useEffect(() => {
        setComment(visitCreation.comment || '');
    }, [visitCreation.comment]);

    const handleSaveAndReturn = () => {
        saveVisitCreation({ comment });
        saveDraft();
        history.replace('/new-visit/dashboard');
    };

    return (
        <IonPage>
            <IonHeader>
                <IonToolbar>
                    <IonTitle>Observaciones</IonTitle>
                </IonToolbar>
            </IonHeader>

            <IonContent className="ion-padding">
                <IonItem>
                    <IonLabel position="stacked">Observaciones</IonLabel>
                    <IonTextarea
                        value={comment}
                        placeholder="¿Tenés alguna observación de la visita?"
                        onIonInput={e => setComment(e.detail.value!)}
                    />
                </IonItem>
            </IonContent>

            <IonFooter>
                <IonToolbar>
                    <IonButton expand="block" onClick={handleSaveAndReturn}>
                        Guardar
                    </IonButton>
                </IonToolbar>
            </IonFooter>
        </IonPage>
    );
};

export default StepObservations;
