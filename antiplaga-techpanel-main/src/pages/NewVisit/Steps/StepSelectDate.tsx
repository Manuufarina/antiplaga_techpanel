import React, { useState, useEffect } from 'react';
import {
    IonPage,
    IonHeader,
    IonToolbar,
    IonTitle,
    IonContent,
    IonDatetime,
    IonButton,
    useIonViewWillEnter,
    IonIcon,
    IonButtons,
} from '@ionic/react';
import { useVisitsStore } from '../../../store/visitsStore';
import { useHistory } from 'react-router';
import { calendarOutline, arrowBackOutline } from 'ionicons/icons';
import './StepSelectDate.css';

const pad2 = (n: number) => n.toString().padStart(2, '0');
const HOURS_24 = Array.from({ length: 24 }, (_, i) => i);
const MINS_60 = Array.from({ length: 60 }, (_, i) => i);

const formatDateTime = (isoString: string) => {
    const date = new Date(isoString);
    return date.toLocaleString('es-ES', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
    });
};

const getNowISO = () => {
    const d = new Date();
    const offset = d.getTimezoneOffset();
    const localDate = new Date(d.getTime() - (offset * 60 * 1000));
    return localDate.toISOString().slice(0, 16);
};

const StepSelectDate: React.FC = () => {
    const { visitCreation, saveVisitCreation } = useVisitsStore();
    const history = useHistory();

    const [selectedDateTime, setSelectedDateTime] = useState<string | null>(null);
    
    const [isoDateTime, setIsoDateTime] = useState<string>(
        visitCreation.date ?? getNowISO()
    );
    
    const getCurrentTime = () => {
        const now = new Date();
        return `${now.getFullYear()}-${pad2(now.getMonth() + 1)}-${pad2(now.getDate())}T${pad2(now.getHours())}:${pad2(now.getMinutes())}:00`;
    };

    const [displayTime, setDisplayTime] = useState<string>(getCurrentTime());

    useEffect(() => {
        if (visitCreation.date) {
            setIsoDateTime(visitCreation.date);
        }
    }, [visitCreation.date]);

    const handleSaveAndReturn = () => {
        saveVisitCreation({ date: isoDateTime });
        history.replace('/new-visit/dashboard');
    };

    const handleDateTimeChange = (e: CustomEvent) => {
        const value = e.detail.value;
        if (typeof value === 'string') {
            setSelectedDateTime(value);
            
            const date = new Date(value);
            const formattedDate = `${date.getFullYear()}-${pad2(date.getMonth() + 1)}-${pad2(date.getDate())}T${pad2(date.getHours())}:${pad2(date.getMinutes())}`;
            setIsoDateTime(formattedDate);
            
            setDisplayTime(formattedDate);
        }
    };

    return (
        <IonPage>
            <IonHeader>
                <IonToolbar>
                    <IonButtons slot="start">
                        <IonButton onClick={() => history.replace('/new-visit/dashboard')}>
                            <IonIcon slot="icon-only" icon={arrowBackOutline} />
                        </IonButton>
                    </IonButtons>
                    <IonTitle>Fecha de visita</IonTitle>
                </IonToolbar>
            </IonHeader>
            <IonContent fullscreen className="ion-padding">
                <div className="step-container">
                    <div className="header-container">
                        <div className="icon-container">
                            <IonIcon icon={calendarOutline} />
                        </div>

                        <div className="header-text">
                            <h2>Fecha y hora de la visita</h2>
                            <p>Selecciona la fecha y hora en que se realizó la visita</p>
                            <p className="selected-date">{formatDateTime(selectedDateTime || displayTime)}</p>
                        </div>
                    </div>

                    <div className="datetime-container">
                        <IonDatetime
                            presentation="date-time"
                            value={selectedDateTime || (function() {
                                const now = new Date();
                                return `${now.getFullYear()}-${pad2(now.getMonth() + 1)}-${pad2(now.getDate())}T${pad2(now.getHours())}:${pad2(now.getMinutes())}:00`;
                            })()}
                            hourCycle="h23"
                            hourValues={HOURS_24}
                            minuteValues={MINS_60}
                            onIonChange={handleDateTimeChange}
                        />
                    </div>

                    <IonButton
                        expand="block"
                        onClick={handleSaveAndReturn}
                        className="save-button"
                    >
                        Guardar
                    </IonButton>
                </div>
            </IonContent>
        </IonPage>
    );
};

export default StepSelectDate;
