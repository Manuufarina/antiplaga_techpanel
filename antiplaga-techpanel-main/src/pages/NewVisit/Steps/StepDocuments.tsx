
import React, { useState, useEffect } from 'react';
import {
    IonPage,
    IonHeader,
    IonToolbar,
    IonTitle,
    IonContent,
    IonList,
    IonItem,
    IonLabel,
    IonNote,
    IonThumbnail,
    IonButton,
    IonFooter,
    IonIcon,
} from '@ionic/react';
import { trashOutline } from 'ionicons/icons';
import { useVisitsStore } from '../../../store/visitsStore';
import { usePhotoGallery } from '../../../helpers/helpers';
import { DocumentEntity } from '../../../models/DocumentEntity';
import { useHistory } from 'react-router';

const StepDocuments: React.FC = () => {
    const { visitCreation, saveVisitCreation } = useVisitsStore();
    const [documents, setDocuments] = useState<DocumentEntity[]>(visitCreation.documents || []);
    const { takePhoto } = usePhotoGallery();
    const history = useHistory();

    useEffect(() => {
        setDocuments(visitCreation.documents || []);
    }, [visitCreation.documents]);

    const addPhoto = async (type: 'photo' | 'receipt') => {
        const photo = await takePhoto();
        if (!photo) return;
        const newDoc: DocumentEntity = {
            type,
            base64image: photo.base64String!,
        };
        setDocuments(prev => [...prev, newDoc]);
    };

    const deleteDocument = (idx: number) => {
        setDocuments(prev => prev.filter((_, i) => i !== idx));
    };

    const handleSaveAndReturn = () => {
        saveVisitCreation({ documents });
        history.replace('/new-visit/dashboard');
    };

    return (
        <IonPage>
            <IonHeader>
                <IonToolbar>
                    <IonTitle>Documentos</IonTitle>
                </IonToolbar>
            </IonHeader>

            <IonContent fullscreen className="ion-padding">
                <IonList>
                    {documents.map((doc, idx) => (
                        <IonItem key={idx}>
                            <IonThumbnail slot="start">
                                <img
                                    src={`data:image/jpeg;base64,${doc.base64image}`}
                                    alt={doc.type}
                                />
                            </IonThumbnail>
                            <IonLabel>
                                {doc.type === 'photo' ? 'Foto' : 'Comprobante'}
                            </IonLabel>
                            <IonNote slot="end">
                                <IonIcon
                                    icon={trashOutline}
                                    onClick={() => deleteDocument(idx)}
                                />
                            </IonNote>
                        </IonItem>
                    ))}
                </IonList>

                <IonButton expand="block" className="ion-margin-top" onClick={() => addPhoto('photo')}>
                    Agregar Foto
                </IonButton>
                <IonButton expand="block" onClick={() => addPhoto('receipt')}>
                    Agregar Comprobante
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

export default StepDocuments;
