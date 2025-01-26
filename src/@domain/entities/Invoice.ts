export interface Invoice {
    id: string;
    customerName: string;
    amount: number;
    status: 'pending' | 'paid' | 'canceled';
    createdAt: string;
  }
  