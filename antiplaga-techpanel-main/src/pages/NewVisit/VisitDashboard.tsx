import React, { useEffect, useState, useMemo } from 'react';
import {
    IonPage,
    IonContent,
    IonGrid,
    IonRow,
    IonCol,
    IonItem,
    IonLabel,
    IonIcon,
    IonSpinner,
    IonBadge,
    IonButton,
    useIonAlert
} from '@ionic/react';
import { useHistory } from 'react-router';
import {
    calendarOutline,
    bug,
    paw,
    chatbox,
    flask,
    document,
    person,
    people,
    receipt,
    checkmark
} from 'ionicons/icons';
import Antiplaga from '../../api/Antiplaga';
import { Result } from '../../core/Result';
import { useVisitsStore } from '../../store/visitsStore';

const allSteps = [
    { key: 'StepSelectDate',          title: 'Fecha',          icon: calendarOutline, types: ['bug','rodent'], color: '#6366F1' },
    { key: 'StepBugSelector',         title: 'Trampas',        icon: bug,      types: ['bug'], color: '#EC4899' },
    { key: 'StepRodentSelector',      title: 'Estaciones',      icon: paw,      types: ['rodent'], color: '#8B5CF6' },
    { key: 'StepObservations',        title: 'Observaciones', icon: chatbox,  types: ['bug','rodent'], color: '#14B8A6' },
    { key: 'StepSelectProducts',      title: 'Productos',     icon: flask,    types: ['bug','rodent'], color: '#F59E0B' },
    { key: 'StepDocuments',           title: 'Documentos',    icon: document, types: ['bug','rodent'], color: '#3B82F6' },
    { key: 'StepTechnicianSignature', title: 'Firma Técnico', icon: person,   types: ['bug','rodent'], color: '#10B981' },
    { key: 'StepClientSignature',     title: 'Firma Cliente', icon: people,   types: ['bug','rodent'], color: '#06B6D4' },
    { key: 'StepReceiptNumber',       title: 'N° Remito',      icon: receipt,  types: ['bug','rodent'], color: '#F43F5E' },
    { key: 'StepConfirmation',        title: 'Confirmar',     icon: checkmark,types: ['bug','rodent'], color: '#22C55E' },
];

const VisitDashboard: React.FC = () => {
    const history = useHistory();
    const [loading, setLoading] = useState(true);
    const [presentAlert] = useIonAlert();

    const {
        visitCreation,
        masterData,
        getLocations,
        getBugs,
        getTrapStatus,
        getProducts,
        getMissingSteps,
        saveDraft,
        resetVisitCreation,
        deleteDraft,
        addFailedVisit,
        getMasterData
    } = useVisitsStore();

    useEffect(() => {
        const load = async () => {
            if (!visitCreation.selectedSpreadsheet) {
                setLoading(false);
                return;
            }

            setLoading(true);
            
            await getMasterData(visitCreation.selectedSpreadsheet);
            
            setLoading(false);
        };
        load();
    }, [
        visitCreation.selectedSpreadsheet,
        visitCreation.type
    ]); 

    const stepsToRender = allSteps.filter(s => s.types.includes(visitCreation.type));
    const missingSteps   = useMemo(() => getMissingSteps(), [visitCreation, getMissingSteps]);

    const handleSaveVisit = async () => {
        const missing = getMissingSteps().filter(step =>
            step !== 'Observaciones' &&
            step !== 'Firma Cliente' &&
            step !== 'Documentos' &&
            (visitCreation.id ? step !== 'Firma Técnico' : true)
        );
        
        if (missing.length > 0) {
            return presentAlert({
                header: "Faltan pasos obligatorios",
                message: `Completa: ${missing.join(", ")}`,
                buttons: ["OK"]
            });
        }
        setLoading(true);
        const antiplaga = new Antiplaga();
        const result: Result<null> = visitCreation.id 
            ? await antiplaga.updateVisit(visitCreation.id, visitCreation)
            : await antiplaga.saveVisit(visitCreation);
        setLoading(false);

        if (result.isSuccess) {
            resetVisitCreation();
            deleteDraft();
            presentAlert({
                header: visitCreation.id ? "Visita actualizada" : "Visita creada",
                message: "¡Todo OK!",
                buttons: [{ text: "OK", handler: () => history.replace("/home") }]
            });
        } else {
            addFailedVisit(visitCreation);
            presentAlert({
                header: "Error",
                message: "No se pudo subir la visita. Se guardará offline y volvemos al home.",
                buttons: [{ text: "OK", handler: () => history.replace("/home") }]
            });
        }
    };

    const goToStep = (key: string) => {
        if (!visitCreation.selectedSpreadsheet) return;
        history.replace(`/new-visit/${key}`);
    };

    return (
        <IonPage>
            <IonContent className="ion-padding">
                <h2 style={{ 
                    textAlign: 'center',
                    fontSize: '24px',
                    fontWeight: '600',
                    marginBottom: '24px',
                    color: 'var(--ion-color-dark)'
                }}>
                    Informe de visita
                </h2>

                {loading ? (
                    <div style={{
                        display: 'flex',
                        justifyContent: 'center',
                        alignItems: 'center',
                        height: '70vh'
                    }}>
                        <IonSpinner name="crescent" />
                    </div>
                ) : (
                    <IonGrid>
                        <IonRow>
                            {stepsToRender.map(step => {
                                const isConfirm = step.key === 'StepConfirmation';

                                if (isConfirm) {
                                    return (
                                        <IonCol size="12" key={step.key} className="ion-text-center">
                                            <IonButton
                                                expand="block"
                                                onClick={() => {
                                                    const requiredStepsMissing = missingSteps.filter(step => 
                                                        step !== 'Observaciones' && 
                                                        step !== 'Firma Cliente' && 
                                                        step !== 'Documentos'
                                                    );
                                                    
                                                    if (requiredStepsMissing.length > 0 && !visitCreation.id) {
                                                        saveDraft();
                                                        presentAlert({
                                                            header: 'Borrador guardado',
                                                            message: 'Tu visita incompleta se guardó correctamente.',
                                                            buttons: [{ text: 'OK', handler: () => history.replace('/home') }]
                                                        });
                                                    } else {
                                                        handleSaveVisit();
                                                    }
                                                }}
                                                disabled={loading}
                                                style={{
                                                    '--border-radius': '12px',
                                                    '--padding-top': '12px',
                                                    '--padding-bottom': '12px',
                                                    margin: '8px 16px'
                                                }}
                                            >
                                                {missingSteps.filter(step => 
                                                    step !== 'Observaciones' && 
                                                    step !== 'Firma Cliente' && 
                                                    step !== 'Documentos'
                                                ).length > 0 && !visitCreation.id ? 'Guardar borrador' : 'Guardar visita'}
                                            </IonButton>
                                        </IonCol>
                                    );
                                }

                                const isMissing  = missingSteps.includes(step.title);
                                const isOptional =
                                    step.key === 'StepObservations' ||
                                    step.key === 'StepClientSignature' ||
                                    step.key === 'StepDocuments' ||
                                    step.key === 'StepSelectProducts';

                                let optionalOK = false;
                                if (step.key === 'StepObservations')
                                    optionalOK = !!visitCreation.comment?.trim();
                                if (step.key === 'StepClientSignature')
                                    optionalOK = !!visitCreation.signatureClient;
                                if (step.key === 'StepDocuments')
                                    optionalOK = visitCreation.documents && visitCreation.documents.length > 0;
                                if (step.key === 'StepSelectProducts')
                                    optionalOK = visitCreation.products && visitCreation.products.length > 0;

                                return (
                                    <IonCol size="6" key={step.key} className="ion-text-center">
                                        <IonItem
                                            button
                                            onClick={() => goToStep(step.key)}
                                            style={{
                                                position: 'relative',
                                                margin: '8px',
                                                height: '110px',
                                                display: 'flex',
                                                alignItems: 'center',
                                                justifyContent: 'center',
                                                '--background': 'white',
                                                '--border-radius': '16px',
                                                '--ripple-color': step.color,
                                                '--background-hover': '#F8FAFC',
                                                '--background-activated': '#F8FAFC',
                                                border: '1px solid #E2E8F0',
                                                '--padding-start': '12px',
                                                '--padding-end': '12px',
                                                '--inner-padding-end': '0',
                                                '--inner-padding-start': '0',
                                                '--padding-top': '0',
                                                '--padding-bottom': '0',
                                                '--min-height': '110px'
                                            }}
                                        >
                                            <div style={{
                                                position: 'absolute',
                                                top: 8,
                                                right: 8,
                                                width: '24px',
                                                height: '24px',
                                                display: 'flex',
                                                alignItems: 'center',
                                                justifyContent: 'center'
                                            }}>
                                                <IonBadge
                                                    color={isOptional ? (optionalOK ? 'success' : 'medium') : (isMissing ? 'danger' : 'success')}
                                                    style={{ 
                                                        '--padding-start': '8px',
                                                        '--padding-end': '8px',
                                                        '--padding-top': '4px',
                                                        '--padding-bottom': '4px',
                                                        '--border-radius': '12px',
                                                        fontSize: '12px',
                                                        '--background': isOptional 
                                                            ? (optionalOK ? '#22C55E' : '#94A3B8')
                                                            : (isMissing ? '#EF4444' : '#22C55E'),
                                                        color: 'white',
                                                        width: '24px',
                                                        height: '24px',
                                                        display: 'flex',
                                                        alignItems: 'center',
                                                        justifyContent: 'center'
                                                    }}
                                                >
                                                    {isOptional 
                                                        ? (optionalOK ? '✓' : '')
                                                        : (isMissing ? '✕' : '✓')}
                                                </IonBadge>
                                            </div>

                                            <IonLabel style={{
                                                display: 'flex',
                                                flexDirection: 'column',
                                                alignItems: 'center',
                                                justifyContent: 'center',
                                                padding: '12px',
                                                width: '100%',
                                                height: '100%'
                                            }}>
                                                <div style={{
                                                    background: `${step.color}15`,
                                                    borderRadius: '12px',
                                                    padding: '12px',
                                                    marginBottom: '8px',
                                                    width: '40px',
                                                    height: '40px',
                                                    display: 'flex',
                                                    alignItems: 'center',
                                                    justifyContent: 'center'
                                                }}>
                                                    <IonIcon
                                                        icon={step.icon}
                                                        style={{ 
                                                            fontSize: '20px',
                                                            color: step.color
                                                        }}
                                                    />
                                                </div>
                                                <span style={{ 
                                                    fontSize: '13px',
                                                    fontWeight: '500',
                                                    color: 'var(--ion-color-dark)',
                                                    margin: 0
                                                }}>
                                                    {step.title}
                                                </span>
                                            </IonLabel>
                                        </IonItem>
                                    </IonCol>
                                );
                            })}
                        </IonRow>
                    </IonGrid>
                )}
            </IonContent>
        </IonPage>
    );
};

export default VisitDashboard;
