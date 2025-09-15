import React, { useEffect, useState } from 'react';
import {
    IonPage, IonHeader, IonToolbar, IonTitle,
    IonContent, IonList, IonItem, IonLabel,
    IonSelect, IonSelectOption, IonFooter,
    IonButton, IonSpinner, SelectCustomEvent, IonListHeader, IonIcon,
    IonItemDivider, IonAccordionGroup, IonAccordion
} from '@ionic/react';
import { useVisitsStore } from '../../../store/visitsStore';
import { RodentDataEntity } from '../../../models/RodentDataEntity';
import { useHistory } from 'react-router';
import { locationOutline } from 'ionicons/icons';
import './StepRodentSelector.css';

const StepRodentSelector: React.FC = () => {
    const { visitCreation, masterData, saveVisitCreation, getMasterData } = useVisitsStore();
    const [rodentList, setRodentList] = useState<RodentDataEntity[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const history = useHistory();

    useEffect(() => {
        const loadData = async () => {
            setIsLoading(true);
            if (!visitCreation.selectedSpreadsheet) {
                setIsLoading(false);
                return;
            }

            await getMasterData(visitCreation.selectedSpreadsheet);
            setIsLoading(false);
        };

        loadData();
    }, [visitCreation.selectedSpreadsheet]);

    useEffect(() => {
        if (masterData.locations.length > 0 && masterData.trapStatus.length > 0) {
            const initialRodentList = masterData.locations.map(location => ({
                location,
                trap: visitCreation.rodentsData?.find(rd => rd.location.id === location.id)?.trap
            }));
            setRodentList(initialRodentList);
        }
    }, [masterData.locations.length, masterData.trapStatus.length, visitCreation.rodentsData]);

    const groupedBySector = rodentList.reduce<Record<string, RodentDataEntity[]>>((acc, rd) => {
        const sectorName = rd.location.sector?.name ?? 'Sin sector';
        if (!acc[sectorName]) acc[sectorName] = [];
        acc[sectorName].push(rd);
        return acc;
    }, {});

    const handleSaveAndReturn = () => {
        saveVisitCreation({ rodentsData: rodentList });
        history.replace('/new-visit/dashboard');
    };

    const handleMassSelect = (e: SelectCustomEvent) => {
        const selected = masterData.trapStatus.find(t => t.id === e.detail.value);
        if (!selected) return;
        setRodentList(prev => prev.map(r => ({ ...r, trap: selected })));
    };

    const handleTrapChange = (locationId: number, selId: number) => {
        setRodentList(prev => {
            const copy = [...prev];
            const locationIndex = copy.findIndex(item => item.location.id === locationId);
            if (locationIndex !== -1) {
                copy[locationIndex].trap = masterData.trapStatus.find(t => t.id === selId);
            }
            return copy;
        });
    };

    const handleSectorMassSelect = (sectorName: string, selId: number) => {
        const selected = masterData.trapStatus.find(t => t.id === selId);
        if (!selected) return;
        
        setRodentList(prev => {
            const copy = [...prev];
            copy.forEach((item, index) => {
                const itemSectorName = item.location.sector?.name ?? 'Sin sector';
                if (itemSectorName === sectorName) {
                    copy[index] = { ...item, trap: selected };
                }
            });
            return copy;
        });
    };

    return (
        <IonPage>
            <IonHeader>
                <IonToolbar>
                    <IonTitle>Seleccionar Trampas</IonTitle>
                </IonToolbar>
            </IonHeader>

            <IonContent>
                {isLoading ? (
                    <div className="loading-container">
                        <IonSpinner />
                    </div>
                ) : (
                    <>
                        <IonItem lines="none" className="mass-select-item">
                            <IonLabel>Marcar todas como:</IonLabel>
                            <IonSelect placeholder="Seleccionar" onIonChange={handleMassSelect}>
                                {masterData.trapStatus.map(trap => (
                                    <IonSelectOption key={trap.id} value={trap.id}>
                                        {trap.name}
                                    </IonSelectOption>
                                ))}
                            </IonSelect>
                        </IonItem>

                        <IonAccordionGroup>
                            {Object.entries(groupedBySector).map(([sector, items], sectorIndex) => (
                                <IonAccordion 
                                    key={`sector-${sectorIndex}-${sector}`} 
                                    value={`sector-${sectorIndex}-${sector}`} 
                                    className="sector-accordion"
                                >
                                    <IonItem slot="header" className="sector-header">
                                        <IonIcon
                                            slot="start"
                                            icon={locationOutline}
                                        />
                                        <IonLabel>
                                            <strong>SECTOR: {sector.toUpperCase()}</strong>
                                        </IonLabel>
                                    </IonItem>

                                    <div className="accordion-content" slot="content">
                                        <IonItem lines="none" className="sector-mass-select-item" style={{ 
                                            backgroundColor: '#f8f9fa', 
                                            marginBottom: '8px',
                                            '--border-radius': '8px',
                                            margin: '8px'
                                        }}>
                                            <IonLabel style={{ fontSize: '14px', fontWeight: '500' }}>
                                                Marcar todo {sector} como:
                                            </IonLabel>
                                            <IonSelect 
                                                placeholder="Seleccionar" 
                                                interface="popover"
                                                onIonChange={e => handleSectorMassSelect(sector, e.detail.value)}
                                                style={{ maxWidth: '200px' }}
                                            >
                                                {masterData.trapStatus.map(trap => (
                                                    <IonSelectOption key={trap.id} value={trap.id}>
                                                        {trap.name}
                                                    </IonSelectOption>
                                                ))}
                                            </IonSelect>
                                        </IonItem>

                                        {items.map((rodentData, locationIndex) => (
                                            <IonItem 
                                                key={`location-${sectorIndex}-${locationIndex}-${rodentData.location.id}`} 
                                                lines="inset" 
                                                className="location-item"
                                            >
                                                <IonLabel>
                                                    <span className="location-number">
                                                        #{rodentData.location.number}
                                                    </span>
                                                    <span className="location-name">
                                                        {rodentData.location.name}
                                                    </span>
                                                </IonLabel>
                                                <IonSelect
                                                    interface="popover"
                                                    value={rodentData.trap?.id}
                                                    placeholder="Seleccionar"
                                                    className="location-select"
                                                    onIonChange={e => {
                                                        const selId = e.detail.value as number;
                                                        handleTrapChange(rodentData.location.id, selId);
                                                    }}
                                                >
                                                    {masterData.trapStatus.map(trap => (
                                                        <IonSelectOption key={trap.id} value={trap.id}>
                                                            {trap.name}
                                                        </IonSelectOption>
                                                    ))}
                                                </IonSelect>
                                            </IonItem>
                                        ))}
                                    </div>
                                </IonAccordion>
                            ))}
                        </IonAccordionGroup>
                    </>
                )}
            </IonContent>

            <IonFooter>
                <IonToolbar>
                    <IonButton
                        expand="block"
                        onClick={handleSaveAndReturn}
                        disabled={isLoading}
                        className="save-button"
                    >
                        Guardar
                    </IonButton>
                </IonToolbar>
            </IonFooter>
        </IonPage>
    );
};

export default StepRodentSelector;
