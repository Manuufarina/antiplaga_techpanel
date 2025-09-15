import React, { useEffect, useState } from 'react';
import {
    IonPage,
    IonHeader,
    IonToolbar,
    IonTitle,
    IonContent,
    IonList,
    IonItem,
    IonLabel,
    IonInput,
    IonSpinner,
    IonFooter,
    IonButton,
    IonIcon,
    IonAccordionGroup,
    IonAccordion
} from '@ionic/react';
import { useHistory } from 'react-router';
import { locationOutline } from 'ionicons/icons';
import { useVisitsStore } from '../../../store/visitsStore';
import { BugDataEntity } from '../../../models/BugDataEntity';
import './StepBugSelector.css';

const StepBugSelector: React.FC = () => {
    const { visitCreation, masterData, saveVisitCreation, getMasterData } = useVisitsStore();
    const [bugList, setBugList] = useState<BugDataEntity[]>([]);
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
        if (masterData.locations.length > 0 && masterData.bugs.length > 0) {
            const initialBugList = masterData.locations.map(location => ({
                location,
                visit_id: undefined,
                bugsCaptured: masterData.bugs.map(bug => ({
                    bug,
                    quantity:
                        visitCreation.bugsData
                            ?.find(bd => bd.location.id === location.id)
                            ?.bugsCaptured.find(bc => bc.bug.id === bug.id)
                            ?.quantity || 0,
                })),
            }));
            setBugList(initialBugList);
        }
    }, [masterData.locations.length, masterData.bugs.length, visitCreation.bugsData]);

    const groupedBySector = bugList.reduce<Record<string, BugDataEntity[]>>((acc, bd) => {
        const sectorName = bd.location.sector?.name ?? 'Sin sector';
        if (!acc[sectorName]) acc[sectorName] = [];
        acc[sectorName].push(bd);
        return acc;
    }, {});

    const handleSaveAndReturn = () => {
        saveVisitCreation({ bugsData: bugList });
        history.replace('/new-visit/dashboard');
    };

    const handleBugQuantityChange = (locationId: number, bugId: number, value: number) => {
        setBugList(prev => {
            const copy = [...prev];
            const locationIndex = copy.findIndex(item => item.location.id === locationId);
            if (locationIndex === -1) return copy;

            const bugIndex = copy[locationIndex].bugsCaptured.findIndex(bc => bc.bug.id === bugId);
            if (bugIndex === -1) return copy;


            copy[locationIndex].bugsCaptured[bugIndex].quantity = value;
            return copy;
        });
    };

    return (
        <IonPage>
            <IonHeader>
                <IonToolbar>
                    <IonTitle>Seleccionar Plagas</IonTitle>
                </IonToolbar>
            </IonHeader>

            <IonContent fullscreen>
                {isLoading ? (
                    <div className="loading-container">
                        <IonSpinner />
                    </div>
                ) : (
                    <IonAccordionGroup>
                        {Object.entries(groupedBySector).map(([sector, items], sectorIndex) => (
                            <IonAccordion 
                                key={`sector-${sectorIndex}`} 
                                value={`sector-${sectorIndex}`}
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
                                    <IonAccordionGroup>
                                        {items.map((bugData, locationIndex) => (
                                            <IonAccordion 
                                                key={`location-${sectorIndex}-${locationIndex}`}
                                                value={`location-${sectorIndex}-${locationIndex}`}
                                                className="location-accordion"
                                            >
                                                <IonItem slot="header" className="location-header">
                                                    <IonLabel>
                                                        <span className="location-number">
                                                            #{bugData.location.number}
                                                        </span>
                                                        <span className="location-name">
                                                            {bugData.location.name}
                                                        </span>
                                                    </IonLabel>
                                                </IonItem>

                                                <div className="accordion-content" slot="content">
                                                    {bugData.bugsCaptured.map((bc, bugIndex) => (
                                                        <IonItem 
                                                            key={`bug-${sectorIndex}-${bugData.location.id}-${bc.bug.id}`}
                                                            className="bug-input-item"
                                                        >
                                                            <IonLabel slot="start">{bc.bug.name}</IonLabel>
                                                            <IonInput
                                                                slot="end"
                                                                type="number"
                                                                min={0}
                                                                value={bc.quantity}
                                                                className="bug-input"
                                                                onIonInput={e => {
                                                                    const value = parseInt(e.detail.value || '0', 10);
                                                                    handleBugQuantityChange(
                                                                        bugData.location.id,
                                                                        bc.bug.id,
                                                                        value
                                                                    );
                                                                }}
                                                            />
                                                        </IonItem>
                                                    ))}
                                                </div>
                                            </IonAccordion>
                                        ))}
                                    </IonAccordionGroup>
                                </div>
                            </IonAccordion>
                        ))}
                    </IonAccordionGroup>
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

export default StepBugSelector;
