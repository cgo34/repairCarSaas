// region -> IMPORTS
import { IAuthState } from '@/@application/states/interfaces/IAuthState';
import { IGarageUseCase } from '@/@domain/useCases/IGarageUseCase';
import { IUserUseCase } from '@/@domain/useCases/IUserUseCase';
import { IBodyMaterialUseCase } from '@/@domain/useCases/carRepair/IBodyMaterialUseCase';
import { IBodyPartUseCase } from '@/@domain/useCases/carRepair/IBodyPartUseCase';
import { IDentRepairTypeUseCase } from '@/@domain/useCases/carRepair/IDentRepairTypeUseCase';
import { ICalculateLineCostUseCase } from '@/@domain/useCases/cost/ICalculateLineCostUseCase';
import { IDeleteLineItemUseCase } from '@/@domain/useCases/lineItem/ILineItemUseCase';
import { IAddQuoteLineItemUseCase } from '@/@domain/useCases/quotes/IAddQuoteLineItemUseCase';
import { IDeleteQuoteUseCase } from '@/@domain/useCases/quotes/IDeleteQuoteUseCase';
import { IGetQuoteDetailUseCase } from '@/@domain/useCases/quotes/IGetQuoteDetailUseCase';
import { IGetQuoteUseCase } from '@/@domain/useCases/quotes/IGetQuoteUseCase';
import { IUpdateQuoteUseCase } from '@/@domain/useCases/quotes/IUpdateQuoteUseCase';
import { ISettingPriceUseCase } from '@/@domain/useCases/settings/price/ISettingPriceUseCase';
import { container } from '@/@infrastructure/ioc/inversify.config';
import { SYMBOLS } from '@/@infrastructure/ioc/symbols';
import { GarageMapper } from '@/@presentation/mappers/GarageMapper';
import { LineItemMapper } from '@/@presentation/mappers/LineItemMapper';
import { QuoteMapper } from '@/@presentation/mappers/QuoteMapper';
import { BodyMaterialMapper } from '@/@presentation/mappers/settings/BodyMaterialMapper';
import { BodyPartMapper } from '@/@presentation/mappers/settings/BodyPartMapper';
import { RepairTypeMapper } from '@/@presentation/mappers/settings/RepairTypeMapper';
import { SettingPriceMapper } from '@/@presentation/mappers/settings/price/SettingPriceMapper';
import { CountryViewModel } from '@/@presentation/types/models/CountryViewModel';
import { GarageViewModel } from '@/@presentation/types/models/GarageViewModel';
import { LineItemViewModel } from '@/@presentation/types/models/LineItemViewModel';
import { QuoteViewModel } from '@/@presentation/types/models/QuoteViewModel';
import { UserViewModel } from '@/@presentation/types/models/UserViewModel';
import { BodyMaterialViewModel } from '@/@presentation/types/models/carRepair/BodyMaterialViewModel';
import { BodyPartViewModel } from '@/@presentation/types/models/carRepair/BodyPartViewModel';
import { DentRepairTypeViewModel } from '@/@presentation/types/models/carRepair/DentRepairTypeViewModel';
import { SettingPriceViewModel } from '@/@presentation/types/models/settings/price/SettingPriceViewModel';
import { computed, ref } from 'vue';
// endregion

export function useEditQuoteState() {
  // #region -> DEPENDENCIES
  const authState = container.get<IAuthState>(SYMBOLS.States.AuthState);

  const getQuoteUseCase = container.get<IGetQuoteUseCase>(SYMBOLS.UseCases.Quote.GetQuoteUseCase);
  const getQuoteDetailUseCase = container.get<IGetQuoteDetailUseCase>(SYMBOLS.UseCases.Quote.GetQuoteDetailsUseCase);
  const deleteQuoteUseCase = container.get<IDeleteQuoteUseCase>(SYMBOLS.UseCases.Quote.DeleteQuoteUseCase)

  const garageUseCase = container.get<IGarageUseCase>(SYMBOLS.UseCases.Garage);
  const technicianUseCase = container.get<IUserUseCase>(SYMBOLS.UseCases.UserUseCase);

  const bodyPartUseCase = container.get<IBodyPartUseCase>(SYMBOLS.UseCases.CarRepair.BodyPartUseCase);
  const bodyMaterialUseCase = container.get<IBodyMaterialUseCase>(SYMBOLS.UseCases.CarRepair.BodyMaterialUseCase);
  const repairTypeUseCase = container.get<IDentRepairTypeUseCase>(SYMBOLS.UseCases.CarRepair.DentRepairTypeUseCase);

  const priceParamsUseCase = container.get<ISettingPriceUseCase>(SYMBOLS.UseCases.Setting.Price.AllUseCase);

  const updateQuoteUseCase = container.get<IUpdateQuoteUseCase>(SYMBOLS.UseCases.Quote.UpdateQuoteUseCase);
  const calculateLineCostUseCase = container.get<ICalculateLineCostUseCase>(SYMBOLS.UseCases.CostCalculator.CalculateLineCostUseCase);
  const addQuoteDetailsUseCase = container.get<IAddQuoteLineItemUseCase>(SYMBOLS.UseCases.Quote.AddLineItemUseCase);
  const deleteLineItemUseCase = container.get<IDeleteLineItemUseCase>(SYMBOLS.UseCases.Quote.DeleteLineItemUseCase);
  // #endregion

  // #region -> CONSTANTS
  let LINE_ITEM_INCREMENT = 1;
  // #endregion

  // #region -> REFS
  const _priceParams = ref<SettingPriceViewModel>();


  const _quote = ref<QuoteViewModel | undefined>(undefined);
  const _quoteInformations = ref({
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

  const _selectedCountry = ref<CountryViewModel>();
  
  const _bodyParts = ref<BodyPartViewModel[]>([]);
  const _bodyMaterials = ref<BodyMaterialViewModel[]>([]);
  const _repairTypes = ref<DentRepairTypeViewModel[]>([]);

  const _isForfait = ref<boolean>(false);
  const _isDisplayUnitPrice = ref<boolean>(true);
  const _isComputeCommissionWithoutDentRemoval = ref<boolean>(true);
  const _forfaitAmount = ref<number | undefined>(undefined);

  const _quoteLines = ref<LineItemViewModel[]>([]);
  const _quoteId = ref<string>('');

  const loading = ref(false);
  const error = ref(undefined);
// #endregion

  // #region -> INIT
  const init = async (id: string) => {
    loading.value = true;
    try {
      if (!authState.user.value)
        throw new Error('User not found');

      // resetQuote();
      _quoteId.value = id;     
      
      const quoteDto = await getQuoteUseCase.execute(id);
      const quoteDetailDto = await getQuoteDetailUseCase.execute(id);
      
      _quote.value = QuoteMapper.dtoToView(quoteDto);
      _isForfait.value = quoteDto?.isForfait ?? false
      _forfaitAmount.value = quoteDto?.forfaitAmount
      
      _quoteLines.value = quoteDetailDto?.map((line, idx) => {
        
        return {
          ...LineItemMapper.dtoToView(line),
          lineId: idx + 1,
        }
      }) ?? [];
      
      
      // TODO: (gce) -> MOVE TO MAPPER
      _quoteInformations.value.number = _quote.value.quoteNumber;
      const startDate = new Date(_quote.value.startDate);
      _quoteInformations.value.date = startDate.toISOString().split('T')[0];

      // Ajout d’un mois
      // const expirationDate = new Date(startDate);
      // expirationDate.setMonth(expirationDate.getMonth() + 1);
      // _quoteInformations.value.expirationDate = expirationDate.toISOString().split('T')[0];
      _quoteInformations.value.status = _quote.value.status;

      _selectedTechnician.value = _quote.value.technician;
      _selectedGarage.value = _quote.value.garage;

      _carInformations.value.immatriculation = _quote.value.carImmatriculation ?? '';
      _carInformations.value.brand = _quote.value.carBrand ?? '';
      _carInformations.value.dateEntryCirculation = _quote.value.carDateEntryCirculation ?? '';

      const [garageData, technicianData, bodyPartData, bodyMaterialData, repairTypeData, priceParamsData] =
        await Promise.all([
          garageUseCase.getByUserId(authState.user.value?.id),
          technicianUseCase.getUsers(),
          bodyPartUseCase.executeGetAll(),
          bodyMaterialUseCase.executeGetAll(),
          repairTypeUseCase.executeGetAll(),
          priceParamsUseCase.getByUserId(authState.user.value?.id),
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
      _bodyParts.value = bodyPartData.map((bp) => BodyPartMapper.dtoToView(bp));
      _bodyMaterials.value = bodyMaterialData.map((bm) => BodyMaterialMapper.dtoToView(bm));
      _repairTypes.value = repairTypeData.map((rt) => RepairTypeMapper.dtoToView(rt));
      _priceParams.value = SettingPriceMapper.dtoToView(priceParamsData);
      
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
    _bodyParts.value = [];
    _bodyMaterials.value = [];
    _repairTypes.value = [];
    _priceParams.value = undefined;
    _quoteLines.value = [];
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

  // const addLine = () => {
  //   if (!_priceParams.value)
  //     throw new Error('Price params not found');
    
  //   const lineItem: LineItemViewModel = { 
  //     lineId: LINE_ITEM_INCREMENT++, 
  //     bodyPart: undefined, 
  //     impactCount25: undefined,
  //     impactCount35: undefined,
  //     bodyMaterial: undefined, 
  //     repairType: _repairTypes.value.find(rt => rt.code === 'dsp'),
  //     dentRemovalPrice: 0,
  //     lineItemType: 'quote',
  //     price: 0,
  //   }

  //   _quoteLines.value.push({...lineItem});    
  // }

  const addLine = async (line: LineItemViewModel) => {
    if (!_priceParams.value)
      throw new Error('Price params not found');
    
    line.quoteId = _quoteId.value
    computePrice(line)

    const quoteLinesDto = await addQuoteDetailsUseCase.executeQuote(LineItemMapper.viewToDto(line));

    const quoteAdded =  LineItemMapper.dtoToView(quoteLinesDto);

    _quoteLines.value.push({...quoteAdded});    
  }

  const removeLine = (lineId: string) => {
    deleteLineItemUseCase.execute(lineId)
    const index = _quoteLines.value.findIndex((line) => line.id === lineId);
    if (index >= 0) {
      _quoteLines.value.splice(index, 1);
    }
  }

  const selectBodyPart = (lineId: number, bodyPart: BodyPartViewModel) => {
    const line = _quoteLines.value.find(l => l.lineId === lineId);

    if (!line)
      return; // Sécurité : éviter les erreurs si la ligne n'existe pas

    line.bodyPart = bodyPart;
    computePrice(line.lineId);
  };

  const selectBodyMaterial = (lineId: number, bodyMaterial: BodyMaterialViewModel) => {
    const line = _quoteLines.value.find(l => l.lineId === lineId);

    if (!line)
      return; // Sécurité : éviter les erreurs si la ligne n'existe pas

    line.bodyMaterial = bodyMaterial;
    computePrice(line.lineId);
  };

  const selectRepairType = (lineId: number, repairType: DentRepairTypeViewModel) => {
    const line = _quoteLines.value.find(l => l.lineId === lineId);

    if (!line)
      return; // Sécurité : éviter les erreurs si la ligne n'existe pas

    line.repairType = repairType;
    computePrice(line.lineId);
  };

  const setDentRemovalPrice = (lineId: number, dentRemovalPrice: number) => {
    const line = _quoteLines.value.find(l => l.lineId === lineId);

    if (!line)
      return; // Sécurité : éviter les erreurs si la ligne n'existe pas

    line.dentRemovalPrice = dentRemovalPrice;
    // computePrice(line.lineId);
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

  // const computePrice = (lineId: number) => {
  //   const line = _quoteLines.value.find(l => l.lineId === lineId);

  //   if (!line || !_priceParams.value)
  //     throw new Error('Price params not found');

  //   if (!line.bodyPart || !line.bodyMaterial || !line.repairType || !line.impactCount25 || !line.impactCount35)
  //     return;

  //   const lineItemViewDto = LineItemMapper.viewToDto(line);
  //   line.price = calculateLineCostUseCase.execute(lineItemViewDto, SettingPriceMapper.viewToDto(_priceParams.value));
  // }

  const computePrice = (line: LineItemViewModel) => {
    const lineItemViewDto = LineItemMapper.viewToDto(line);
    line.price = calculateLineCostUseCase.execute(lineItemViewDto, SettingPriceMapper.viewToDto(_priceParams.value));
  }

  
  const subtotal = computed(() => {
    if (!_isForfait.value) {
      return _quoteLines.value?.reduce((sum, item) => {
        return sum + item.price; // 👈 Évite undefined en mettant `?? 0`
      }, 0) ?? 0// 👈 Ajoute la valeur initiale ici
    }

    return _forfaitAmount.value ?? 0;
  }
  );

  const totalDegarnissage = computed(() => 
    _quoteLines.value.reduce((sum, item) => {
      return sum + (item.dentRemovalPrice ?? 0); // 👈 Évite undefined en mettant `?? 0`
    }, 0) // 👈 Ajoute la valeur initiale ici
  );

  const subTotalWithDegarnissage = computed(() => {
    return subtotal.value + totalDegarnissage.value;
   
  });

  const totalTaxRate = computed(() => {
    if (!_selectedCountry.value)
      return 0

    if (!_isForfait.value) {
      return subTotalWithDegarnissage.value *  (_selectedCountry.value?.taxRate / 100);
    }

    if (!_forfaitAmount.value)
      return 0;
    
    return _forfaitAmount.value *  (_selectedCountry.value?.taxRate / 100);
  });

  const total = computed(() => {
    if (!_isForfait.value) {
      return subTotalWithDegarnissage.value + totalTaxRate.value;
    }    
    
    if (!_forfaitAmount.value)
      return 0;

    return _forfaitAmount.value + totalTaxRate.value;
  });

  const updateQuote = async () => {
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
        userId: authState.user.value.id,
        
        garage: _selectedGarage.value,
        technician: _selectedTechnician.value,

        carBrand: _carInformations.value.brand,
        carImmatriculation: _carInformations.value.immatriculation,
        carDateEntryCirculation: _carInformations.value.dateEntryCirculation,

        isForfait: _isForfait.value,
        forfaitAmount: _forfaitAmount.value,
        isDisplayUnitPrice: _isDisplayUnitPrice.value,
        isComputeCommissionWithoutDentRemoval: _isComputeCommissionWithoutDentRemoval.value,
        
        
      }
      
      const quoteDto = await updateQuoteUseCase.execute(QuoteMapper.viewToDto(_quote.value)).then(async (quote) => {
        // _quote.value = QuoteMapper.dtoToView(quote);
        // if (!quote.id)
        //   throw new Error('Quote not saved');

        // const test = _quoteLines.value.map((line) => {
        //   const dtoLine = LineItemMapper.viewToDto(line);
        //   return {
        //     ...dtoLine,
        //     id: undefined,
        //   }
        // })
      });


      //   const quoteLinesDto = await updateQuoteDetailsUseCase.executeQuote(quote.id, _quoteLines.value.map((line) => LineItemMapper.viewToDto(line)));
      //   console.log('Quote lines saved', quoteLinesDto);

      //   _quoteLines.value = quoteLinesDto.map(LineItemMapper.dtoToView);

      // });
      
    } catch (e) {
      error.value = e;
    } finally {
      loading.value = false;
    }
  }
  // #endregion

  // #region -> COMPUTED
  // Liste des bodyParts restants (non sélectionnés)
  const availableBodyParts = computed(() => {
    const selectedIds = new Set(_quoteLines.value.map((line) => {
      return line.bodyPart?.id;
      
    }));
    return _bodyParts.value.filter((bp) => !selectedIds.has(bp.id));
  });
  // #endregion

  const deleteQuote = (quoteNumber: string) => {
    deleteQuoteUseCase.execute(_quoteId.value)
  }

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
    selectTechnician,
    selectGarage,
    setGarage,

    carInformations: computed(() => _carInformations.value),
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
    
    isForfait: computed(() => _isForfait.value),
    isDisplayUnitPrice: computed(() => _isDisplayUnitPrice.value),
    isComputeCommissionWithoutDentRemoval: computed(() => _isComputeCommissionWithoutDentRemoval.value),
    setIsForfait,
    setForfaitAmount,
    setIsDisplayUnitPrice,
    setIsComputeCommissionWithoutDentRemoval,
    forfaitAmount: computed(() => _forfaitAmount.value),
    selectCountry,
    selectedCountry: computed(() => _selectedCountry.value),

    quoteLines: computed(() => _quoteLines.value),
    addLine,
    removeLine,

    subtotal,
    totalDegarnissage,
    subTotalWithDegarnissage,
    totalTaxRate,
    total,

    updateQuote,
    deleteQuote
  };
}
