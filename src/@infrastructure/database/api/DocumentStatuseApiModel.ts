export type DocumentStatuseApiModel = {
  id: string;
  code: 'processing' | 'finalized' | 'accepted' | 'refused' | 'cancelled';
  label: 'Processing' | 'Finalized' | 'Accepted' | 'Refused' | 'Cancelled';
}