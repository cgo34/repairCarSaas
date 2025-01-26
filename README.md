src/
│-- application/               <-- Contient les implémentations des use cases et services
│   ├── useCases/
│   │   ├── auth/
│   │   │   ├── LoginUseCase.ts
│   │   │   ├── RegisterUseCase.ts
│   │   └── ...
│   ├── services/
│   └── dtos/                     <-- (Optionnel) Objets de transfert de données
│
│-- domain/                     <-- Contient les règles métier et les interfaces
│   ├── entities/
│   ├── repositories/
│   ├── services/
│   ├── providers/
│   ├── useCases/                 <-- Interfaces des Use Cases
│   └── events/                   <-- (Optionnel) Gestion des événements
│
│-- infrastructure/              <-- Contient les implémentations des repositories et providers
│   ├── db/
│   ├── providers/
│   ├── repositories/
│   ├── ioc/
│   └── config/
│
│-- modules/                     <-- UI (Vue.js)
│   ├── auth/
│   ├── quotes/
│   ├── invoices/
│   └── ...
