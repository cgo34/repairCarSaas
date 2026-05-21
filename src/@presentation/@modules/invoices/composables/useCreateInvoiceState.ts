// region -> IMPORTS

import { IAuthState } from '@/@application/states/interfaces/IAuthState';

import { IGarageUseCase } from '@/@domain/useCases/IGarageUseCase';

import { ICreateInvoiceUseCase } from '@/@domain/useCases/invoices/ICreateInvoiceUseCase';

import { IInsertInvoiceUseCase } from '@/@domain/useCases/invoices/IInsertInvoiceUseCase';

import { IGetDocumentStatusUseCase } from '@/@domain/useCases/IGetDocumentStatusUseCase';

import { IOrganizationMemberUseCase } from '@/@domain/useCases/organizationMember/IOrganizationMemberUseCase';

import { container } from '@/@infrastructure/ioc/inversify.config';

import { SYMBOLS } from '@/@infrastructure/ioc/symbols';

import { GarageMapper } from '@/@presentation/mappers/GarageMapper';

import { InvoiceMapper } from '@/@presentation/mappers/InvoiceMapper';

import { OrganizationMemberMapper } from '@/@presentation/mappers/organizations/OrganizationMemberMapper';

import { DocumentStatuseMapper } from '@/@presentation/mappers/DocumentStatuseMapper';

import { CountryViewModel } from '@/@presentation/types/models/CountryViewModel';

import { GarageViewModel } from '@/@presentation/types/models/GarageViewModel';

import { InvoiceViewModel } from '@/@presentation/types/models/InvoiceViewModel';

import { VehicleViewModel } from '@/@presentation/types/models/VehicleViewModel';

import { OrganizationMemberViewModel } from '@/@presentation/types/models/organizations/OrganizationMemberViewmodel';

import { computed, ref } from 'vue';

// endregion

export function useCreateInvoiceState() {

  // #region -> DEPENDENCIES

  const authState =
    container.get<IAuthState>(
      SYMBOLS.States.AuthState
    );

  const createInvoiceUseCase =
    container.get<ICreateInvoiceUseCase>(
      SYMBOLS.UseCases.Invoice.CreateInvoiceUseCase
    );

  const insertInvoiceUseCase =
    container.get<IInsertInvoiceUseCase>(
      SYMBOLS.UseCases.Invoice.InsertInvoiceUseCase
    );

  const getDocumentStatusUseCase =
    container.get<IGetDocumentStatusUseCase>(
      SYMBOLS.UseCases.GetDocumentStatus
    );

  const garageUseCase =
    container.get<IGarageUseCase>(
      SYMBOLS.UseCases.Garage
    );

  const technicianUseCase =
    container.get<IOrganizationMemberUseCase>(
      SYMBOLS.UseCases.OrganizationMemberUseCase
    );

  // #endregion

  // #region -> REFS

  const loading = ref(false);

  const error = ref();

  const _invoice =
    ref<InvoiceViewModel>();

  const _technicians =
    ref<
      OrganizationMemberViewModel[]
    >([]);

  const _garages =
    ref<GarageViewModel[]>([]);

  const _selectedTechnician =
    ref<
      OrganizationMemberViewModel
    >();

  const _selectedGarage =
    ref<GarageViewModel>();

  const _vehicles =
    ref<VehicleViewModel[]>([]);

  const _selectedVehicle =
    ref<VehicleViewModel>();

  const _isForfait =
    ref<boolean>(false);

  const _forfaitAmount =
    ref<number>();

  const _isDisplayUnitPrice =
    ref<boolean>(true);

  const _isComputeCommissionWithoutDentRemoval =
    ref<boolean>(true);

  const _selectedCountry =
    ref<CountryViewModel>();

  // #endregion

  // #region -> INIT

  const init = async () => {

    loading.value = true;

    try {

      resetInvoice();

      const [
        invoiceNumber,
        statusDto,
        garageResult,
        technicianResult,
      ] = await Promise.all([

        createInvoiceUseCase.execute(
          authState.userContext.value.organization.id
        ),

        getDocumentStatusUseCase.getByCode(
          'processing'
        ),

        garageUseCase
          .getGaragesByOrganizationId(
            authState.userContext.value.organization.id
          )
          .catch(() => []),

        technicianUseCase
          .getMembersByOrganizationId(
            authState.userContext.value.organization.id
          )
          .catch(() => []),
      ]);

      console.log('technicianResult', technicianResult);
      
      const status =
        DocumentStatuseMapper.dtoToView(
          statusDto
        );

      const startDate =
        new Date();

      const endDate =
        new Date(startDate);

      endDate.setMonth(
        endDate.getMonth() + 1
      );

      _invoice.value = {

        /**
         * ============================================================
         * ORGANIZATION
         * ============================================================
         */

        organization_id:
          authState.userContext.value.organization.id,

        created_by_member_id:
          authState.userContext.value.membership.id,

        /**
         * ============================================================
         * DOCUMENT
         * ============================================================
         */

        invoiceNumber,
        quoteNumber: '',

        status_id:
          status.id,

        status,

        /**
         * ============================================================
         * DATES
         * ============================================================
         */

        startDate:
          startDate.toISOString(),

        endDate:
          endDate.toISOString(),

        /**
         * ============================================================
         * PRICING
         * ============================================================
         */

        isForfait: false,

        isDisplayUnitPrice: true,

        isComputeCommissionWithoutDentRemoval:
          true,

        /**
         * ============================================================
         * COUNTRY
         * ============================================================
         */

        country: 'FR',

        currency: 'EUR',

        /**
         * ============================================================
         * EMAIL
         * ============================================================
         */

        isSent: false,
      };

      _garages.value =
        garageResult.map(
          GarageMapper.dtoToView
        );

      _technicians.value =
        technicianResult.map(
          OrganizationMemberMapper.dtoToView
        );

      /**
       * ============================================================
       * DEFAULT TECHNICIAN
       * ============================================================
       */

      const currentTechnician =
        _technicians.value.find(
          (t) =>
            t.user_id ===
            authState.userContext.value.id
        );

      if (
        currentTechnician &&
        _invoice.value
      ) {

        _selectedTechnician.value =
          currentTechnician;

        _invoice.value.assignedMember =
          currentTechnician;

        _invoice.value.assigned_member_id =
          currentTechnician.id;
      }

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

    _technicians.value = [];

    _garages.value = [];

    _selectedTechnician.value =
      undefined;

    _selectedGarage.value =
      undefined;

    _selectedVehicle.value =
      undefined;
  };

  const invoiceInformations =
    computed(() => ({
      number:
        _invoice.value?.invoiceNumber ?? '',

      date:
        _invoice.value?.startDate
          ? new Date(
              _invoice.value.startDate
            )
              .toISOString()
              .split('T')[0]
          : '',

      expirationDate:
        expirationDate.value,

      status_id:
        _invoice.value?.status_id ?? '',
    }));

  const expirationDate =
    computed(() => {

      if (
        !_invoice.value?.startDate
      ) {
        return '';
      }

      const date = new Date(
        _invoice.value.startDate
      );

      date.setMonth(
        date.getMonth() + 1
      );

      return date
        .toISOString()
        .split('T')[0];
    });

  const carInformations =
    computed(() => ({
      immatriculation:
        _invoice.value
          ?.carImmatriculation ?? '',

      brand:
        _invoice.value
          ?.carBrand ?? '',

      year:
        _invoice.value
          ?.carYear ?? '',
    }));

  const selectTechnician = (
    technician:
      OrganizationMemberViewModel
  ) => {

    _selectedTechnician.value =
      technician;

    if (_invoice.value) {

      _invoice.value.assignedMember =
        technician;

      _invoice.value.assigned_member_id =
        technician.id;
    }
  };

  const selectGarage = async (
    garage: GarageViewModel
  ) => {

    _selectedGarage.value =
      garage;

    if (_invoice.value) {

      _invoice.value.garage =
        garage;

      _invoice.value.garageId =
        garage.id;

      _invoice.value.garageName =
        garage.name;

      _invoice.value.garageAddress =
        garage.address;

      _invoice.value.garageZipCode =
        garage.zip_code;

      _invoice.value.garageCity =
        garage.city;

      _invoice.value.garagePhone =
        garage.phone;

      _invoice.value.garageEmail =
        garage.email;

      _invoice.value.garagePercentageCommission =
        garage.percentage_commission;
    }
  };

  const selectVehicle = (
    vehicle:
      VehicleViewModel | undefined
  ) => {

    _selectedVehicle.value =
      vehicle;

    if (
      vehicle &&
      _invoice.value
    ) {

      _invoice.value.carImmatriculation =
        vehicle.immatriculation;

      _invoice.value.carBrand =
        vehicle.marque;

      _invoice.value.carYear =
        vehicle.annee?.toString() ?? '';
    }
  };

  const setGarage = (
    garage: GarageViewModel
  ) => {

    if (!_invoice.value) {
      return;
    }

    const existingGarage =
      _garages.value.find(
        (g) =>
          g.name === garage.name
      );

    if (!existingGarage) {
      _garages.value.push(garage);
    }

    _selectedGarage.value =
      garage;

    _invoice.value.garage =
      garage;

    _invoice.value.garageId =
      garage.id;

    _invoice.value.garageName =
      garage.name;

    _invoice.value.garageAddress =
      garage.address;

    _invoice.value.garageZipCode =
      garage.zipCode;

    _invoice.value.garageCity =
      garage.city;

    _invoice.value.garagePhone =
      garage.phone;

    _invoice.value.garageEmail =
      garage.email;

    _invoice.value.garagePercentageCommission =
      garage.percentageCommission;
  };

  const setCarImmatriculation = (
    immatriculation: string
  ) => {

    if (_invoice.value) {

      _invoice.value.carImmatriculation =
        immatriculation;
    }
  };

  const setCarBrand = (
    brand: string
  ) => {

    if (_invoice.value) {

      _invoice.value.carBrand =
        brand;
    }
  };

  const setCarDateEntryCirculation = (
    year: string
  ) => {

    if (_invoice.value) {

      _invoice.value.carYear =
        year;
    }
  };

  const selectCountry = (
    country: CountryViewModel
  ) => {

    _selectedCountry.value =
      country;

    if (_invoice.value) {

      _invoice.value.country =
        country;
    }
  };

  const setIsForfait = (
    isForfait: boolean
  ) => {

    _isForfait.value =
      isForfait;

    if (_invoice.value) {

      _invoice.value.isForfait =
        isForfait;
    }
  };

  const setForfaitAmount = (
    amount: number
  ) => {

    _forfaitAmount.value =
      amount;

    if (_invoice.value) {

      _invoice.value.forfaitAmount =
        amount;
    }
  };

  const setIsDisplayUnitPrice = (
    value: boolean
  ) => {

    _isDisplayUnitPrice.value =
      value;

    if (_invoice.value) {

      _invoice.value.isDisplayUnitPrice =
        value;
    }
  };

  const setIsComputeCommissionWithoutDentRemoval = (
    value: boolean
  ) => {

    _isComputeCommissionWithoutDentRemoval.value =
      value;

    if (_invoice.value) {

      _invoice.value.isComputeCommissionWithoutDentRemoval =
        value;
    }
  };

  const save = async () => {

    if (
      !authState.userContext.value
    ) {
      throw new Error(
        'User not found'
      );
    }

    if (!_invoice.value) {
      throw new Error(
        'Invoice not found'
      );
    }

    if (
      !_invoice.value.garageId ||
      !_invoice.value.assigned_member_id
    ) {
      throw new Error(
        'Garage or Technician not selected'
      );
    }

    loading.value = true;

    try {

      const savedInvoiceDto =
        await insertInvoiceUseCase.execute(
          InvoiceMapper.viewToDto(
            _invoice.value
          )
        );

      if (!savedInvoiceDto.id) {
        throw new Error(
          'Invoice not saved'
        );
      }

      _invoice.value =
        InvoiceMapper.dtoToView(
          savedInvoiceDto
        );

    } catch (e) {

      error.value = e;

    } finally {

      loading.value = false;
    }
  };

  // #endregion

  return {

    loading,
    error,
    init,

    invoice: computed(
      () => _invoice.value
    ),

    invoiceInformations,

    expirationDate,

    garages: computed(
      () => _garages.value
    ),

    technicians: computed(
      () => _technicians.value
    ),

    selectedTechnician: computed(
      () => _selectedTechnician.value
    ),

    selectedGarage: computed(
      () => _selectedGarage.value
    ),

    vehicles: computed(
      () => _vehicles.value
    ),

    selectedVehicle: computed(
      () => _selectedVehicle.value
    ),

    selectTechnician,
    selectGarage,
    selectVehicle,
    setGarage,

    carInformations,

    setCarImmatriculation,
    setCarBrand,
    setCarDateEntryCirculation,

    isForfait: computed(
      () => _isForfait.value
    ),

    forfaitAmount: computed(
      () => _forfaitAmount.value
    ),

    isDisplayUnitPrice: computed(
      () => _isDisplayUnitPrice.value
    ),

    isComputeCommissionWithoutDentRemoval:
      computed(
        () =>
          _isComputeCommissionWithoutDentRemoval.value
      ),

    setIsForfait,
    setForfaitAmount,
    setIsDisplayUnitPrice,
    setIsComputeCommissionWithoutDentRemoval,

    selectCountry,

    selectedCountry: computed(
      () => _selectedCountry.value
    ),

    save,
  };
}