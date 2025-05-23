export type DocumentStatuseViewModel = {
  id: string;
  code: 'processing' | 'finalized' | 'accepted' | 'refused' | 'cancelled';
  label: 'Processing' | 'Finalized' | 'Accepted' | 'Refused' | 'Cancelled';
}