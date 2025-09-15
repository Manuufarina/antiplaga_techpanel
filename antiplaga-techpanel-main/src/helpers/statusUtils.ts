export const statusMapping: { [key: string]: string } = {
  pending: 'Pendiente',
  'in-process': 'En Proceso',
  resolved: 'Resuelto',
  rejected: 'Rechazado'
};

export const getStatusDisplay = (status: string) => {
  return statusMapping[status as keyof typeof statusMapping] || status;
};

export const getAvailableStatuses = (currentStatus: string) => {
  switch (currentStatus) {
    case 'pending':
      return [
        { value: 'in-process', label: 'En Proceso' },
        { value: 'resolved', label: 'Resuelto' },
        { value: 'rejected', label: 'Rechazado' }
      ];
    case 'in-process':
      return [
        { value: 'resolved', label: 'Resuelto' },
        { value: 'rejected', label: 'Rechazado' }
      ];
    default:
      return [];
  }
};

export const canEditIncident = (status: string) => {
  return status === 'pending' || status === 'in-process';
}; 