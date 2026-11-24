// region -> IMPORTS
import { IAuthState } from '@/features/auth/presentation/state/IAuthState';

import { IGarageUseCase } from '@/features/garages/application/useCases/GarageUseCase';
import { IGetDocumentStatusUseCase } from '@/features/documentStatuses/application/useCases/GetDocumentStatusUseCase';

import { IBodyMaterialUseCase } from '@/features/carRepairSettings/application/useCases/BodyMaterialUseCase';
import { IBodyPartUseCase } from '@/features/carRepairSettings/application/useCases/BodyPartUseCase';
import { IDentRepairTypeUseCase } from '@/features/carRepairSettings/application/useCases/DentRepairTypeUSeCase';

import { ICalculateLineCostUseCase } from '@/features/costCalculation/application/useCases/CalculateLineCostUseCase';
import { IDeleteLineItemUseCase } from '@/features/lineItems/application/useCases/DeleteLineItemUseCase';
import { IUpdateInvoiceLineItemUseCase } from '@/features/invoices/application/useCases/UpdateInvoiceLineItemUseCase';

import { IAddInvoiceLineItemUseCase } from '@/features/invoices/application/useCases/AddInvoiceLineItemUseCase';
import { IDeleteInvoiceUseCase } from '@/features/invoices/application/useCases/DeleteInvoiceUseCase';
import { IGetInvoiceDetailUseCase } from '@/features/invoices/application/useCases/GetInvoiceDetailUseCase';
import { IGetInvoiceUseCase } from '@/features/invoices/application/useCases/GetInvoiceUseCase';
import { ISendInvoiceUseCase } from '@/features/invoices/application/useCases/SendInvoiceUseCase';
import { IUpdateInvoiceUseCase } from '@/features/invoices/application/useCases/UpdateInvoiceUseCase';

import { IOrganizationMemberUseCase } from '@/features/organizations/application/useCases/OrganizationMemberUseCase';
import { ISettingPriceUseCase } from '@/features/priceSettings/application/useCases/SettingPriceUseCase';


import { GarageMapper } from '@/features/garages/presentation/mappers/GarageMapper';
import { LineItemMapper } from '@/features/lineItems/presentation/mappers/LineItemMapper';
import { InvoiceMapper } from '@/features/invoices/presentation/mappers/InvoiceMapper';

import { BodyMaterialMapper } from '@/features/carRepairSettings/presentation/mappers/BodyMaterialMapper';
import { BodyPartMapper } from '@/features/carRepairSettings/presentation/mappers/BodyPartMapper';
import { RepairTypeMapper } from '@/features/carRepairSettings/presentation/mappers/RepairTypeMapper';
import { SettingPriceMapper } from '@/features/priceSettings/presentation/mappers/SettingPriceMapper';

import { OrganizationMemberMapper } from '@/features/organizations/presentation/mappers/OrganizationMemberMapper';

import { CountryViewModel } from '@/features/countries/presentation/models/CountryViewModel';
import { DocumentStatusViewModel } from '@/features/documentStatuses/presentation/models/DocumentStatusViewModel';
import { GarageViewModel } from '@/features/garages/presentation/models/GarageViewModel';
import { VehicleViewModel } from '@/features/vehicles/presentation/models/VehicleViewModel';
import { LineItemViewModel } from '@/features/lineItems/presentation/models/LineItemViewModel';
import { InvoiceViewModel } from '@/features/invoices/presentation/models/InvoiceViewModel';
import { InvoiceStatusViewType } from '@/features/invoices/presentation/models/InvoiceStatusViewType';

import { BodyMaterialViewModel } from '@/features/carRepairSettings/presentation/models/BodyMaterialViewModel';
import { BodyPartViewModel } from '@/features/carRepairSettings/presentation/models/BodyPartViewModel';
import { DentRepairTypeViewModel } from '@/features/carRepairSettings/presentation/models/DentRepairTypeViewModel';

import { SettingPriceViewModel } from '@/features/priceSettings/presentation/models/SettingPriceViewModel';
import { OrganizationMemberViewModel } from '@/features/organizations/presentation/models/OrganizationMemberViewmodel';

import { computed, ref } from 'vue';
// endregion

export interface UseEditInvoiceStateDependencies {
  authState: IAuthState;
  getInvoiceUseCase: IGetInvoiceUseCase;
  getInvoiceDetailUseCase: IGetInvoiceDetailUseCase;
  deleteInvoiceUseCase: IDeleteInvoiceUseCase;
  sendInvoiceUseCase: ISendInvoiceUseCase;
  updateInvoiceUseCase: IUpdateInvoiceUseCase;
  garageUseCase: IGarageUseCase;
  technicianUseCase: IOrganizationMemberUseCase;
  bodyPartUseCase: IBodyPartUseCase;
  bodyMaterialUseCase: IBodyMaterialUseCase;
  repairTypeUseCase: IDentRepairTypeUseCase;
  priceParamsUseCase: ISettingPriceUseCase;
  getDocumentStatuseUseCase: IGetDocumentStatusUseCase;
  calculateLineCostUseCase: ICalculateLineCostUseCase;
  addInvoiceDetailsUseCase: IAddInvoiceLineItemUseCase;
  deleteLineItemUseCase: IDeleteLineItemUseCase;
  updateLineItemUseCase: IUpdateInvoiceLineItemUseCase;
}

export function createUseEditInvoiceState(deps: UseEditInvoiceStateDependencies) {
  // #region -> DEPENDENCIES
  const { authState, getInvoiceUseCase, getInvoiceDetailUseCase, deleteInvoiceUseCase, sendInvoiceUseCase, updateInvoiceUseCase, garageUseCase, technicianUseCase, bodyPartUseCase, bodyMaterialUseCase, repairTypeUseCase, priceParamsUseCase, getDocumentStatuseUseCase, calculateLineCostUseCase, addInvoiceDetailsUseCase, deleteLineItemUseCase, updateLineItemUseCase } = deps;









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
        priceParamsUseCase.getByOrganizationId(organizationId).catch(() => undefined),
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
          if (line.bodyPart && line.bodyMaterial && line.repairType) {
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
    quoteNumber: _invoice.value?.quoteNumber ?? '',
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

  const selectedCountry = computed(() => {
    const country = _invoice.value?.country;
    return typeof country === 'object' ? country : _selectedCountry.value;
  });

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

  // Seul un brouillon est modifiable ; dès l'envoi la facture est verrouillée
  const isReadOnly = computed(() => !!_invoice.value && _invoice.value.status !== 'draft');
  const canDelete = computed(() => !!_invoice.value && _invoice.value.status === 'draft');
  const isSent = computed(() => !!_invoice.value?.isSent);
  const sentAt = computed(() => _invoice.value?.sentAt);
  // Au moins un élément (ou un montant forfaitaire) est requis pour envoyer
  const hasItems = computed(() =>
    isForfait.value ? (forfaitAmount.value ?? 0) > 0 : _invoiceLines.value.length > 0,
  );
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
    _invoice.value.garageZipCode = garage.zip_code;
    _invoice.value.garageCity = garage.city;
    _invoice.value.garagePhone = garage.phone;
    _invoice.value.garageEmail = garage.email;
    _invoice.value.garagePercentageCommission =
      garage.percentageCommission ?? garage.percentageCommission;
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
    _invoice.value.garageZipCode = garage.zip_code;
    _invoice.value.garageCity = garage.city;
    _invoice.value.garagePhone = garage.phone;
    _invoice.value.garageEmail = garage.email;
    _invoice.value.garagePercentageCommission =
      garage.percentageCommission ?? garage.percentageCommission;
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
    await persistTotals();
  };

  const updateLine = async (line: LineItemViewModel) => {
    if (!line.id) {
      return;
    }

    line.invoiceId = _invoice.value?.id;
    computePrice(line);

    const updatedDto = await updateLineItemUseCase.execute(LineItemMapper.viewToDto(line));
    const index = _invoiceLines.value.findIndex((l) => l.id === line.id);

    if (index >= 0) {
      _invoiceLines.value[index] = {
        ...LineItemMapper.dtoToView(updatedDto),
        lineId: _invoiceLines.value[index].lineId,
      };
    }
    await persistTotals();
  };

  const removeLine = async (lineId: string | undefined) => {
    if (!lineId) {
      return;
    }

    await deleteLineItemUseCase.execute(lineId);

    const index = _invoiceLines.value.findIndex((line) => line.id === lineId);

    if (index >= 0) {
      _invoiceLines.value.splice(index, 1);
    }
    await persistTotals();
  };

  // Garde le total H.T de la facture synchronisé après chaque changement de ligne
  const persistTotals = async () => {
    if (!_invoice.value) {
      return;
    }

    _invoice.value.totalHt = subTotalWithDegarnissage.value;
    _invoice.value.totalTtc = total.value;
    _invoice.value.totalCommission = totalCommission.value;

    await updateInvoiceUseCase.execute(InvoiceMapper.viewToDto(_invoice.value));
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
      throw e;
    } finally {
      loading.value = false;
    }
  };

  const _viewStatusToDbCode = (status: InvoiceStatusViewType): string =>
    ({
      pending: 'pending',
      validated: 'paid',
      accepted: 'accepted',
      signed: 'paid',
      sent: 'paid',
      draft: 'draft',
      cancel: 'cancelled',
    } as Record<string, string>)[status] ?? 'pending';

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
    // Une facture émise ne peut jamais être supprimée (obligation légale) : seul un brouillon l'est
    if (!_invoiceId.value || !canDelete.value) {
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
    updateLine,
    removeLine,

    subtotal,
    totalDegarnissage,
    subTotalWithDegarnissage,
    totalTaxRate,
    totalCommission,
    total,

    invoiceStatus,
    isReadOnly,
    canDelete,
    isSent,
    sentAt,
    hasItems,
    updateInvoice,
    updateInvoiceStatus,
    deleteInvoice,
    sendInvoice,
  };
}