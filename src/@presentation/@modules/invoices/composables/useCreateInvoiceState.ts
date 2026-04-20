// region -> IMPORTS
import { IAuthState } from '@/@application/states/interfaces/IAuthState';
import { IGarageUseCase } from '@/@domain/useCases/IGarageUseCase';
import { IVehicleUseCase } from '@/@domain/useCases/IVehicleUseCase';
import { IUserUseCase } from '@/@domain/useCases/IUserUseCase';
import { ICreateInvoiceUseCase } from '@/@domain/useCases/invoices/ICreateInvoiceUseCase';
import { IInsertInvoiceUseCase } from '@/@domain/useCases/invoices/IInsertInvoiceUseCase';
import { container } from '@/@infrastructure/ioc/inversify.config';
import { SYMBOLS } from '@/@infrastructure/ioc/symbols';
import { GarageMapper } from '@/@presentation/mappers/GarageMapper';
import { InvoiceMapper } from '@/@presentation/mappers/InvoiceMapper';
import { VehicleMapper } from '@/@presentation/mappers/VehicleMapper';
import { CountryViewModel } from '@/@presentation/types/models/CountryViewModel';
import { GarageViewModel } from '@/@presentation/types/models/GarageViewModel';
import { InvoiceViewModel } from '@/@presentation/types/models/InvoiceViewModel';
import { UserViewModel } from '@/@presentation/types/models/UserViewModel';
import { VehicleViewModel } from '@/@presentation/types/models/VehicleViewModel';
import { computed, ref } from 'vue';
// endregion

export function useCreateInvoiceState() {
  // #region -> DEPENDENCIES
  const authState = container.get<IAuthState>(SYMBOLS.States.AuthState);
  const createInvoiceUseCase = container.get<ICreateInvoiceUseCase>(SYMBOLS.UseCases.Invoice.CreateInvoiceUseCase);
  const insertInvoiceUseCase = container.get<IInsertInvoiceUseCase>(SYMBOLS.UseCases.Invoice.InsertInvoiceUseCase);
  const garageUseCase = container.get<IGarageUseCase>(SYMBOLS.UseCases.Garage);
  const vehicleUseCase = container.get<IVehicleUseCase>(SYMBOLS.UseCases.Vehicle);
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
  const _vehicles = ref<VehicleViewModel[]>([]);
  const _selectedVehicle = ref<VehicleViewModel | undefined>(undefined);

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

      const [garageResult, technicianResult] =
        await Promise.allSettled([
          garageUseCase.getByUserId(authState.user.value?.id),
          technicianUseCase.getUsers(),
        ]);

      if (garageResult.status === 'fulfilled')
        _garages.value = garageResult.value.map((g) => GarageMapper.dtoToView(g));

      if (technicianResult.status === 'fulfilled')
        _technicians.value = [
          ...technicianResult.value,
          // TODO: (gce) -> REMOVE MOCK
          { id: '1', fullName: 'John Doe', email: 'technicien1@gmail.com', password: '123456789', createdAt: '2021-09-01T00:00:00' },
          { id: '2', fullName: 'Albert Dupont', email: 'technicien2@gmail.com', password: '123456789', createdAt: '2021-09-01T00:00:00' },
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

  const selectGarage = async (garage: GarageViewModel) => {
    _selectedGarage.value = garage;
    _selectedVehicle.value = undefined;
    if (garage?.id) {
      const result = await vehicleUseCase.getByGarageId(garage.id).catch(() => []);
      _vehicles.value = result.map(VehicleMapper.dtoToView);
    } else {
      _vehicles.value = [];
    }
  }

  const selectVehicle = (vehicle: VehicleViewModel | undefined) => {
    _selectedVehicle.value = vehicle;
    if (vehicle) {
      _carInformations.value = {
        immatriculation: vehicle.immatriculation,
        brand: vehicle.marque,
        dateEntryCirculation: vehicle.annee?.toString() ?? '',
      };
    }
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
        vehicleId: _selectedVehicle.value?.id,

        isForfait: _isForfait.value,
        isDisplayUnitPrice: _isDisplayUnitPrice.value,
        isComputeCommissionWithoutDentRemoval: _isComputeCommissionWithoutDentRemoval.value,
        
        userId: authState.user.value.id,
      }

      

      // TODO: (GCE) -> CHECK HERE LEVEL SUBSCRIPTION - IF 1 set single garage info with from quote _selectedGarage - ELSE set garage with _selectedGarage
      _invoice.value.garageName = _selectedGarage.value.name
      _invoice.value.garageAddress = _selectedGarage.value.address
      _invoice.value.garageZipCode = _selectedGarage.value.zipCode
      _invoice.value.garageCity = _selectedGarage.value.city
      _invoice.value.garagePhone = _selectedGarage.value.phone
      _invoice.value.garageEmail = _selectedGarage.value.email
      _invoice.value.garagePercentageCommission = _selectedGarage.value.percentageCommission
      
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
    vehicles: computed(() => _vehicles.value),
    selectedVehicle: computed(() => _selectedVehicle.value),
    selectTechnician,
    selectGarage,
    selectVehicle,
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
