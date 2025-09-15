import React from 'react';
import { IonChip, IonLabel } from '@ionic/react';
import './StatusChip.css';

interface StatusChipProps {
  label: string;
  count: number;
  type: 'draft' | 'offline' | 'confirmed';
}

const StatusChip: React.FC<StatusChipProps> = ({ label, count, type }) => {
  return (
    <IonChip className={`status-chip ${type}`}>
      <IonLabel>
        <span className="label">{label}</span>
        <span className="count">({count})</span>
      </IonLabel>
    </IonChip>
  );
};

export default StatusChip; 