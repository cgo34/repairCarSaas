export interface Quote {
    id: string;
    title: string;
    description: string;
    price: number;
    status: 'pending' | 'approved' | 'rejected';
    createdAt: string;
  }
  