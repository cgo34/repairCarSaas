// region -> IMPORTS
import { IAuthState } from '@/@application/states/interfaces/IAuthState';

import { IGarageUseCase } from '@/@domain/useCases/IGarageUseCase';
import { IGetDocumentStatuseUseCase } from '@/@domain/useCases/IGetDocumentStatusUseCase';

import { IBodyMaterialUseCase } from '@/@domain/useCases/carRepair/IBodyMaterialUseCase';
import { IBodyPartUseCase } from '@/@domain/useCases/carRepair/IBodyPartUseCase';
import { IDentRepairTypeUseCase } from '@/@domain/useCases/carRepair/IDentRepairTypeUseCase';

import { ICalculateLineCostUseCase } from '@/@domain/useCases/cost/ICalculateLineCostUseCase';
import { IDeleteLineItemUseCase } from '@/@domain/useCases/lineItem/ILineItemUseCase';

import { IAddInvoiceLineItemUseCase } from '@/@domain/useCases/invoices/IAddInvoiceLineItemUseCase';
import { IDeleteInvoiceUseCase } from '@/@domain/useCases/invoices/IDeleteInvoiceUseCase';
import { IGetInvoiceDetailUseCase } from '@/@domain/useCases/invoices/IGetInvoiceDetailUseCase';
import { IGetInvoiceUseCase } from '@/@domain/useCases/invoices/IGetInvoiceUseCase';
import { ISendInvoiceUseCase } from '@/@domain/useCases/invoices/ISendInvoiceUseCase';
import { IUpdateInvoiceUseCase } from '@/@domain/useCases/invoices/IUpdateInvoiceUseCase';

import { IOrganizationMemberUseCase } from '@/@domain/useCases/organizationMember/IOrganizationMemberUseCase';
import { ISettingPriceUseCase } from '@/@domain/useCases/settings/price/ISettingPriceUseCase';

import { container } from '@/@infrastructure/ioc/inversify.config';
import { SYMBOLS } from '@/@infrastructure/ioc/symbols';

import { GarageMapper } from '@/@presentation/mappers/GarageMapper';
import { LineItemMapper } from '@/@presentation/mappers/LineItemMapper';
import { InvoiceMapper } from '@/@presentation/mappers/InvoiceMapper';

import { BodyMaterialMapper } from '@/@presentation/mappers/settings/BodyMaterialMapper';
import { BodyPartMapper } from '@/@presentation/mappers/settings/BodyPartMapper';
import { RepairTypeMapper } from '@/@presentation/mappers/settings/RepairTypeMapper';
import { SettingPriceMapper } from '@/@presentation/mappers/settings/price/SettingPriceMapper';

import { OrganizationMemberMapper } from '@/@presentation/mappers/organizations/OrganizationMemberMapper';

import { CountryViewModel } from '@/@presentation/types/models/CountryViewModel';
import { DocumentStatusViewModel } from '@/@presentation/types/models/DocumentStatusViewModel';
import { GarageViewModel } from '@/@presentation/types/models/GarageViewModel';
import { VehicleViewModel } from '@/@presentation/types/models/VehicleViewModel';
import { LineItemViewModel } from '@/@presentation/types/models/LineItemViewModel';
import { InvoiceViewModel } from '@/@presentation/types/models/InvoiceViewModel';
import { InvoiceStatusViewType } from '@/@presentation/types/models/InvoiceStatusViewType';

import { BodyMaterialViewModel } from '@/@presentation/types/models/carRepair/BodyMaterialViewModel';
import { BodyPartViewModel } from '@/@presentation/types/models/carRepair/BodyPartViewModel';
import { DentRepairTypeViewModel } from '@/@presentation/types/models/carRepair/DentRepairTypeViewModel';

import { SettingPriceViewModel } from '@/@presentation/types/models/settings/price/SettingPriceViewModel';
import { OrganizationMemberViewModel } from '@/@presentation/types/models/organizations/OrganizationMemberViewmodel';

import { computed, ref } from 'vue';
// endregion

export function useEditInvoiceState() {
  // #region -> DEPENDENCIES
  const authState = container.get<IAuthState>(SYMBOLS.States.AuthState);

  const getInvoiceUseCase = container.get<IGetInvoiceUseCase>(SYMBOLS.UseCases.Invoice.GetInvoiceUseCase);
  const getInvoiceDetailUseCase = container.get<IGetInvoiceDetailUseCase>(SYMBOLS.UseCases.Invoice.GetInvoiceDetailsUseCase);
  const deleteInvoiceUseCase = container.get<IDeleteInvoiceUseCase>(SYMBOLS.UseCases.Invoice.DeleteInvoiceUseCase);
  const sendInvoiceUseCase = container.get<ISendInvoiceUseCase>(SYMBOLS.UseCases.Invoice.SendInvoiceUseCase);
  const updateInvoiceUseCase = container.get<IUpdateInvoiceUseCase>(SYMBOLS.UseCases.Invoice.UpdateInvoiceUseCase);

  const garageUseCase = container.get<IGarageUseCase>(SYMBOLS.UseCases.Garage);

  const technicianUseCase = container.get<IOrganizationMemberUseCase>(
    SYMBOLS.UseCases.OrganizationMemberUseCase,
  );

  const bodyPartUseCase = container.get<IBodyPartUseCase>(SYMBOLS.UseCases.CarRepair.BodyPartUseCase);
  const bodyMaterialUseCase = container.get<IBodyMaterialUseCase>(SYMBOLS.UseCases.CarRepair.BodyMaterialUseCase);
  const repairTypeUseCase = container.get<IDentRepairTypeUseCase>(SYMBOLS.UseCases.CarRepair.DentRepairTypeUseCase);

  const priceParamsUseCase = container.get<ISettingPriceUseCase>(SYMBOLS.UseCases.Setting.Price.AllUseCase);

  const getDocumentStatuseUseCase = container.get<IGetDocumentStatuseUseCase>(
    SYMBOLS.UseCases.GetDocumentStatus,
  );

  const calculateLineCostUseCase = container.get<ICalculateLineCostUseCase>(
    SYMBOLS.UseCases.CostCalculator.CalculateLineCostUseCase,
  );

  const addInvoiceDetailsUseCase = container.get<IAddInvoiceLineItemUseCase>(
    SYMBOLS.UseCases.Invoice.AddLineItemUseCase,
  );

  const deleteLineItemUseCase = container.get<IDeleteLineItemUseCase>(
    SYMBOLS.UseCases.Quote.DeleteLineItemUseCase,
  );
  // #endregion

  // #region -> REFS
  const _priceParams = ref<SettingPriceViewModel>();

  const _statuses = ref<DocumentStatusViewModel[]>([]);
  const _invoice = ref<InvoiceViewModel>();

  const _technicians = ref<OrganizationMemberViewModel[]>([]);
  const _garages = ref<GarageViewModel[]>([]);

  const _vehicles = ref<VehicleViewModel[]>([]);
  const _selectedVehicle = ref<VehicleViewModel>();

  const _selectedCountry = ref<CountryViewModel>();

  const _bodyParts = ref<BodyPartViewModel[]>([]);
  const _bodyMaterials = ref<BodyMaterialViewModel[]>([]);
  const _repairTypes = ref<DentRepairTypeViewModel[]>([]);

  const _invoiceLines = ref<LineItemViewModel[]>([]);

  const _invoiceId = ref<string>('');

  const loading = ref(false);
  const error = ref<unknown>(undefined);
  // #endregion

  // #region -> INIT
  const init = async (id: string) => {
    loading.value = true;

    try {
      if (!authState.userContext.value) {
        throw new Error('User not found');
      }

      _invoiceId.value = id;

      const organizationId = authState.userContext.value.organization.id;

      const [
        invoiceDto,
        invoiceDetailDto,
        statusesDto,
        garageResult,
        technicianResult,
        bodyPartResult,
        bodyMaterialResult,
        repairTypeResult,
        priceParamsResult,
      ] = await Promise.all([
        getInvoiceUseCase.execute(id),
        getInvoiceDetailUseCase.execute(id),
        getDocumentStatuseUseCase.execute(),
        garageUseCase.getGaragesByOrganizationId(organizationId).catch(() => []),
        technicianUseCase.getMembersByOrganizationId(organizationId).catch(() => []),
        bodyPartUseCase.executeGetAll().catch(() => []),
        bodyMaterialUseCase.executeGetAll().catch(() => []),
        repairTypeUseCase.executeGetAll().catch(() => []),
        priceParamsUseCase.getByorganizationId(organizationId).catch(() => undefined),
      ]);

      if (!invoiceDto) {
        throw new Error('Invoice not found');
      }

      _statuses.value = statusesDto.map((status) => ({
        id: status.id,
        code: status.code,
        label: status.label,
      }));

      _invoice.value = InvoiceMapper.dtoToView(invoiceDto);

      _invoiceLines.value =
        invoiceDetailDto?.map((line, index) => ({
          ...LineItemMapper.dtoToView(line),
          lineId: index + 1,
        })) ?? [];

      _garages.value = garageResult.map(GarageMapper.dtoToView);

      _technicians.value = technicianResult.map(OrganizationMemberMapper.dtoToView);

      _bodyParts.value = bodyPartResult.map(BodyPartMapper.dtoToView);
      _bodyMaterials.value = bodyMaterialResult.map(BodyMaterialMapper.dtoToView);
      _repairTypes.value = repairTypeResult.map(RepairTypeMapper.dtoToView);

      if (_invoice.value.garage) {
        addGarage(_invoice.value.garage);
      }

      if (_invoice.value.country && typeof _invoice.value.country !== 'string') {
        _selectedCountry.value = _invoice.value.country;
      }

      if (priceParamsResult) {
        _priceParams.value = SettingPriceMapper.dtoToView(priceParamsResult);

        _invoiceLines.value.forEach((line) => {
          if ((!line.price || line.price === 0) && line.bodyPart && line.bodyMaterial && line.repairType) {
            computePrice(line);
          }
        });
      }
    } catch (e) {
      error.value = e;
    } finally {
      loading.value = false;
    }
  };
  // #endregion

  // #region -> COMPUTED
  const invoiceInformations = computed(() => ({
    number: _invoice.value?.invoiceNumber ?? '',
    date: _invoice.value?.startDate ? new Date(_invoice.value.startDate).toISOString().split('T')[0] : '',
    expirationDate: _invoice.value?.endDate ? new Date(_invoice.value.endDate).toISOString().split('T')[0] : '',
    status: _invoice.value?.status ?? 'pending',
  }));

  const expirationDate = computed(() => {
    if (!_invoice.value?.startDate) {
      return '';
    }

    const date = new Date(_invoice.value.startDate);
    date.setMonth(date.getMonth() + 1);

    return date.toISOString().split('T')[0];
  });

  const selectedTechnician = computed(() => _invoice.value?.assignedMember);

  const selectedGarage = computed(() => _invoice.value?.garage);

  const carInformations = computed(() => ({
    immatriculation: _invoice.value?.carImmatriculation ?? '',
    brand: _invoice.value?.carBrand ?? '',
    dateEntryCirculation: _invoice.value?.carYear ?? '',
    carYear: _invoice.value?.carYear ?? '',
  }));

  const selectedCountry = computed(() => _invoice.value?.country ?? _selectedCountry.value);

  const isForfait = computed(() => _invoice.value?.isForfait ?? false);

  const forfaitAmount = computed(() => _invoice.value?.forfaitAmount);

  const isDisplayUnitPrice = computed(() => _invoice.value?.isDisplayUnitPrice ?? true);

  const isComputeCommissionWithoutDentRemoval = computed(
    () => _invoice.value?.isComputeCommissionWithoutDentRemoval ?? true,
  );

  const availableBodyParts = computed(() => {
    const selectedIds = new Set(
      _invoiceLines.value.map((line) => line.bodyPart?.id),
    );

    return _bodyParts.value.filter((bodyPart) => !selectedIds.has(bodyPart.id));
  });

  const subtotal = computed(() => {
    if (!isForfait.value) {
      return _invoiceLines.value.reduce((sum, item) => sum + (item.price ?? 0), 0);
    }

    return forfaitAmount.value ?? 0;
  });

  const totalDegarnissage = computed(() =>
    _invoiceLines.value.reduce((sum, item) => sum + (item.dentRemovalPrice ?? 0), 0),
  );

  const subTotalWithDegarnissage = computed(() => subtotal.value + totalDegarnissage.value);

  const taxRate = computed(() => {
    const country = selectedCountry.value;

    if (!country || typeof country === 'string') {
      return 0;
    }

    return country.taxRate ?? 0;
  });

  const totalTaxRate = computed(() => {
    if (!isForfait.value) {
      return subTotalWithDegarnissage.value * (taxRate.value / 100);
    }

    return (forfaitAmount.value ?? 0) * (taxRate.value / 100);
  });

  const totalCommission = computed(() => {
    const rate = (selectedGarage.value?.percentageCommission ?? 0) / 100;

    if (!rate) {
      return 0;
    }

    if (isForfait.value) {
      return (forfaitAmount.value ?? 0) * rate;
    }

    const base = isComputeCommissionWithoutDentRemoval.value
      ? subtotal.value
      : subTotalWithDegarnissage.value;

    return base * rate;
  });

  const total = computed(() => {
    if (!isForfait.value) {
      return subTotalWithDegarnissage.value + totalTaxRate.value;
    }

    return (forfaitAmount.value ?? 0) + totalTaxRate.value;
  });

  const invoiceStatus = computed(() => invoiceInformations.value.status as InvoiceStatusViewType);
  // #endregion

  // #region -> METHODS
  const selectTechnician = (technician: OrganizationMemberViewModel) => {
    if (!_invoice.value) {
      return;
    }

    _invoice.value.assignedMember = technician;
    _invoice.value.assigned_member_id = technician.id;
  };

  const selectGarage = async (garage: GarageViewModel) => {
    if (!_invoice.value) {
      return;
    }

    _invoice.value.garage = garage;
    _invoice.value.garageId = garage.id;

    _invoice.value.garageName = garage.name;
    _invoice.value.garageAddress = garage.address;
    _invoice.value.garageZipCode = garage.zipCode ?? garage.zip_code;
    _invoice.value.garageCity = garage.city;
    _invoice.value.garagePhone = garage.phone;
    _invoice.value.garageEmail = garage.email;
    _invoice.value.garagePercentageCommission =
      garage.percentageCommission ?? garage.percentage_commission;
  };

  const selectVehicle = (vehicle: VehicleViewModel | undefined) => {
    _selectedVehicle.value = vehicle;

    if (!_invoice.value || !vehicle) {
      return;
    }

    _invoice.value.carImmatriculation = vehicle.immatriculation;
    _invoice.value.carBrand = vehicle.marque;
    _invoice.value.carYear = vehicle.annee?.toString() ?? '';
  };

  const setGarage = (garage: GarageViewModel) => {
    const existingGarage = _garages.value.find((g) => g.name === garage.name);

    if (!existingGarage) {
      _garages.value.push(garage);
    }

    if (!_invoice.value) {
      return;
    }

    _invoice.value.garage = garage;
    _invoice.value.garageId = garage.id;

    _invoice.value.garageName = garage.name;
    _invoice.value.garageAddress = garage.address;
    _invoice.value.garageZipCode = garage.zipCode ?? garage.zip_code;
    _invoice.value.garageCity = garage.city;
    _invoice.value.garagePhone = garage.phone;
    _invoice.value.garageEmail = garage.email;
    _invoice.value.garagePercentageCommission =
      garage.percentageCommission ?? garage.percentage_commission;
  };

  const addGarage = (garage: GarageViewModel) => {
    setGarage(garage);
  };

  const setCarImmatriculation = (immatriculation: string) => {
    if (_invoice.value) {
      _invoice.value.carImmatriculation = immatriculation;
    }
  };

  const setCarBrand = (brand: string) => {
    if (_invoice.value) {
      _invoice.value.carBrand = brand;
    }
  };

  const setCarDateEntryCirculation = (year: string) => {
    if (_invoice.value) {
      _invoice.value.carYear = year;
    }
  };

  const selectCountry = (country: CountryViewModel) => {
    _selectedCountry.value = country;

    if (_invoice.value) {
      _invoice.value.country = country;
    }
  };

  const setIsForfait = (value: boolean) => {
    if (_invoice.value) {
      _invoice.value.isForfait = value;
    }
  };

  const setForfaitAmount = (amount: number) => {
    if (_invoice.value) {
      _invoice.value.forfaitAmount = amount;
    }
  };

  const setIsDisplayUnitPrice = (value: boolean) => {
    if (_invoice.value) {
      _invoice.value.isDisplayUnitPrice = value;
    }
  };

  const setIsComputeCommissionWithoutDentRemoval = (value: boolean) => {
    if (_invoice.value) {
      _invoice.value.isComputeCommissionWithoutDentRemoval = value;
    }
  };

  const computePrice = (line: LineItemViewModel) => {
    if (!_priceParams.value) {
      line.price = 0;
      return;
    }

    try {
      const lineItemDto = LineItemMapper.viewToDto(line);
      const priceDto = SettingPriceMapper.viewToDto(_priceParams.value);

      line.price = calculateLineCostUseCase.execute(lineItemDto, priceDto);
    } catch (e) {
      console.error('[Invoice] computePrice error:', e);
      line.price = 0;
    }
  };

  const addLine = async (line: LineItemViewModel) => {
    line.invoiceId = _invoice.value?.id;

    if (_priceParams.value) {
      computePrice(line);
    } else {
      line.price = 0;
    }

    const invoiceLineDto = await addInvoiceDetailsUseCase.executeInvoice(
      LineItemMapper.viewToDto(line),
    );

    _invoiceLines.value.push({
      ...LineItemMapper.dtoToView(invoiceLineDto),
    });
  };

  const removeLine = (lineId: string | undefined) => {
    if (!lineId) {
      return;
    }

    deleteLineItemUseCase.execute(lineId);

    const index = _invoiceLines.value.findIndex((line) => line.id === lineId);

    if (index >= 0) {
      _invoiceLines.value.splice(index, 1);
    }
  };

  const selectBodyPart = (lineId: number, bodyPart: BodyPartViewModel) => {
    const line = _invoiceLines.value.find((item) => item.lineId === lineId);

    if (!line) {
      return;
    }

    line.bodyPart = bodyPart;
    computePrice(line);
  };

  const selectBodyMaterial = (lineId: number, bodyMaterial: BodyMaterialViewModel) => {
    const line = _invoiceLines.value.find((item) => item.lineId === lineId);

    if (!line) {
      return;
    }

    line.bodyMaterial = bodyMaterial;
    computePrice(line);
  };

  const selectRepairType = (lineId: number, repairType: DentRepairTypeViewModel) => {
    const line = _invoiceLines.value.find((item) => item.lineId === lineId);

    if (!line) {
      return;
    }

    line.repairType = repairType;
    computePrice(line);
  };

  const setDentRemovalPrice = (lineId: number, dentRemovalPrice: number) => {
    const line = _invoiceLines.value.find((item) => item.lineId === lineId);

    if (!line) {
      return;
    }

    line.dentRemovalPrice = dentRemovalPrice;
  };

  const updateInvoice = async () => {
    if (!authState.userContext.value) {
      throw new Error('User not found');
    }

    if (!_invoice.value) {
      throw new Error('Invoice not found');
    }

    if (!selectedGarage.value || !selectedTechnician.value) {
      throw new Error('Garage or Technician not selected');
    }

    if (
      !carInformations.value.immatriculation ||
      !carInformations.value.brand ||
      !carInformations.value.dateEntryCirculation
    ) {
      throw new Error('Car informations not set');
    }

    loading.value = true;

    try {
      _invoice.value.totalHt = subTotalWithDegarnissage.value;
      _invoice.value.totalTtc = total.value;
      _invoice.value.totalCommission = totalCommission.value;

      _invoice.value.garage = selectedGarage.value;
      _invoice.value.garageId = selectedGarage.value.id;

      _invoice.value.assignedMember = selectedTechnician.value;
      _invoice.value.assigned_member_id = selectedTechnician.value.id;

      _invoice.value.carBrand = carInformations.value.brand;
      _invoice.value.carImmatriculation = carInformations.value.immatriculation;
      _invoice.value.carYear = carInformations.value.dateEntryCirculation;

      _invoice.value.isForfait = isForfait.value;
      _invoice.value.forfaitAmount = forfaitAmount.value;
      _invoice.value.isDisplayUnitPrice = isDisplayUnitPrice.value;
      _invoice.value.isComputeCommissionWithoutDentRemoval =
        isComputeCommissionWithoutDentRemoval.value;

      await updateInvoiceUseCase.execute(
        InvoiceMapper.viewToDto(_invoice.value),
      );
    } catch (e) {
      error.value = e;
    } finally {
      loading.value = false;
    }
  };

  const _viewStatusToDbCode = (status: InvoiceStatusViewType): string =>
    ({
      pending: 'processing',
      validated: 'finalized',
      accepted: 'accepted',
      signed: 'finalized',
      sent: 'finalized',
      draft: 'processing',
      cancel: 'cancelled',
    } as Record<string, string>)[status] ?? 'processing';

  const updateInvoiceStatus = async (status: InvoiceStatusViewType) => {
    if (!_invoice.value) {
      throw new Error('Invoice not found');
    }

    const dbCode = _viewStatusToDbCode(status);
    const found = _statuses.value.find((item) => item.code === dbCode);

    if (!found) {
      throw new Error(`Status not found: ${dbCode}`);
    }

    _invoice.value.status = status;
    _invoice.value.status_id = found.id;

    await updateInvoiceUseCase.execute(
      InvoiceMapper.viewToDto(_invoice.value),
    );
  };

  const deleteInvoice = () => {
    if (!_invoiceId.value) {
      return;
    }

    deleteInvoiceUseCase.execute(_invoiceId.value);
  };

  const sendInvoice = async () => {
    if (!_invoiceId.value) {
      throw new Error('Invoice ID not found');
    }

    await sendInvoiceUseCase.execute(_invoiceId.value);
  };
  // #endregion

  return {
    loading,
    error,
    init,

    invoice: computed(() => _invoice.value),
    invoiceInformations,
    expirationDate,

    garages: computed(() => _garages.value),
    technicians: computed(() => _technicians.value),
    selectedTechnician,
    selectedGarage,

    vehicles: computed(() => _vehicles.value),
    selectedVehicle: computed(() => _selectedVehicle.value),
    selectVehicle,

    selectTechnician,
    selectGarage,
    setGarage,

    carInformations,
    setCarImmatriculation,
    setCarBrand,
    setCarDateEntryCirculation,

    bodyParts: computed(() => _bodyParts.value),
    bodyMaterials: computed(() => _bodyMaterials.value),
    repairTypes: computed(() => _repairTypes.value),
    availableBodyParts,
    selectBodyPart,
    selectBodyMaterial,
    selectRepairType,
    setDentRemovalPrice,

    isForfait,
    isDisplayUnitPrice,
    isComputeCommissionWithoutDentRemoval,
    setIsForfait,
    setForfaitAmount,
    setIsDisplayUnitPrice,
    setIsComputeCommissionWithoutDentRemoval,
    forfaitAmount,

    selectCountry,
    selectedCountry,

    invoiceLines: computed(() => _invoiceLines.value),
    addLine,
    removeLine,

    subtotal,
    totalDegarnissage,
    subTotalWithDegarnissage,
    totalTaxRate,
    totalCommission,
    total,

    invoiceStatus,
    updateInvoice,
    updateInvoiceStatus,
    deleteInvoice,
    sendInvoice,
  };
}