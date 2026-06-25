// region -> IMPORTS
import { IAuthState } from '@/@application/states/interfaces/IAuthState';
import { IGarageUseCase } from '@/@domain/useCases/IGarageUseCase';
// import { IVehicleUseCase } from '@/@domain/useCases/IVehicleUseCase';
import { IGetDocumentStatusUseCase } from '@/@domain/useCases/IGetDocumentStatusUseCase';
import { IBodyMaterialUseCase } from '@/@domain/useCases/carRepair/IBodyMaterialUseCase';
import { IBodyPartUseCase } from '@/@domain/useCases/carRepair/IBodyPartUseCase';
import { IDentRepairTypeUseCase } from '@/@domain/useCases/carRepair/IDentRepairTypeUseCase';
import { ICalculateLineCostUseCase } from '@/@domain/useCases/cost/ICalculateLineCostUseCase';
import { IDeleteLineItemUseCase } from '@/@domain/useCases/lineItem/ILineItemUseCase';
import { IAddQuoteLineItemUseCase } from '@/@domain/useCases/quotes/IAddQuoteLineItemUseCase';
import { IDeleteQuoteUseCase } from '@/@domain/useCases/quotes/IDeleteQuoteUseCase';
import { IDuplicateQuoteToInvoiceUseCase } from '@/@domain/useCases/quotes/IDuplicateQuoteToInvoiceUseCase';
import { IGetQuoteDetailUseCase } from '@/@domain/useCases/quotes/IGetQuoteDetailUseCase';
import { IGetQuoteUseCase } from '@/@domain/useCases/quotes/IGetQuoteUseCase';
import { IUpdateQuoteUseCase } from '@/@domain/useCases/quotes/IUpdateQuoteUseCase';
import { ISettingPriceUseCase } from '@/@domain/useCases/settings/price/ISettingPriceUseCase';
import { container } from '@/@infrastructure/ioc/inversify.config';
import { SYMBOLS } from '@/@infrastructure/ioc/symbols';
import { DocumentStatuseMapper } from '@/@presentation/mappers/DocumentStatuseMapper';
import { GarageMapper } from '@/@presentation/mappers/GarageMapper';
import { LineItemMapper } from '@/@presentation/mappers/LineItemMapper';
import { QuoteMapper } from '@/@presentation/mappers/QuoteMapper';
// import { VehicleMapper } from '@/@presentation/mappers/VehicleMapper';
import { BodyMaterialMapper } from '@/@presentation/mappers/settings/BodyMaterialMapper';
import { BodyPartMapper } from '@/@presentation/mappers/settings/BodyPartMapper';
import { RepairTypeMapper } from '@/@presentation/mappers/settings/RepairTypeMapper';
import { SettingPriceMapper } from '@/@presentation/mappers/settings/price/SettingPriceMapper';
import { CountryViewModel } from '@/@presentation/types/models/CountryViewModel';
import { DocumentStatusViewModel } from '@/@presentation/types/models/DocumentStatusViewModel';
import { GarageViewModel } from '@/@presentation/types/models/GarageViewModel';
import { LineItemViewModel } from '@/@presentation/types/models/LineItemViewModel';
import { QuoteViewModel } from '@/@presentation/types/models/QuoteViewModel';
// import { VehicleViewModel } from '@/@presentation/types/models/VehicleViewModel';
import { BodyMaterialViewModel } from '@/@presentation/types/models/carRepair/BodyMaterialViewModel';
import { BodyPartViewModel } from '@/@presentation/types/models/carRepair/BodyPartViewModel';
import { DentRepairTypeViewModel } from '@/@presentation/types/models/carRepair/DentRepairTypeViewModel';
import { SettingPriceViewModel } from '@/@presentation/types/models/settings/price/SettingPriceViewModel';
import { computed, ref } from 'vue';
import { IOrganizationMemberUseCase } from '@/@domain/useCases/organizationMember/IOrganizationMemberUseCase';
import { OrganizationMemberMapper } from '@/@presentation/mappers/organizations/OrganizationMemberMapper';
import { OrganizationMemberViewModel } from '@/@presentation/types/models/organizations/OrganizationMemberViewmodel';
// endregion

export function useEditQuoteState() {
  // #region -> DEPENDENCIES
  const authState = container.get<IAuthState>(SYMBOLS.States.AuthState);

  const getDocumentStatuseUseCase = container.get<IGetDocumentStatusUseCase>(SYMBOLS.UseCases.GetDocumentStatus);

  const getQuoteUseCase = container.get<IGetQuoteUseCase>(SYMBOLS.UseCases.Quote.GetQuoteUseCase);
  const getQuoteDetailUseCase = container.get<IGetQuoteDetailUseCase>(SYMBOLS.UseCases.Quote.GetQuoteDetailsUseCase);
  const deleteQuoteUseCase = container.get<IDeleteQuoteUseCase>(SYMBOLS.UseCases.Quote.DeleteQuoteUseCase)

  const garageUseCase = container.get<IGarageUseCase>(SYMBOLS.UseCases.Garage);
  // const vehicleUseCase = container.get<IVehicleUseCase>(SYMBOLS.UseCases.Vehicle);
  const technicianUseCase = container.get<IOrganizationMemberUseCase>(SYMBOLS.UseCases.OrganizationMemberUseCase);

  const bodyPartUseCase = container.get<IBodyPartUseCase>(SYMBOLS.UseCases.CarRepair.BodyPartUseCase);
  const bodyMaterialUseCase = container.get<IBodyMaterialUseCase>(SYMBOLS.UseCases.CarRepair.BodyMaterialUseCase);
  const repairTypeUseCase = container.get<IDentRepairTypeUseCase>(SYMBOLS.UseCases.CarRepair.DentRepairTypeUseCase);

  const priceParamsUseCase = container.get<ISettingPriceUseCase>(SYMBOLS.UseCases.Setting.Price.AllUseCase);

  const updateQuoteUseCase = container.get<IUpdateQuoteUseCase>(SYMBOLS.UseCases.Quote.UpdateQuoteUseCase);
  const calculateLineCostUseCase = container.get<ICalculateLineCostUseCase>(SYMBOLS.UseCases.CostCalculator.CalculateLineCostUseCase);
  const addQuoteDetailsUseCase = container.get<IAddQuoteLineItemUseCase>(SYMBOLS.UseCases.Quote.AddLineItemUseCase);
  const deleteLineItemUseCase = container.get<IDeleteLineItemUseCase>(SYMBOLS.UseCases.Quote.DeleteLineItemUseCase);

  const duplicateQuoteToInvoiceUseCase = container.get<IDuplicateQuoteToInvoiceUseCase>(SYMBOLS.UseCases.Quote.DuplicateQuoteToInvoiceUseCase)
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
      if (!authState.userContext.value)
        throw new Error('User not found');

      // Paralléliser tous les appels
      const [quoteDto, quoteDetailDto, statusesDto, garageResult, technicianResult, bodyPartResult, bodyMaterialResult, repairTypeResult, priceParamsResult] =
        await Promise.all([
          getQuoteUseCase.execute(id),
          getQuoteDetailUseCase.execute(id),
          getDocumentStatuseUseCase.execute(),
          garageUseCase.getGaragesByOrganizationId(authState.userContext.value.organization.id).catch(() => []),
          technicianUseCase.getMembersByOrganizationId(authState.userContext.value.organization.id).catch(() => []),
          bodyPartUseCase.executeGetAll().catch(() => []),
          bodyMaterialUseCase.executeGetAll().catch(() => []),
          repairTypeUseCase.executeGetAll().catch(() => []),
          priceParamsUseCase.getByOrganizationId(authState.userContext.value.organization.id).catch(() => undefined),
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

      if (!_quote.value.garage) {
        return;
      }
      
      addGarage(_quote.value.garage)

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

  const selectedCountry = computed(() => _quote.value?.country);
  const isForfait = computed(() => _quote.value?.isForfait ?? false);
  const isDisplayUnitPrice = computed(() => _quote.value?.isDisplayUnitPrice ?? true);
  const isComputeCommissionWithoutDentRemoval = computed(() => _quote.value?.isComputeCommissionWithoutDentRemoval ?? true);
  const forfaitAmount = computed(() => _quote.value?.forfaitAmount);

  const isReadOnly = computed(() => {
    const code = _quote.value?.status?.code;
    return code === 'accepted' || code === 'refused' || code === 'invoiced';
  });

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
  }

  const removeLine = (lineId: string | undefined) => {
    if (!lineId) {
      return;
    };

    deleteLineItemUseCase.execute(lineId)
    const index = _quoteLines.value.findIndex((line) => line.id === lineId);
    if (index >= 0) {
      _quoteLines.value.splice(index, 1);
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

  const duplicateQuoteToInvoice = async (): Promise<string | undefined> => {
    if (!_quote.value)
      return undefined

    const invoice = await duplicateQuoteToInvoiceUseCase.execute(QuoteMapper.viewToDto(_quote.value), _quoteLines.value.map(LineItemMapper.viewToDto))
    return invoice?.id
  }

  const deleteQuote = () => {
    if (!_quote.value?.id) {
      return;
    }

    deleteQuoteUseCase.execute(_quote.value?.id)
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
    isAccepted,
    isRefused
  };
}
