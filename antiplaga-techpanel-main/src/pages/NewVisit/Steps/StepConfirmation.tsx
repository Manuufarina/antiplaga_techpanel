import React, { useState } from "react";
import {
    IonPage, IonButton, IonHeader, IonToolbar,
    IonTitle, IonContent, IonText, useIonAlert
} from "@ionic/react";
import { useVisitsStore } from "../../../store/visitsStore";
import Antiplaga from "../../../api/Antiplaga";
import { useHistory } from "react-router";
import { Result } from "../../../core/Result";

const StepConfirmation: React.FC = () => {
    const {
        visitCreation,
        resetVisitCreation,
        deleteDraft,
        addFailedVisit,
        saveDraft,
        getMissingSteps
    } = useVisitsStore();

    const [loading, setLoading] = useState(false);
    const [presentAlert] = useIonAlert();
    const history = useHistory();

    const missing = getMissingSteps();

    const saveVisit = async () => {
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
                message:
                    "No se pudo subir la visita. Se guardará offline.",
                buttons: [{ text: "OK", handler: () => history.replace("/home") }]
            });
        }
    };

    const saveAsDraft = () => {
        saveDraft();
        presentAlert({
            header: "Borrador guardado",
            message: "Tu visita incompleta se guardó correctamente.",
            buttons: [{ text: "OK", handler: () => history.replace("/home") }]
        });
    };

    return (
        <IonPage>
            <IonHeader>
                <IonToolbar>
                    <IonTitle>Confirmación</IonTitle>
                </IonToolbar>
            </IonHeader>
            <IonContent className="ion-padding">

                <IonText>
                    <p style={{ textAlign: "center" }}>
                        {missing.length > 0
                            ? `Faltan ${missing.length} paso(s).`
                            : "¡Listo! Puedes confirmar o guardar borrador."}
                    </p>
                </IonText>

                {!visitCreation.id && (
                    <IonButton
                        expand="block"
                        color="medium"
                        onClick={saveAsDraft}
                        disabled={loading}
                    >
                        {loading ? "Guardando…" : "Guardar borrador"}
                    </IonButton>
                )}

                <IonButton
                    expand="block"
                    color="primary"
                    onClick={saveVisit}
                    disabled={loading || missing.length > 0}
                >
                    {loading
                        ? "Guardando…"
                        : missing.length > 0
                            ? "Completa los pasos"
                            : visitCreation.id 
                                ? "Guardar cambios"
                                : "Guardar visita"}
                </IonButton>
            </IonContent>
        </IonPage>
    );
};

export default StepConfirmation;
