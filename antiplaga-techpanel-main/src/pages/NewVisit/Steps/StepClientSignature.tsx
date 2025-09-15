
import React, { useRef, useEffect } from 'react';
import {
    IonPage,
    IonHeader,
    IonToolbar,
    IonTitle,
    IonContent,
    IonButton,
    IonFooter
} from '@ionic/react';
import SignatureCanvas from 'react-signature-canvas';
import { useVisitsStore } from '../../../store/visitsStore';
import { useHistory } from 'react-router';

const StepClientSignature: React.FC = () => {
    const { visitCreation, saveVisitCreation } = useVisitsStore();
    const canvasRef = useRef<SignatureCanvas>(null);
    const history = useHistory();

    useEffect(() => {
        if (visitCreation.signatureClient) {
            canvasRef.current?.fromDataURL(visitCreation.signatureClient);
        }
    }, [visitCreation.signatureClient]);

    const handleClear = () => {
        canvasRef.current?.clear();
    };

    const handleSaveAndReturn = () => {
        const signature = canvasRef.current?.toDataURL() || '';
        saveVisitCreation({ signatureClient: signature });
        history.replace('/new-visit/dashboard');
    };

    return (
        <IonPage>
            <IonHeader>
                <IonToolbar>
                    <IonTitle>Firma del Cliente</IonTitle>
                </IonToolbar>
            </IonHeader>

            <IonContent className="ion-padding">
                <div style={{ border: '1px solid #000', margin: '20px 0' }}>
                    <SignatureCanvas
                        ref={canvasRef}
                        penColor="black"
                        canvasProps={{ width: 300, height: 200 }}
                    />
                </div>
                <IonButton expand="block" onClick={handleClear}>
                    Limpiar Firma
                </IonButton>
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

export default StepClientSignature;
