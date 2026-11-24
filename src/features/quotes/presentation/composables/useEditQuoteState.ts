// region -> IMPORTS
import { IAuthState } from '@/features/auth/presentation/state/IAuthState';
import { IGarageUseCase } from '@/features/garages/application/useCases/GarageUseCase';
// import { IVehicleUseCase } from '@/features/vehicles/application/useCases/VehicleUseCase';
import { IGetDocumentStatusUseCase } from '@/features/documentStatuses/application/useCases/GetDocumentStatusUseCase';
import { IBodyMaterialUseCase } from '@/features/carRepairSettings/application/useCases/BodyMaterialUseCase';
import { IBodyPartUseCase } from '@/features/carRepairSettings/application/useCases/BodyPartUseCase';
import { IDentRepairTypeUseCase } from '@/features/carRepairSettings/application/useCases/DentRepairTypeUSeCase';
import { ICalculateLineCostUseCase } from '@/features/costCalculation/application/useCases/CalculateLineCostUseCase';
import { ISendQuoteUseCase } from '@/features/quotes/application/useCases/SendQuoteUseCase';
import { IUpdateQuoteLineItemUseCase } from '@/features/quotes/application/useCases/UpdateQuoteLineItemUseCase';
import { IDeleteLineItemUseCase } from '@/features/lineItems/application/useCases/DeleteLineItemUseCase';
import { IAddQuoteLineItemUseCase } from '@/features/quotes/application/useCases/AddQuoteLineItemUseCase';
import { IDeleteQuoteUseCase } from '@/features/quotes/application/useCases/DeleteQuoteUseCase';
import { IDuplicateQuoteToInvoiceUseCase } from '@/features/quotes/application/useCases/DuplicateQuoteToInvoiceUseCase';
import { IGetQuoteDetailUseCase } from '@/features/quotes/application/useCases/GetQuoteDetailUseCase';
import { IGetQuoteUseCase } from '@/features/quotes/application/useCases/GetQuoteUseCase';
import { IUpdateQuoteUseCase } from '@/features/quotes/application/useCases/UpdateQuoteUseCase';
import { ISettingPriceUseCase } from '@/features/priceSettings/application/useCases/SettingPriceUseCase';
import { DocumentStatuseMapper } from '@/features/documentStatuses/presentation/mappers/DocumentStatuseMapper';
import { GarageMapper } from '@/features/garages/presentation/mappers/GarageMapper';
import { LineItemMapper } from '@/features/lineItems/presentation/mappers/LineItemMapper';
import { QuoteMapper } from '@/features/quotes/presentation/mappers/QuoteMapper';
// import { VehicleMapper } from '@/features/vehicles/presentation/mappers/VehicleMapper';
import { BodyMaterialMapper } from '@/features/carRepairSettings/presentation/mappers/BodyMaterialMapper';
import { BodyPartMapper } from '@/features/carRepairSettings/presentation/mappers/BodyPartMapper';
import { RepairTypeMapper } from '@/features/carRepairSettings/presentation/mappers/RepairTypeMapper';
import { SettingPriceMapper } from '@/features/priceSettings/presentation/mappers/SettingPriceMapper';
import { CountryViewModel } from '@/features/countries/presentation/models/CountryViewModel';
import { DocumentStatusViewModel } from '@/features/documentStatuses/presentation/models/DocumentStatusViewModel';
import { GarageViewModel } from '@/features/garages/presentation/models/GarageViewModel';
import { LineItemViewModel } from '@/features/lineItems/presentation/models/LineItemViewModel';
import { QuoteViewModel } from '@/features/quotes/presentation/models/QuoteViewModel';
// import { VehicleViewModel } from '@/features/vehicles/presentation/models/VehicleViewModel';
import { BodyMaterialViewModel } from '@/features/carRepairSettings/presentation/models/BodyMaterialViewModel';
import { BodyPartViewModel } from '@/features/carRepairSettings/presentation/models/BodyPartViewModel';
import { DentRepairTypeViewModel } from '@/features/carRepairSettings/presentation/models/DentRepairTypeViewModel';
import { SettingPriceViewModel } from '@/features/priceSettings/presentation/models/SettingPriceViewModel';
import { computed, ref } from 'vue';
import { IOrganizationMemberUseCase } from '@/features/organizations/application/useCases/OrganizationMemberUseCase';
import { OrganizationMemberMapper } from '@/features/organizations/presentation/mappers/OrganizationMemberMapper';
import { OrganizationMemberViewModel } from '@/features/organizations/presentation/models/OrganizationMemberViewmodel';
// endregion

export interface UseEditQuoteStateDependencies {
  authState: IAuthState;
  getDocumentStatuseUseCase: IGetDocumentStatusUseCase;
  getQuoteUseCase: IGetQuoteUseCase;
  getQuoteDetailUseCase: IGetQuoteDetailUseCase;
  deleteQuoteUseCase: IDeleteQuoteUseCase;
  garageUseCase: IGarageUseCase;
  technicianUseCase: IOrganizationMemberUseCase;
  bodyPartUseCase: IBodyPartUseCase;
  bodyMaterialUseCase: IBodyMaterialUseCase;
  repairTypeUseCase: IDentRepairTypeUseCase;
  priceParamsUseCase: ISettingPriceUseCase;
  updateQuoteUseCase: IUpdateQuoteUseCase;
  calculateLineCostUseCase: ICalculateLineCostUseCase;
  addQuoteDetailsUseCase: IAddQuoteLineItemUseCase;
  deleteLineItemUseCase: IDeleteLineItemUseCase;
  updateLineItemUseCase: IUpdateQuoteLineItemUseCase;
  sendQuoteUseCase: ISendQuoteUseCase;
  duplicateQuoteToInvoiceUseCase: IDuplicateQuoteToInvoiceUseCase;
}

export function createUseEditQuoteState(deps: UseEditQuoteStateDependencies) {
  // #region -> DEPENDENCIES
  const { authState, getDocumentStatuseUseCase, getQuoteUseCase, getQuoteDetailUseCase, deleteQuoteUseCase, garageUseCase, technicianUseCase, bodyPartUseCase, bodyMaterialUseCase, repairTypeUseCase, priceParamsUseCase, updateQuoteUseCase, calculateLineCostUseCase, addQuoteDetailsUseCase, deleteLineItemUseCase, updateLineItemUseCase, sendQuoteUseCase, duplicateQuoteToInvoiceUseCase } = deps;



  // const vehicleUseCase = container.get<IVehicleUseCase>(SYMBOLS.UseCases.Vehicle);




  // #endregion

  // #region -> REFS
  const _priceParams = ref<SettingPriceViewModel>();

  const _statuses = ref<DocumentStatusViewModel[]>([]);
  const _quote = ref<QuoteViewModel>();

  const _technicians = ref<OrganizationMemberViewModel[]>([]);
  const _garages = ref<GarageViewModel[]>([]);
  // const _vehicles = ref<VehicleViewModel[]>([]);

  const _bodyParts = ref<BodyPartViewModel[]>([]);
  const _bodyMaterials = ref<BodyMaterialViewModel[]>([]);
  const _repairTypes = ref<DentRepairTypeViewModel[]>([]);

  const _quoteLines = ref<LineItemViewModel[]>([]);

  const loading = ref(false);
  const error = ref<unknown>(undefined);
  // #endregion

  // #region -> INIT
  const init = async (id: string) => {
    loading.value = true;
    try {
      const userContext = authState.userContext.value;
      if (!userContext)
        throw new Error('User not found');

      // Paralléliser tous les appels
      const [quoteDto, quoteDetailDto, statusesDto, garageResult, technicianResult, bodyPartResult, bodyMaterialResult, repairTypeResult, priceParamsResult] =
        await Promise.all([
          getQuoteUseCase.execute(id),
          getQuoteDetailUseCase.execute(id),
          getDocumentStatuseUseCase.execute(),
          garageUseCase.getGaragesByOrganizationId(userContext.organization.id).catch(() => []),
          technicianUseCase.getMembersByOrganizationId(userContext.organization.id).catch(() => []),
          bodyPartUseCase.executeGetAll().catch(() => []),
          bodyMaterialUseCase.executeGetAll().catch(() => []),
          repairTypeUseCase.executeGetAll().catch(() => []),
          priceParamsUseCase.getByOrganizationId(userContext.organization.id).catch(() => undefined),
        ]);

      // Mapping des données principales
      _statuses.value = statusesDto.map(DocumentStatuseMapper.dtoToView);

      if (!quoteDto)
        throw new Error('Quote not found');

      _quote.value = QuoteMapper.dtoToView(quoteDto);

      _quoteLines.value = quoteDetailDto?.map((line, idx) => ({
        ...LineItemMapper.dtoToView(line),
        lineId: idx + 1,
      })) ?? [];

      // Mapping des listes
      _technicians.value = technicianResult.map(OrganizationMemberMapper.dtoToView);
      _garages.value = garageResult.map(GarageMapper.dtoToView);
      _bodyParts.value = bodyPartResult.map(BodyPartMapper.dtoToView);
      _bodyMaterials.value = bodyMaterialResult.map(BodyMaterialMapper.dtoToView);
      _repairTypes.value = repairTypeResult.map(RepairTypeMapper.dtoToView);

      if (_quote.value.garage) {
        addGarage(_quote.value.garage)
      }

      if (priceParamsResult) {
        _priceParams.value = SettingPriceMapper.dtoToView(priceParamsResult);
        _quoteLines.value.forEach(line => {
          if (line.bodyPartId && line.bodyMaterialId && line.repairTypeId) {
            computePrice(line);
          }
        });
      }
      // Charger les véhicules du garage si présent
      // if (_quote.value.garage?.id) {
      //   const vehiclesResult = await vehicleUseCase.getByGarageId(_quote.value.garage.id).catch(() => []);
      //   _vehicles.value = vehiclesResult.map(VehicleMapper.dtoToView);
      // }
      
    } catch (e) {
      error.value = e;
    } finally {
      loading.value = false;
    }
  };
  // #endregion 

  // #region -> COMPUTED (dérivés de _quote.value)
  const quoteInformations = computed(() => ({
    number: _quote.value?.quoteNumber ?? '',
    date: _quote.value?.startDate ? new Date(_quote.value.startDate).toISOString().split('T')[0] : '',
    expirationDate: _quote.value?.endDate ? new Date(_quote.value.endDate).toISOString().split('T')[0] : '',
    status: _quote.value?.status,
    isSent: Boolean(_quote.value?.isSent),
  }));
  
  const expirationDate = computed(() => {
    if (!_quote.value?.startDate) return '';
    const date = new Date(_quote.value.startDate);
    date.setMonth(date.getMonth() + 1);
    return date.toISOString().split('T')[0];
  });

  const selectedTechnician = computed(() => _quote.value?.assignedMember);
  const selectedGarage = computed(() => _quote.value?.garage);
  // const selectedVehicle = computed(() => 
  //   _quote.value?.vehicleId ? _vehicles.value.find(v => v.id === _quote.value?.vehicleId) : undefined
  // );

  const carInformations = computed(() => ({
    immatriculation: _quote.value?.carImmatriculation ?? '',
    brand: _quote.value?.carBrand ?? '',
    carYear: _quote.value?.carYear ?? '',
  }));

  const selectedCountry = computed(() => {
    const country = _quote.value?.country;
    return typeof country === 'object' ? country : undefined;
  });
  const isForfait = computed(() => _quote.value?.isForfait ?? false);
  const isDisplayUnitPrice = computed(() => _quote.value?.isDisplayUnitPrice ?? true);
  const isComputeCommissionWithoutDentRemoval = computed(() => _quote.value?.isComputeCommissionWithoutDentRemoval ?? true);
  const forfaitAmount = computed(() => _quote.value?.forfaitAmount);

  const isReadOnly = computed(() => {
    const code = _quote.value?.status?.code;
    return code === 'accepted' || code === 'refused' || code === 'invoiced' || Boolean(_quote.value?.convertToInvoice);
  });

  const isSent = computed(() => Boolean(_quote.value?.isSent));
  const sentAt = computed(() => _quote.value?.sentAt);
  const hasItems = computed(() =>
    _quote.value?.isForfait ? Number(_quote.value?.forfaitAmount ?? 0) > 0 : _quoteLines.value.length > 0,
  );
  const canSend = computed(() => !isReadOnly.value && hasItems.value);
  const canDecide = computed(() => !isReadOnly.value && isSent.value);
  // A quote that has been sent at least once keeps its trace and can no longer be deleted.
  const canDelete = computed(() => !isReadOnly.value && !isSent.value && !_quote.value?.sentAt);

  const isAccepted = computed(() => _quote.value?.status?.code === 'accepted');
  const isRefused = computed(() => _quote.value?.status?.code === 'refused');

  // Liste des bodyParts restants (non sélectionnés)
  const availableBodyParts = computed(() => {
    const selectedIds = new Set(_quoteLines.value.map((line) => line.bodyPart?.id));
    return _bodyParts.value.filter((bp) => !selectedIds.has(bp.id));
  });
  // #endregion

  // #region -> METHODS 
  const selectTechnician = (technician: OrganizationMemberViewModel) => {
    if (_quote.value) {
      _quote.value.assignedMember = technician;
      _quote.value.assigned_member_id = technician.id;
    }
  }

  const selectGarage = async (garage: GarageViewModel) => {
    if (_quote.value) {
      _quote.value.garage = garage;
      _quote.value.garageId = garage?.id;
      // _quote.value.vehicleId = undefined;
    }

    // if (garage?.id) {
    //   const result = await vehicleUseCase.getByGarageId(garage.id).catch(() => []);
    //   _vehicles.value = result.map(VehicleMapper.dtoToView);
    // } else {
    //   _vehicles.value = [];
    // }
  }

  // const selectVehicle = (vehicle: VehicleViewModel | undefined) => {
  //   if (_quote.value) {
  //     _quote.value.vehicleId = vehicle?.id;
  //     if (vehicle) {
  //       _quote.value.carImmatriculation = vehicle.immatriculation;
  //       _quote.value.carBrand = vehicle.marque;
  //       _quote.value.carcarYear = vehicle.annee?.toString() ?? '';
  //     }
  //   }
  // }

  const setGarage = (garage: GarageViewModel) => {
    const existingGarage = _garages.value.find(g => g.name === garage.name)
    if (!existingGarage) {
      _garages.value.push(garage)
    }
    if (_quote.value) {
      _quote.value.garage = garage;
      _quote.value.garageId = garage?.id;
      _quote.value.garageName = garage.name;
      _quote.value.garageAddress = garage.address;
      _quote.value.garageZipCode = garage.zip_code;
      _quote.value.garageCity = garage.city;
      _quote.value.garagePhone = garage.phone;
      _quote.value.garageEmail = garage.email;
      // _quote.value.garagePercentageCommission = garage.percentageCommission;
    }
  }

  const addGarage = (garage: GarageViewModel) => {
    setGarage(garage);
  }


  const setCarImmatriculation = (immatriculation: string) => {
    if (!_quote.value) {
      return;
    }

    _quote.value.carImmatriculation = immatriculation;
  }

  const setCarBrand = (brand: string) => {
    if (!_quote.value) {
      return;
    }

    _quote.value.carBrand = brand;
  }

  const setCarYear = (carYear: string) => {
    if (!_quote.value) {
      return;
    }

    _quote.value.carYear = carYear;
  }

  const selectCountry = (country: CountryViewModel) => {
    if (!_quote.value) {
      return;
    }

    _quote.value.country = country;
  }

  // const setDentRemovalPrice = (lineId: number, dentRemovalPrice: number) => {
  //   const line = _quoteLines.value.find(l => l.lineId === lineId);

  //   if (!line)
  //     return; // Sécurité : éviter les erreurs si la ligne n'existe pas

  //   line.dentRemovalPrice = dentRemovalPrice;
  //   // computePrice(line.lineId);
  // }

  const setIsForfait = (value: boolean) => {
    if (!_quote.value) {
      return;
    }
    _quote.value.isForfait = value;
  }

  const setForfaitAmount = (amount: number) => {
    if (!_quote.value) {
      return;
    }
    _quote.value.forfaitAmount = amount;
  }

  const setIsDisplayUnitPrice = (value: boolean) => {
    if (!_quote.value) {
      return;
    }
    _quote.value.isDisplayUnitPrice = value;
  }

  const setIsComputeCommissionWithoutDentRemoval = (value: boolean) => {
    if (!_quote.value) {
      return;
    }
    _quote.value.isComputeCommissionWithoutDentRemoval = value;
  }

  const subtotal = computed(() => {
    if (!isForfait.value) {
      return _quoteLines.value?.reduce((sum, item) => sum + (item.price ?? 0), 0) ?? 0;
    }
    return forfaitAmount.value ?? 0;
  });

  const totalDegarnissage = computed(() => 
    _quoteLines.value.reduce((sum, item) => {
      return sum + (item.dentRemovalPrice ?? 0); // 👈 Évite undefined en mettant `?? 0`
    }, 0) // 👈 Ajoute la valeur initiale ici
  );

  const subTotalWithDegarnissage = computed(() => {
    return subtotal.value + totalDegarnissage.value;
   
  });

  const totalTaxRate = computed(() => {
    if (!_quote.value) {
      return 0;
    }
    
    if (!selectedCountry.value) {
      return 0
    };

    const taxRate = typeof selectedCountry.value === 'object' ? (selectedCountry.value?.taxRate ?? 0) : 0;

    if (!isForfait.value) {
      return subTotalWithDegarnissage.value * (taxRate / 100);
    }

    if (!forfaitAmount.value) {
      return 0
    };

    return forfaitAmount.value * (taxRate / 100);
  });

  const totalCommission = computed(() => {
    const rate = (selectedGarage.value?.percentageCommission ?? 0) / 100;
    if (!rate) return 0;
    if (isForfait.value) return (forfaitAmount.value ?? 0) * rate;
    const base = isComputeCommissionWithoutDentRemoval.value ? subtotal.value : subTotalWithDegarnissage.value;
    return base * rate;
  });

  const total = computed(() => {
    if (!isForfait.value) {
      return subTotalWithDegarnissage.value + totalTaxRate.value;
    }

    if (!forfaitAmount.value) {
      return 0
    };

    return forfaitAmount.value + totalTaxRate.value;
  });

  const computePrice = (line: LineItemViewModel) => {
    if (!_priceParams.value) {
      return;
    }

    try {
      const lineItemViewDto = LineItemMapper.viewToDto(line);
      const priceDto = SettingPriceMapper.viewToDto(_priceParams.value);
      line.price = calculateLineCostUseCase.execute(lineItemViewDto, priceDto);
    } catch (e) {
      console.error('[Quote] computePrice erreur:', e);
      line.price = 0;
    }
  }

  const addLine = async (line: LineItemViewModel) => {
    line.quoteId = _quote.value?.id
    
    if (_priceParams.value)
      computePrice(line)
    else
      line.price = 0

    const quoteLinesDto = await addQuoteDetailsUseCase.executeQuote(LineItemMapper.viewToDto(line));

    const quoteAdded =  LineItemMapper.dtoToView(quoteLinesDto);

    _quoteLines.value.push({...quoteAdded});
    await persistTotals();
  }

  const updateLine = async (line: LineItemViewModel) => {
    if (!line.id) {
      return;
    }

    line.quoteId = _quote.value?.id;
    computePrice(line);

    const updatedDto = await updateLineItemUseCase.execute(LineItemMapper.viewToDto(line));
    const index = _quoteLines.value.findIndex((l) => l.id === line.id);
    if (index >= 0) {
      _quoteLines.value[index] = { ...LineItemMapper.dtoToView(updatedDto), lineId: _quoteLines.value[index].lineId };
    }
    await persistTotals();
  }

  const removeLine = async (lineId: string | undefined) => {
    if (!lineId) {
      return;
    };

    await deleteLineItemUseCase.execute(lineId)
    const index = _quoteLines.value.findIndex((line) => line.id === lineId);
    if (index >= 0) {
      _quoteLines.value.splice(index, 1);
    }
    await persistTotals();
  }

  // Keeps the quote total in sync after each line change; a sent quote goes back to draft.
  const persistTotals = async () => {
    if (!_quote.value) {
      return;
    }

    _quote.value.totalHt = subTotalWithDegarnissage.value;
    const updated = await updateQuoteUseCase.execute(QuoteMapper.viewToDto(_quote.value));
    _quote.value.isSent = updated.isSent;
    if (updated.status && updated.status_id) {
      _quote.value.status = DocumentStatuseMapper.dtoToView(updated.status);
      _quote.value.status_id = updated.status_id;
    }
  }

  const updateQuote = async () => {
    if (!authState.userContext.value)
      throw new Error('User not found');

    if (!_quote.value)
      throw new Error('Quote not found');

    if (!selectedGarage.value || !selectedTechnician.value)
      throw new Error('Garage or Technician not selected');

    if (!carInformations.value.immatriculation || !carInformations.value.brand || !carInformations.value.carYear)
      throw new Error('Car informations not set');

    loading.value = true;
    try {
      // Mettre à jour totalHt avant la sauvegarde
      _quote.value.totalHt = subTotalWithDegarnissage.value;
      
      await updateQuoteUseCase.execute(QuoteMapper.viewToDto(_quote.value));
      
    } catch (e) {
      error.value = e;
    } finally {
      loading.value = false;
    }
  }
  // #endregion

  const updateQuoteStatus = async (status: Pick<DocumentStatusViewModel, 'code'>) => {
    if (!_quote.value) return;
    
    const statusObject = _statuses.value.find(s => s.code === status.code);
    if (!statusObject) return;

    _quote.value.status = statusObject;
    _quote.value.status_id = statusObject.id;

    await updateQuoteUseCase.execute(QuoteMapper.viewToDto(_quote.value));
  }

  const sendQuote = async () => {
    if (!_quote.value?.id || !canSend.value) return;
    const status = await sendQuoteUseCase.execute(_quote.value.id);
    _quote.value.isSent = true;
    _quote.value.sentAt = new Date();
    _quote.value.status_id = status.id;
    _quote.value.status = { ...(_quote.value.status ?? {}), ...status } as QuoteViewModel['status'];
  }

  const duplicateQuoteToInvoice = async (): Promise<string | undefined> => {
    if (!_quote.value)
      return undefined

    const invoice = await duplicateQuoteToInvoiceUseCase.execute(QuoteMapper.viewToDto(_quote.value), _quoteLines.value.map(LineItemMapper.viewToDto))
    return invoice?.id
  }

  const deleteQuote = async () => {
    if (!_quote.value?.id) {
      return;
    }

    await deleteQuoteUseCase.execute(_quote.value.id);
  }
  return {
    loading,
    error,
    init,

    quote: computed(() => _quote.value),
    quoteInformations,
    expirationDate,

    garages: computed(() => _garages.value),
    technicians: computed(() => _technicians.value),
    selectedTechnician,
    selectedGarage,
    // vehicles: computed(() => _vehicles.value),
    // selectedVehicle,
    selectTechnician,
    selectGarage,
    // selectVehicle,
    setGarage,

    carInformations,
    setCarImmatriculation,
    setCarBrand,
    setCarYear,

    bodyParts: computed(() => _bodyParts.value),
    bodyMaterials: computed(() => _bodyMaterials.value),
    repairTypes: computed(() => _repairTypes.value),
    availableBodyParts,
    
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

    quoteLines: computed(() => _quoteLines.value),
    addLine,
    updateLine,
    removeLine,
    subtotal,
    totalDegarnissage,
    subTotalWithDegarnissage,
    totalTaxRate,
    totalCommission,
    total,

    updateQuote,
    updateQuoteStatus,
    deleteQuote,
    duplicateQuoteToInvoice,

    isReadOnly,
    isSent,
    sentAt,
    hasItems,
    canSend,
    canDecide,
    canDelete,
    sendQuote,
    isAccepted,
    isRefused
  };
}
