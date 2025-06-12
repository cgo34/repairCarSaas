export type DocumentStatuseViewModel = {
  id: string;
  code: 'processing' | 'finalized' | 'accepted' | 'refused' | 'cancelled' | 'invoiced';
  label: 'Processing' | 'Finalized' | 'Accepted' | 'Refused' | 'Cancelled' | 'Invoiced';
}