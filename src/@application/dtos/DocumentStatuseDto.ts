export interface DocumentStatuseDto {
  id: string;
  code: 'processing' | 'finalized' | 'accepted' | 'refused' | 'cancelled' | 'invoiced';
  label: 'Processing' | 'Finalized' | 'Accepted' | 'Refused' | 'Cancelled' | 'Invoiced';
}