// region -> IMPORTS
import { IAuthState } from '@/features/auth/presentation/state/IAuthState';
import { IGarageUseCase } from '@/features/garages/application/useCases/GarageUseCase';
// import { IVehicleUseCase } from '@/features/vehicles/application/useCases/VehicleUseCase';
import { ICreateQuoteUseCase } from '@/features/quotes/application/useCases/CreateQuoteUseCase';
import { IInsertQuoteUseCase } from '@/features/quotes/application/useCases/InsertQuoteUseCase';
import { IGetDocumentStatusUseCase } from '@/features/documentStatuses/application/useCases/GetDocumentStatusUseCase';
import { GarageMapper } from '@/features/garages/presentation/mappers/GarageMapper';
import { QuoteMapper } from '@/features/quotes/presentation/mappers/QuoteMapper';
// import { VehicleMapper } from '@/features/vehicles/presentation/mappers/VehicleMapper';
import { CountryViewModel } from '@/features/countries/presentation/models/CountryViewModel';
import { GarageViewModel } from '@/features/garages/presentation/models/GarageViewModel';
import { QuoteViewModel } from '@/features/quotes/presentation/models/QuoteViewModel';
import { VehicleViewModel } from '@/features/vehicles/presentation/models/VehicleViewModel';
import { DocumentStatuseMapper } from '@/features/documentStatuses/presentation/mappers/DocumentStatuseMapper';
import { computed, ref } from 'vue';
import { IOrganizationMemberUseCase } from '@/features/organizations/application/useCases/OrganizationMemberUseCase';
import { OrganizationMemberMapper } from '@/features/organizations/presentation/mappers/OrganizationMemberMapper';
import { OrganizationMemberViewModel } from '@/features/organizations/presentation/models/OrganizationMemberViewmodel';
// endregion

export interface UseCreateQuoteStateDependencies {
  authState: IAuthState;
  createQuoteUseCase: ICreateQuoteUseCase;
  insertQuoteUseCase: IInsertQuoteUseCase;
  getDocumentStatusUseCase: IGetDocumentStatusUseCase;
  garageUseCase: IGarageUseCase;
  technicianUseCase: IOrganizationMemberUseCase;
}

export function createUseCreateQuoteState(deps: UseCreateQuoteStateDependencies) {
  // #region -> DEPENDENCIES
  const { authState, createQuoteUseCase, insertQuoteUseCase, getDocumentStatusUseCase, garageUseCase, technicianUseCase } = deps;
  // const vehicleUseCase = container.get<IVehicleUseCase>(SYMBOLS.UseCases.Vehicle);
  // #endregion

  // #region -> REFS
  const loading = ref(false);
  const error = ref();

  const _quote = ref<QuoteViewModel | undefined>(undefined);

  const _technicians = ref<OrganizationMemberViewModel[]>([]);
  const _garages = ref<GarageViewModel[]>([]);
  const _selectedTechnician = ref<OrganizationMemberViewModel>();
  const _selectedGarage = ref<GarageViewModel>();
  const _vehicles = ref<VehicleViewModel[]>([]);
  const _selectedVehicle = ref<VehicleViewModel | undefined>(undefined);

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
      // if (!authState.user.value)
      //   throw new Error('User not found');

      const userContext = authState.userContext.value;
      if (!userContext)
        throw new Error('User not found');

      resetQuote();

      // Orchestration des appels aux UseCases
      const [quoteNumber, statusDto, garageResult, technicianResult] = await Promise.all([
        createQuoteUseCase.execute(userContext.organization.id),
        getDocumentStatusUseCase.getByCode('draft'),
        garageUseCase.getGaragesByOrganizationId(userContext.organization.id).catch(() => []),
        technicianUseCase.getMembersByOrganizationId(userContext.organization.id).catch(() => []),
      ]);

      // Conversion DTO → ViewModel
      const status = DocumentStatuseMapper.dtoToView(statusDto);
      const startDate = new Date();
      const endDate = new Date(startDate);
      endDate.setMonth(endDate.getMonth() + 1);

      
      // Construction du ViewModel (brouillon - l'id sera généré par Supabase à l'INSERT)
      _quote.value = {
        organization_id: userContext.organization.id,
        created_by_member_id: userContext.membership.id,

        quoteNumber,
        status_id: status.id,
        status,

        startDate: startDate.toISOString(),
        endDate: endDate.toISOString(),

        // userId: authState.user.value.id,

        isForfait: false,
        isDisplayUnitPrice: true,
        isComputeCommissionWithoutDentRemoval: true,

        country: 'FR',
        currency: 'EUR',

        isSent: false,
      };

      _garages.value = garageResult.map(GarageMapper.dtoToView);
      _technicians.value = technicianResult.map(OrganizationMemberMapper.dtoToView);

      // Sélection du technicien courant par défaut
      const currentTechnician = _technicians.value.find((t) => t.user_id === userContext.id);
      if (currentTechnician && _quote.value) {
        _selectedTechnician.value = currentTechnician;
        _quote.value.assignedMember = currentTechnician;
        _quote.value.assigned_member_id = currentTechnician.id;
      }

      
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
    _technicians.value = [];
    _garages.value = [];
    _selectedTechnician.value = undefined;
    _selectedGarage.value = undefined;
    _selectedVehicle.value = undefined;
  };

  // Computed pour les infos du devis (lecture depuis _quote)
  const quoteInformations = computed(() => ({
    number: _quote.value?.quoteNumber ?? '',
    date: _quote.value?.startDate ? new Date(_quote.value.startDate).toISOString().split('T')[0] : '',
    expirationDate: expirationDate.value,
    status_id: _quote.value?.status_id ?? '',
  }));

  const expirationDate = computed(() => {
    if (!_quote.value?.startDate)
      return '';

    const date = new Date(_quote.value.startDate);
    date.setMonth(date.getMonth() + 1);
    return date.toISOString().split('T')[0];
  });

  // Computed pour les infos véhicule (lecture depuis _quote)
  const carInformations = computed(() => ({
    immatriculation: _quote.value?.carImmatriculation ?? '',
    brand: _quote.value?.carBrand ?? '',
    dateEntryCirculation: _quote.value?.carYear ?? '',
  }));
  

  const selectTechnician = (technician: OrganizationMemberViewModel) => {
    _selectedTechnician.value = technician;
    if (_quote.value) {
      
      _quote.value.assigned_member_id = technician.id;
      // _quote.value.technicianId = technician.id;
    }
  }

  const selectGarage = async (garage: GarageViewModel) => {
    _selectedGarage.value = garage;
    _selectedVehicle.value = undefined;

    if (_quote.value) {
      _quote.value.garage = garage;
      _quote.value.garageId = garage.id;
      _quote.value.garageName = garage.name;
      _quote.value.garageAddress = garage.address;
      _quote.value.garageZipCode = garage.zip_code;
      _quote.value.garageCity = garage.city;
      _quote.value.garagePhone = garage.phone;
      _quote.value.garageEmail = garage.email;
      _quote.value.garagePercentageCommission = garage.percentageCommission ?? undefined;
    }

    // if (garage?.id) {
    //   const result = await vehicleUseCase.getByGarageId(garage.id).catch(() => []);
    //   _vehicles.value = result.map(VehicleMapper.dtoToView);
    // } else {
    //   _vehicles.value = [];
    // }
  }

  const selectVehicle = (vehicle: VehicleViewModel | undefined) => {
    _selectedVehicle.value = vehicle;
    if (vehicle && _quote.value) {
      _quote.value.carImmatriculation = vehicle.immatriculation;
      _quote.value.carBrand = vehicle.marque;
      _quote.value.carYear = vehicle.annee?.toString() ?? '';
    }
  }

  const setGarage = (garage: GarageViewModel) => {
    if (!_quote.value)
      return;

    const existingGarage = _garages.value.find(g => g.name === garage.name);
    if (!existingGarage) {
      _garages.value.push(garage);
    }

    _selectedGarage.value = garage;
    _quote.value.garage = garage;
    _quote.value.garageId = garage.id;
    _quote.value.garageName = garage.name;
    _quote.value.garageAddress = garage.address;
    _quote.value.garageZipCode = garage.zip_code;
    _quote.value.garageCity = garage.city;
    _quote.value.garagePhone = garage.phone;
    _quote.value.garageEmail = garage.email;
    _quote.value.garagePercentageCommission = garage.percentageCommission ?? undefined;
  }

  const setCarImmatriculation = (immatriculation: string) => {
    if (_quote.value) {
      _quote.value.carImmatriculation = immatriculation;
    }
  }

  const setCarBrand = (brand: string) => {
    if (_quote.value) {
      _quote.value.carBrand = brand;
    }
  }

  const setCarDateEntryCirculation = (dateEntryCirculation: string) => {
    if (_quote.value) {
      console.log('Setting car year to', dateEntryCirculation);
      _quote.value.carYear = dateEntryCirculation;
      carInformations.value.dateEntryCirculation = dateEntryCirculation;
    }
  }

  const selectCountry = (country: CountryViewModel) => {
    _selectedCountry.value = country;
    if (_quote.value) {
      _quote.value.country = country;
    }
  }

  const setIsForfait = (isForfait: boolean) => {
    _isForfait.value = isForfait;
    if (_quote.value) {
      _quote.value.isForfait = isForfait;
    }
  }

  const setForfaitAmount = (amount: number) => {
    _forfaitAmount.value = amount;
    if (_quote.value) {
      _quote.value.forfaitAmount = amount;
    }
  }

  const setIsDisplayUnitPrice = (isDisplayUnitPrice: boolean) => {
    _isDisplayUnitPrice.value = isDisplayUnitPrice;
    if (_quote.value) {
      _quote.value.isDisplayUnitPrice = isDisplayUnitPrice;
    }
  }

  const setIsComputeCommissionWithoutDentRemoval = (isComputeCommissionWithoutDentRemoval: boolean) => {
    _isComputeCommissionWithoutDentRemoval.value = isComputeCommissionWithoutDentRemoval;
    if (_quote.value) {
      _quote.value.isComputeCommissionWithoutDentRemoval = isComputeCommissionWithoutDentRemoval;
    }
  }

  const save = async () => {
    error.value = undefined;
    if (!authState.userContext.value)
      throw new Error('User not found');

    if (!_quote.value)
      throw new Error('Quote not found');

    if ((!_quote.value.garageId && !_quote.value.garageName) || !_quote.value.assigned_member_id)
      throw new Error('Garage or Technician not selected');

    if (!_quote.value.carImmatriculation || !_quote.value.carBrand || !_quote.value.carYear)
      throw new Error('Car informations not set');

    loading.value = true;
    try {
      // Récupération du status "pending" et mise à jour de la quote
      // const pendingStatusDto = await getDocumentStatusUseCase.getByCode('pending');
      // _quote.value.status = DocumentStatuseMapper.dtoToView(pendingStatusDto);
      // _quote.value.status_id = pendingStatusDto.id;

      // Conversion ViewModel → DTO et appel UseCase
      const savedQuoteDto = await insertQuoteUseCase.execute(QuoteMapper.viewToDto(_quote.value));

      if (!savedQuoteDto.id)
        throw new Error('Quote not saved');

      // Mise à jour avec la quote retournée (contient l'id généré par Supabase)
      _quote.value = QuoteMapper.dtoToView(savedQuoteDto);

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
    quoteInformations,
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

    carInformations,
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
