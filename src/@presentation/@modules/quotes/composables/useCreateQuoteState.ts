// region -> IMPORTS
import { IAuthState } from '@/@application/states/interfaces/IAuthState';
import { IGarageUseCase } from '@/@domain/useCases/IGarageUseCase';
import { IVehicleUseCase } from '@/@domain/useCases/IVehicleUseCase';
import { IUserUseCase } from '@/@domain/useCases/IUserUseCase';
import { ICreateQuoteUseCase } from '@/@domain/useCases/quotes/ICreateQuoteUseCase';
import { IInsertQuoteUseCase } from '@/@domain/useCases/quotes/IInsertQuoteUseCase';
import { container } from '@/@infrastructure/ioc/inversify.config';
import { SYMBOLS } from '@/@infrastructure/ioc/symbols';
import { GarageMapper } from '@/@presentation/mappers/GarageMapper';
import { QuoteMapper } from '@/@presentation/mappers/QuoteMapper';
import { VehicleMapper } from '@/@presentation/mappers/VehicleMapper';
import { CountryViewModel } from '@/@presentation/types/models/CountryViewModel';
import { GarageViewModel } from '@/@presentation/types/models/GarageViewModel';
import { QuoteViewModel } from '@/@presentation/types/models/QuoteViewModel';
import { UserViewModel } from '@/@presentation/types/models/UserViewModel';
import { VehicleViewModel } from '@/@presentation/types/models/VehicleViewModel';
import { computed, ref } from 'vue';
// endregion

export function useCreateQuoteState() {
  // #region -> DEPENDENCIES
  const authState = container.get<IAuthState>(SYMBOLS.States.AuthState);
  const createQuoteUseCase = container.get<ICreateQuoteUseCase>(SYMBOLS.UseCases.Quote.CreateQuoteUseCase);
  const insertQuoteUseCase = container.get<IInsertQuoteUseCase>(SYMBOLS.UseCases.Quote.InsertQuoteUseCase);
  const garageUseCase = container.get<IGarageUseCase>(SYMBOLS.UseCases.Garage);
  const vehicleUseCase = container.get<IVehicleUseCase>(SYMBOLS.UseCases.Vehicle);
  const technicianUseCase = container.get<IUserUseCase>(SYMBOLS.UseCases.UserUseCase);
  // #endregion

  // #region -> REFS
  const loading = ref(false);
  const error = ref(undefined);

  const _quote = ref<QuoteViewModel | undefined>(undefined);
  const _quoteInformations = ref({
    number: '',
    date: '',
    expirationDate: '',
    status_id: 'processing',
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
  const _forfaitAmount = ref<number | undefined>(undefined);
  const _isDisplayUnitPrice = ref<boolean>(true);
  const _isComputeCommissionWithoutDentRemoval = ref<boolean>(true);
  const _selectedCountry = ref<CountryViewModel>();
// #endregion

  // #region -> INIT
  const init = async () => {
    loading.value = true;
    try {
      console.log('auht state from useCreateQuote', authState);
      
      if (!authState.user.value)
        throw new Error('User not found');

      resetQuote();

      _quote.value = {
        quoteNumber: '',
        isForfait: false,
        forfaitAmount: undefined,
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
      
      const quoteDto = await createQuoteUseCase.execute(QuoteMapper.viewToDto(_quote.value), authState.user.value.id);
      _quote.value = QuoteMapper.dtoToView(quoteDto);
      
      // TODO: (gce) -> MOVE TO MAPPER
      _quoteInformations.value.number = _quote.value.quoteNumber;
      const startDate = new Date(_quote.value.startDate);
      _quoteInformations.value.date = startDate.toISOString().split('T')[0];

      // Ajout d’un mois
      // const expirationDate = new Date(startDate);
      // expirationDate.setMonth(expirationDate.getMonth() + 1);
      // _quoteInformations.value.expirationDate = expirationDate.toISOString().split('T')[0];
      _quoteInformations.value.status_id = _quote.value.status_id;

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
  const resetQuote = () => {
    _quote.value = undefined;
    _quoteInformations.value = {
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

    if (!_quoteInformations.value.date)
      return '';

    const date = new Date(_quoteInformations.value.date);
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
    if (!_quote.value)
      return

    const existingGarage = _garages.value.find(g => g.name === garage.name)

    if (!existingGarage) {
      _garages.value.push(garage)
    }

    _selectedGarage.value = garage

    _quote.value.garageName = _selectedGarage.value.name
    _quote.value.garageAddress = _selectedGarage.value.address
    _quote.value.garageZipCode = _selectedGarage.value.zipCode
    _quote.value.garageCity = _selectedGarage.value.city
    _quote.value.garagePhone = _selectedGarage.value.phone
    _quote.value.garageEmail = _selectedGarage.value.email
    _quote.value.garagePercentageCommission = _selectedGarage.value.percentageCommission
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
  
  const setForfaitAmount = (amount: number) => {
    _forfaitAmount.value = amount;
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

    if (!_quote.value)
      throw new Error('Quote not found');

    if (!_selectedGarage.value || !_selectedTechnician.value)
      throw new Error('Garage or Technician not selected');

    if (!_carInformations.value.immatriculation || !_carInformations.value.brand || !_carInformations.value.dateEntryCirculation)
      throw new Error('Car informations not set');

    loading.value = true;
    try {
      _quote.value = {
        ..._quote.value,
        status: 'pending',
        
        garage: _selectedGarage.value,
        technician: _selectedTechnician.value,

        carBrand: _carInformations.value.brand,
        carImmatriculation: _carInformations.value.immatriculation,
        carDateEntryCirculation: _carInformations.value.dateEntryCirculation,
        vehicleId: _selectedVehicle.value?.id,

        isForfait: _isForfait.value,
        forfaitAmount: _forfaitAmount.value,
        isDisplayUnitPrice: _isDisplayUnitPrice.value,
        isComputeCommissionWithoutDentRemoval: _isComputeCommissionWithoutDentRemoval.value,
        
        userId: authState.user.value.id,
      }

      // TODO: (GCE) -> CHECK HERE LEVEL SUBSCRIPTION - IF 1 set single garage info with from quote _selectedGarage - ELSE set garage with _selectedGarage
      _quote.value.garageName = _selectedGarage.value.name
      _quote.value.garageAddress = _selectedGarage.value.address
      _quote.value.garageZipCode = _selectedGarage.value.zipCode
      _quote.value.garageCity = _selectedGarage.value.city
      _quote.value.garagePhone = _selectedGarage.value.phone
      _quote.value.garageEmail = _selectedGarage.value.email
      _quote.value.garagePercentageCommission = _selectedGarage.value.percentageCommission
      
      const quoteDto = await insertQuoteUseCase.execute(QuoteMapper.viewToDto(_quote.value)).then(async (quote) => {
        _quote.value = QuoteMapper.dtoToView(quote);
        if (!quote.id)
          throw new Error('Quote not saved');

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

    quote: computed(() => _quote.value),
    quoteInformations: computed(() => _quoteInformations.value),
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
    forfaitAmount: computed(() => _forfaitAmount.value),
    isDisplayUnitPrice: computed(() => _isDisplayUnitPrice.value),
    isComputeCommissionWithoutDentRemoval: computed(() => _isComputeCommissionWithoutDentRemoval.value),
    setIsForfait,
    setForfaitAmount,
    setIsDisplayUnitPrice,
    setIsComputeCommissionWithoutDentRemoval,
    
    selectCountry,
    selectedCountry: computed(() => _selectedCountry.value),

    save,
  };
}
