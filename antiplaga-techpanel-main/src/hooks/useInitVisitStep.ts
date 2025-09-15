import { useEffect, useState } from 'react';
import { useVisitsStore } from '../store/visitsStore';

export const useInitVisitStep = () => {
    const {
        visitCreation,
        masterData,
        getMasterData
    } = useVisitsStore();

    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const load = async () => {
            if (!visitCreation.selectedSpreadsheet) return;

            
            await getMasterData(visitCreation.selectedSpreadsheet);
            
            setLoading(false);
        };

        load();
    }, [visitCreation.selectedSpreadsheet, visitCreation.type]); 

    return { loading, masterData };
};
