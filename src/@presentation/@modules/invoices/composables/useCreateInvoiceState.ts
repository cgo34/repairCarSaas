// region -> IMPORTS
import { IAuthState } from '@/@application/states/interfaces/IAuthState';
import { IGarageUseCase } from '@/@domain/useCases/IGarageUseCase';
import { IUserUseCase } from '@/@domain/useCases/IUserUseCase';
import { ICreateInvoiceUseCase } from '@/@domain/useCases/invoices/ICreateInvoiceUseCase';
import { IInsertInvoiceUseCase } from '@/@domain/useCases/invoices/IInsertInvoiceUseCase';
import { container } from '@/@infrastructure/ioc/inversify.config';
import { SYMBOLS } from '@/@infrastructure/ioc/symbols';
import { GarageMapper } from '@/@presentation/mappers/GarageMapper';
import { InvoiceMapper } from '@/@presentation/mappers/InvoiceMapper';
import { CountryViewModel } from '@/@presentation/types/models/CountryViewModel';
import { GarageViewModel } from '@/@presentation/types/models/GarageViewModel';
import { InvoiceViewModel } from '@/@presentation/types/models/InvoiceViewModel';
import { UserViewModel } from '@/@presentation/types/models/UserViewModel';
import { computed, ref } from 'vue';
// endregion

export function useCreateInvoiceState() {
  // #region -> DEPENDENCIES
  const authState = container.get<IAuthState>(SYMBOLS.States.AuthState);
  const createInvoiceUseCase = container.get<ICreateInvoiceUseCase>(SYMBOLS.UseCases.Invoice.CreateInvoiceUseCase);
  const insertInvoiceUseCase = container.get<IInsertInvoiceUseCase>(SYMBOLS.UseCases.Invoice.InsertInvoiceUseCase);
  const garageUseCase = container.get<IGarageUseCase>(SYMBOLS.UseCases.Garage);
  const technicianUseCase = container.get<IUserUseCase>(SYMBOLS.UseCases.UserUseCase);
  // #endregion

  // #region -> REFS
  const loading = ref(false);
  const error = ref(undefined);

  const _invoice = ref<InvoiceViewModel | undefined>(undefined);
  const _invoiceInformations = ref({
    number: '',
    date: '',
    expirationDate: '',
    status: 'draft',
  });

  const _technicians = ref<UserViewModel[]>([]);
  const _garages = ref<GarageViewModel[]>([]);
  const _selectedTechnician = ref<UserViewModel>();
  const _selectedGarage = ref<GarageViewModel>();

  const _carInformations = ref({
    immatriculation: '',
    brand: '',
    dateEntryCirculation: '',
  });

  const _isForfait = ref<boolean>(false);
  const _isDisplayUnitPrice = ref<boolean>(true);
  const _isComputeCommissionWithoutDentRemoval = ref<boolean>(true);
  const _selectedCountry = ref<CountryViewModel>();
// #endregion

  // #region -> INIT
  const init = async () => {
    loading.value = true;
    try {
      if (!authState.user.value)
        throw new Error('User not found');

      resetInvoice();

      _invoice.value = {
        invoiceNumber: '',
        isForfait: false,
        status: 'draft',
        country: 'FR',
        currency: 'EUR',
        isSent: false,
        sentAt: undefined,
        userId: '',
    
        startDate: new Date().toISOString(),
        endDate: '',
    
        garage: _selectedGarage.value,
        technician: _selectedTechnician.value,
      }
      
      const invoiceDto = await createInvoiceUseCase.execute(InvoiceMapper.viewToDto(_invoice.value), authState.user.value.id);
      _invoice.value = InvoiceMapper.dtoToView(invoiceDto);
      
      // TODO: (gce) -> MOVE TO MAPPER
      _invoiceInformations.value.number = _invoice.value.invoiceNumber;
      const startDate = new Date(_invoice.value.startDate);
      _invoiceInformations.value.date = startDate.toISOString().split('T')[0];

      // Ajout d’un mois
      // const expirationDate = new Date(startDate);
      // expirationDate.setMonth(expirationDate.getMonth() + 1);
      // _invoiceInformations.value.expirationDate = expirationDate.toISOString().split('T')[0];
      _invoiceInformations.value.status = _invoice.value.status;

      const [garageData, technicianData] =
        await Promise.all([
          garageUseCase.getByUserId(authState.user.value?.id),
          technicianUseCase.getUsers(),
        ]);

      _garages.value = garageData.map((g) => GarageMapper.dtoToView(g));
      _technicians.value = [
        ...technicianData,
        // TODO: (gce) -> REMOVE MOCK
          {
            id: '1',
            fullName: 'John Doe',
            email: 'technicien1@gmail.com',
            password: '123456789',
            createdAt: '2021-09-01T00:00:00',
          },
          {
            id: '2',
            fullName: 'Albert Dupont',
            email: 'technicien2@gmail.com',
            password: '123456789',
            createdAt: '2021-09-01T00:00:00',
          },
      ];

      _selectedTechnician.value = _technicians.value.find((t) => t.id === authState.user.value?.id);
      
    } catch (e) {
      error.value = e;
    } finally {
      loading.value = false;
    }
  };
  // #endregion

  // #region -> METHODS
  const resetInvoice = () => {
    _invoice.value = undefined;
    _invoiceInformations.value = {
      number: '',
      date: '',
      expirationDate: '',
      status: 'draft',
    };
    _technicians.value = [];
    _garages.value = [];
    _selectedTechnician.value = undefined;
    _selectedGarage.value = undefined;
    _carInformations.value = {
      immatriculation: 'xx-789-nn',
      brand: 'Peugeot',
      dateEntryCirculation: '2020',
    };
  };

  const expirationDate = computed(() => {

    if (!_invoiceInformations.value.date)
      return '';

    const date = new Date(_invoiceInformations.value.date);
    date.setMonth(date.getMonth() + 1);
    return date.toISOString().split('T')[0];
  });
  

  const selectTechnician = (technician: UserViewModel) => {
    _selectedTechnician.value = technician;
  }

  const selectGarage = (garage: GarageViewModel) => {
    _selectedGarage.value = garage;
  }

  const setGarage = (garage: GarageViewModel) => {
    const existingGarage = _garages.value.find(g => g.name === garage.name)

    if (!existingGarage) {
      _garages.value.push(garage)
    }

    _selectedGarage.value = garage
  }

  const setCarImmatriculation = (immatriculation: string) => {
    _carInformations.value.immatriculation = immatriculation;
  }

  const setCarBrand = (brand: string) => {
    _carInformations.value.brand = brand;
  }

  const setCarDateEntryCirculation = (dateEntryCirculation: string) => {
    _carInformations.value.dateEntryCirculation = dateEntryCirculation;
  }

  const selectCountry = (country: CountryViewModel) => {
    _selectedCountry.value = country;
  }

  const setIsForfait = (isForfait: boolean) => {
    _isForfait.value = isForfait;

    // if (isForfait) {
    //   _isDisplayUnitPrice.value = false;
    //   _isComputeCommissionWithoutDentRemoval.value = false;
    // }
  }

  const setIsDisplayUnitPrice = (isDisplayUnitPrice: boolean) => {
    _isDisplayUnitPrice.value = isDisplayUnitPrice;
  }

  const setIsComputeCommissionWithoutDentRemoval = (isComputeCommissionWithoutDentRemoval: boolean) => {
    _isComputeCommissionWithoutDentRemoval.value = isComputeCommissionWithoutDentRemoval;
  }

  const save = async () => {
    if (!authState.user.value)
      throw new Error('User not found');

    if (!_invoice.value)
      throw new Error('Invoice not found');

    if (!_selectedGarage.value || !_selectedTechnician.value)
      throw new Error('Garage or Technician not selected');

    if (!_carInformations.value.immatriculation || !_carInformations.value.brand || !_carInformations.value.dateEntryCirculation)
      throw new Error('Car informations not set');

    loading.value = true;
    try {
      _invoice.value = {
        ..._invoice.value,
        status: 'pending',
        
        garage: _selectedGarage.value,
        technician: _selectedTechnician.value,

        carBrand: _carInformations.value.brand,
        carImmatriculation: _carInformations.value.immatriculation,
        carDateEntryCirculation: _carInformations.value.dateEntryCirculation,

        isForfait: _isForfait.value,
        isDisplayUnitPrice: _isDisplayUnitPrice.value,
        isComputeCommissionWithoutDentRemoval: _isComputeCommissionWithoutDentRemoval.value,
        
        userId: authState.user.value.id,
      }
      
      const invoiceDto = await insertInvoiceUseCase.execute(InvoiceMapper.viewToDto(_invoice.value)).then(async (invoice) => {
        _invoice.value = InvoiceMapper.dtoToView(invoice);
        if (!invoice.id)
          throw new Error('Invoice not saved');

      });
      
    } catch (e) {
      error.value = e;
    } finally {
      loading.value = false;
    }
  }
  // #endregion

  return {
    loading,
    error,
    init,

    invoice: computed(() => _invoice.value),
    invoiceInformations: computed(() => _invoiceInformations.value),
    expirationDate,

    garages: computed(() => _garages.value),
    technicians: computed(() => _technicians.value),
    selectedTechnician: computed(() => _selectedTechnician.value),
    selectedGarage: computed(() => _selectedGarage.value),
    selectTechnician,
    selectGarage,
    setGarage,

    carInformations: computed(() => _carInformations.value),
    setCarImmatriculation,
    setCarBrand,
    setCarDateEntryCirculation,
    
    isForfait: computed(() => _isForfait.value),
    isDisplayUnitPrice: computed(() => _isDisplayUnitPrice.value),
    isComputeCommissionWithoutDentRemoval: computed(() => _isComputeCommissionWithoutDentRemoval.value),
    setIsForfait,
    setIsDisplayUnitPrice,
    setIsComputeCommissionWithoutDentRemoval,
    
    selectCountry,
    selectedCountry: computed(() => _selectedCountry.value),

    save,
  };
}
