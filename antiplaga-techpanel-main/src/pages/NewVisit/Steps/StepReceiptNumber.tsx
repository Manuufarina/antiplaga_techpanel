
import React, { useState, useEffect } from 'react';
import {
    IonPage,
    IonHeader,
    IonToolbar,
    IonTitle,
    IonContent,
    IonItem,
    IonLabel,
    IonInput,
    IonText,
    IonButton,
    IonFooter
} from '@ionic/react';
import { useVisitsStore } from '../../../store/visitsStore';
import { useHistory } from 'react-router';

const StepReceiptNumber: React.FC = () => {
    const { visitCreation, saveVisitCreation } = useVisitsStore();
    const [number, setNumber] = useState('');
    const [errorMessage, setErrorMessage] = useState('');
    const history = useHistory();

    useEffect(() => {
        if (visitCreation.number) {
            setNumber(visitCreation.number);
        }
    }, [visitCreation.number]);

    const handleSave = () => {
        const currentNumber = number.trim();
        if (!currentNumber) {
            setErrorMessage('Debes ingresar un número de remito');
            return;
        }
        if (!/^\d+$/.test(currentNumber)) {
            setErrorMessage('Solo se permiten números');
            return;
        }
        saveVisitCreation({ number: currentNumber });
        history.replace('/new-visit/dashboard');
    };

    return (
        <IonPage>
            <IonHeader>
                <IonToolbar>
                    <IonTitle>Número de Remito</IonTitle>
                </IonToolbar>
            </IonHeader>

            <IonContent className="ion-padding">
                <IonItem>
                    <IonLabel position="stacked">Número de Remito</IonLabel>
                    <IonInput
                        value={number}
                        type="number"
                        inputmode="numeric"
                        placeholder="Ingresa el número de remito"
                        onIonInput={e => {
                            setNumber(e.target.value as string);
                            setErrorMessage('');
                        }}
                    />
                </IonItem>

                {errorMessage && (
                    <IonText color="danger">
                        <p>{errorMessage}</p>
                    </IonText>
                )}
            </IonContent>

            <IonFooter>
                <IonToolbar>
                    <IonButton expand="block" onClick={handleSave}>
                        Guardar
                    </IonButton>
                </IonToolbar>
            </IonFooter>
        </IonPage>
    );
};

export default StepReceiptNumber;
