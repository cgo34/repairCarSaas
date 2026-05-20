// region -> IMPORTS
import { IAuthState } from '@/@application/states/interfaces/IAuthState';
import { IGarageUseCase } from '@/@domain/useCases/IGarageUseCase';
import { IVehicleUseCase } from '@/@domain/useCases/IVehicleUseCase';
import { IUserUseCase } from '@/@domain/useCases/IUserUseCase';
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
import { IGetDocumentStatuseUseCase } from '@/@domain/useCases/IGetDocumentStatusUseCase';
import { ISettingPriceUseCase } from '@/@domain/useCases/settings/price/ISettingPriceUseCase';
import { container } from '@/@infrastructure/ioc/inversify.config';
import { SYMBOLS } from '@/@infrastructure/ioc/symbols';
import { GarageMapper } from '@/@presentation/mappers/GarageMapper';
import { LineItemMapper } from '@/@presentation/mappers/LineItemMapper';
import { InvoiceMapper } from '@/@presentation/mappers/InvoiceMapper';
import { VehicleMapper } from '@/@presentation/mappers/VehicleMapper';
import { BodyMaterialMapper } from '@/@presentation/mappers/settings/BodyMaterialMapper';
import { BodyPartMapper } from '@/@presentation/mappers/settings/BodyPartMapper';
import { RepairTypeMapper } from '@/@presentation/mappers/settings/RepairTypeMapper';
import { SettingPriceMapper } from '@/@presentation/mappers/settings/price/SettingPriceMapper';
import { UserMapper } from '@/@presentation/mappers/UserMapper';
import { CountryViewModel } from '@/@presentation/types/models/CountryViewModel';
import { GarageViewModel } from '@/@presentation/types/models/GarageViewModel';
import { VehicleViewModel } from '@/@presentation/types/models/VehicleViewModel';
import { LineItemViewModel } from '@/@presentation/types/models/LineItemViewModel';
import { InvoiceViewModel } from '@/@presentation/types/models/InvoiceViewModel';
import { InvoiceStatusViewType } from '@/@presentation/types/models/InvoiceStatusViewType';
import { UserViewModel } from '@/@presentation/types/models/UserViewModel';
import { BodyMaterialViewModel } from '@/@presentation/types/models/carRepair/BodyMaterialViewModel';
import { BodyPartViewModel } from '@/@presentation/types/models/carRepair/BodyPartViewModel';
import { DentRepairTypeViewModel } from '@/@presentation/types/models/carRepair/DentRepairTypeViewModel';
import { SettingPriceViewModel } from '@/@presentation/types/models/settings/price/SettingPriceViewModel';
import { computed, ref } from 'vue';
// endregion

export function useEditInvoiceState() {
  // #region -> DEPENDENCIES
  const authState = container.get<IAuthState>(SYMBOLS.States.AuthState);

  const getInvoiceUseCase = container.get<IGetInvoiceUseCase>(SYMBOLS.UseCases.Invoice.GetInvoiceUseCase);
  const getInvoiceDetailUseCase = container.get<IGetInvoiceDetailUseCase>(SYMBOLS.UseCases.Invoice.GetInvoiceDetailsUseCase);
  const deleteInvoiceUseCase = container.get<IDeleteInvoiceUseCase>(SYMBOLS.UseCases.Invoice.DeleteInvoiceUseCase)
  const sendInvoiceUseCase = container.get<ISendInvoiceUseCase>(SYMBOLS.UseCases.Invoice.SendInvoiceUseCase);

  const garageUseCase = container.get<IGarageUseCase>(SYMBOLS.UseCases.Garage);
  const vehicleUseCase = container.get<IVehicleUseCase>(SYMBOLS.UseCases.Vehicle);
  const technicianUseCase = container.get<IUserUseCase>(SYMBOLS.UseCases.UserUseCase);

  const bodyPartUseCase = container.get<IBodyPartUseCase>(SYMBOLS.UseCases.CarRepair.BodyPartUseCase);
  const bodyMaterialUseCase = container.get<IBodyMaterialUseCase>(SYMBOLS.UseCases.CarRepair.BodyMaterialUseCase);
  const repairTypeUseCase = container.get<IDentRepairTypeUseCase>(SYMBOLS.UseCases.CarRepair.DentRepairTypeUseCase);

  const priceParamsUseCase = container.get<ISettingPriceUseCase>(SYMBOLS.UseCases.Setting.Price.AllUseCase);

  const updateInvoiceUseCase = container.get<IUpdateInvoiceUseCase>(SYMBOLS.UseCases.Invoice.UpdateInvoiceUseCase);
  const getDocumentStatuseUseCase = container.get<IGetDocumentStatuseUseCase>(SYMBOLS.UseCases.GetDocumentStatuse);
  const calculateLineCostUseCase = container.get<ICalculateLineCostUseCase>(SYMBOLS.UseCases.CostCalculator.CalculateLineCostUseCase);
  const addInvoiceDetailsUseCase = container.get<IAddInvoiceLineItemUseCase>(SYMBOLS.UseCases.Invoice.AddLineItemUseCase);
  const deleteLineItemUseCase = container.get<IDeleteLineItemUseCase>(SYMBOLS.UseCases.Invoice.DeleteLineItemUseCase);
  // #endregion

  // #region -> CONSTANTS
  const LINE_ITEM_INCREMENT = 1;
  // #endregion

  // #region -> REFS
  const _priceParams = ref<SettingPriceViewModel>();


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

  const _selectedCountry = ref<CountryViewModel>();
  
  const _bodyParts = ref<BodyPartViewModel[]>([]);
  const _bodyMaterials = ref<BodyMaterialViewModel[]>([]);
  const _repairTypes = ref<DentRepairTypeViewModel[]>([]);

  const _isForfait = ref<boolean>(false);
  const _isDisplayUnitPrice = ref<boolean>(true);
  const _isComputeCommissionWithoutDentRemoval = ref<boolean>(true);
  const _forfaitAmount = ref<number | undefined>(undefined);

  const _invoiceLines = ref<LineItemViewModel[]>([]);
  const _invoiceId = ref<string>('');
  const _invoiceStatusId = ref<string>('');

  const loading = ref(false);
  const error = ref(undefined);
// #endregion

  // #region -> INIT
  const init = async (id: string) => {
    loading.value = true;
    try {
      if (!authState.user.value)
        throw new Error('User not found');

      // resetInvoice();
      _invoiceId.value = id;     
      
      const invoiceDto = await getInvoiceUseCase.execute(id);
      const invoiceDetailDto = await getInvoiceDetailUseCase.execute(id);
      
      _invoice.value = InvoiceMapper.dtoToView(invoiceDto);
      _invoiceStatusId.value = invoiceDto?.statusId ?? '';
      _isForfait.value = invoiceDto?.isForfait ?? false
      _forfaitAmount.value = invoiceDto?.forfaitAmount
      
      _invoiceLines.value = invoiceDetailDto?.map((line, idx) => {
        
        return {
          ...LineItemMapper.dtoToView(line),
          lineId: idx + 1,
        }
      }) ?? [];
      
      
      // TODO: (gce) -> MOVE TO MAPPER
      _invoiceInformations.value.number = _invoice.value.invoiceNumber;
      const startDate = new Date(_invoice.value.startDate);
      _invoiceInformations.value.date = startDate.toISOString().split('T')[0];

      // Ajout d’un mois
      // const expirationDate = new Date(startDate);
      // expirationDate.setMonth(expirationDate.getMonth() + 1);
      // _invoiceInformations.value.expirationDate = expirationDate.toISOString().split('T')[0];
      _invoiceInformations.value.status = _invoice.value.status;

      _selectedTechnician.value = _invoice.value.technician;
      _selectedGarage.value = _invoice.value.garage;
      if (_invoice.value.garage?.id) {
        const vehiclesResult = await vehicleUseCase.getByGarageId(_invoice.value.garage.id).catch(() => []);
        _vehicles.value = vehiclesResult.map(VehicleMapper.dtoToView);
        if (_invoice.value.vehicleId) {
          _selectedVehicle.value = _vehicles.value.find(v => v.id === _invoice.value.vehicleId);
        }
      }

      _carInformations.value.immatriculation = _invoice.value.carImmatriculation ?? '';
      _carInformations.value.brand = _invoice.value.carBrand ?? '';
      _carInformations.value.dateEntryCirculation = _invoice.value.carDateEntryCirculation ?? '';

      const [garageResult, technicianResult, bodyPartResult, bodyMaterialResult, repairTypeResult, priceParamsResult] =
        await Promise.allSettled([
          garageUseCase.getByUserId(authState.user.value?.id),
          technicianUseCase.getUsers(),
          bodyPartUseCase.executeGetAll(),
          bodyMaterialUseCase.executeGetAll(),
          repairTypeUseCase.executeGetAll(),
          priceParamsUseCase.getByUserId(authState.user.value?.id),
        ]);

      if (garageResult.status === 'fulfilled')
        _garages.value = garageResult.value.map((g) => GarageMapper.dtoToView(g));

      if (technicianResult.status === 'fulfilled')
        _technicians.value = [
          ...technicianResult.value.map((u) => UserMapper.dtoToView(u)),
          // TODO: (gce) -> REMOVE MOCK
          { id: '1', fullName: 'John Doe', email: 'technicien1@gmail.com', password: '123456789', createdAt: '2021-09-01T00:00:00' },
          { id: '2', fullName: 'Albert Dupont', email: 'technicien2@gmail.com', password: '123456789', createdAt: '2021-09-01T00:00:00' },
        ];

      if (bodyPartResult.status === 'fulfilled')
        _bodyParts.value = bodyPartResult.value.map((bp) => BodyPartMapper.dtoToView(bp));

      if (bodyMaterialResult.status === 'fulfilled')
        _bodyMaterials.value = bodyMaterialResult.value.map((bm) => BodyMaterialMapper.dtoToView(bm));

      if (repairTypeResult.status === 'fulfilled')
        _repairTypes.value = repairTypeResult.value.map((rt) => RepairTypeMapper.dtoToView(rt));

      if (priceParamsResult.status === 'fulfilled') {
        _priceParams.value = SettingPriceMapper.dtoToView(priceParamsResult.value);
        // Recalculer les lignes existantes dont le prix est 0
        _invoiceLines.value.forEach(line => {
          if ((!line.price || line.price === 0) && line.bodyPart && line.bodyMaterial && line.repairType) {
            try {
              computePrice(line);
            } catch (err) {
              console.warn('[Invoice] computePrice a échoué pour la ligne', line.lineId, err);
            }
          }
        });
      } else {
        console.warn('[Invoice] priceParams rejeté:', priceParamsResult.reason);
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
    _bodyParts.value = [];
    _bodyMaterials.value = [];
    _repairTypes.value = [];
    _priceParams.value = undefined;
    _invoiceLines.value = [];
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
  //     lineItemType: 'invoice',
  //     price: 0,
  //   }

  //   _invoiceLines.value.push({...lineItem});    
  // }

  const addLine = async (line: LineItemViewModel) => {
    line.invoiceId = _invoiceId.value

    if (_priceParams.value)
      computePrice(line)
    else
      line.price = 0

    const invoiceLinesDto = await addInvoiceDetailsUseCase.executeInvoice(LineItemMapper.viewToDto(line));

    const invoiceAdded =  LineItemMapper.dtoToView(invoiceLinesDto);

    _invoiceLines.value.push({...invoiceAdded});    
  }

  const removeLine = (lineId: string) => {
    deleteLineItemUseCase.execute(lineId)
    const index = _invoiceLines.value.findIndex((line) => line.id === lineId);
    if (index >= 0) {
      _invoiceLines.value.splice(index, 1);
    }
  }

  const selectBodyPart = (lineId: number, bodyPart: BodyPartViewModel) => {
    const line = _invoiceLines.value.find(l => l.lineId === lineId);

    if (!line)
      return; // Sécurité : éviter les erreurs si la ligne n'existe pas

    line.bodyPart = bodyPart;
    computePrice(line.lineId);
  };

  const selectBodyMaterial = (lineId: number, bodyMaterial: BodyMaterialViewModel) => {
    const line = _invoiceLines.value.find(l => l.lineId === lineId);

    if (!line)
      return; // Sécurité : éviter les erreurs si la ligne n'existe pas

    line.bodyMaterial = bodyMaterial;
    computePrice(line.lineId);
  };

  const selectRepairType = (lineId: number, repairType: DentRepairTypeViewModel) => {
    const line = _invoiceLines.value.find(l => l.lineId === lineId);

    if (!line)
      return; // Sécurité : éviter les erreurs si la ligne n'existe pas

    line.repairType = repairType;
    computePrice(line.lineId);
  };

  const setDentRemovalPrice = (lineId: number, dentRemovalPrice: number) => {
    const line = _invoiceLines.value.find(l => l.lineId === lineId);

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
  //   const line = _invoiceLines.value.find(l => l.lineId === lineId);

  //   if (!line || !_priceParams.value)
  //     throw new Error('Price params not found');

  //   if (!line.bodyPart || !line.bodyMaterial || !line.repairType || !line.impactCount25 || !line.impactCount35)
  //     return;

  //   const lineItemViewDto = LineItemMapper.viewToDto(line);
  //   line.price = calculateLineCostUseCase.execute(lineItemViewDto, SettingPriceMapper.viewToDto(_priceParams.value));
  // }

  const computePrice = (line: LineItemViewModel) => {
    if (!_priceParams.value) {
      console.warn('[Invoice] computePrice: _priceParams non chargé, prix = 0');
      line.price = 0;
      return;
    }
    try {
      const lineItemViewDto = LineItemMapper.viewToDto(line);
      const priceDto = SettingPriceMapper.viewToDto(_priceParams.value);
      line.price = calculateLineCostUseCase.execute(lineItemViewDto, priceDto);
    } catch (e) {
      console.error('[Invoice] computePrice erreur:', e);
      line.price = 0;
    }
  }

  
  const subtotal = computed(() => {
    if (!_isForfait.value) {
      return _invoiceLines.value?.reduce((sum, item) => {
        return sum + item.price; // 👈 Évite undefined en mettant `?? 0`
      }, 0) ?? 0// 👈 Ajoute la valeur initiale ici
    }

    return _forfaitAmount.value ?? 0;
  }
  );

  const totalDegarnissage = computed(() => 
    _invoiceLines.value.reduce((sum, item) => {
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

  const totalCommission = computed(() => {
    const rate = (_selectedGarage.value?.percentageCommission ?? 0) / 100;
    if (!rate) return 0;
    if (_isForfait.value) return (_forfaitAmount.value ?? 0) * rate;
    const base = _isComputeCommissionWithoutDentRemoval.value ? subtotal.value : subTotalWithDegarnissage.value;
    return base * rate;
  });

  const total = computed(() => {
    if (!_isForfait.value) {
      return subTotalWithDegarnissage.value + totalTaxRate.value;
    }

    if (!_forfaitAmount.value)
      return 0;

    return _forfaitAmount.value + totalTaxRate.value;
  });

  const updateInvoice = async () => {
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
        status: (_invoiceInformations.value.status as InvoiceStatusViewType) ?? 'pending',
        userId: authState.user.value.id,
        
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
        totalHt: subTotalWithDegarnissage.value,
      }

      const _baseDto = InvoiceMapper.viewToDto(_invoice.value);
      const invoiceDto = await updateInvoiceUseCase.execute({
        ..._baseDto,
        // N'inclure statusId que si c'est un vrai UUID (évite d'envoyer '' → 400)
        ...(_invoiceStatusId.value ? { statusId: _invoiceStatusId.value } : {}),
      }).then(async (invoice) => {
        // _invoice.value = InvoiceMapper.dtoToView(invoice);
        // if (!invoice.id)
        //   throw new Error('Invoice not saved');

        // const test = _invoiceLines.value.map((line) => {
        //   const dtoLine = LineItemMapper.viewToDto(line);
        //   return {
        //     ...dtoLine,
        //     id: undefined,
        //   }
        // })
      });


      //   const invoiceLinesDto = await updateInvoiceDetailsUseCase.executeInvoice(invoice.id, _invoiceLines.value.map((line) => LineItemMapper.viewToDto(line)));
      //   console.log('Invoice lines saved', invoiceLinesDto);

      //   _invoiceLines.value = invoiceLinesDto.map(LineItemMapper.dtoToView);

      // });
      
    } catch (e) {
      error.value = e;
    } finally {
      loading.value = false;
    }
  }
  // #endregion

  // Mapping statut vue → code DB
  const _viewStatusToDbCode = (status: InvoiceStatusViewType): string => ({
    pending: 'processing',
    validated: 'finalized',
    accepted: 'accepted',
    signed: 'finalized',
    sent: 'finalized',
    draft: 'processing',
    cancel: 'cancelled',
  } as Record<string, string>)[status] ?? 'processing';

  const updateInvoiceStatus = async (status: InvoiceStatusViewType) => {
    if (!_invoice.value)
      throw new Error('Invoice not found');

    try {
      // Récupérer le UUID correspondant au code DB
      const statuses = await getDocumentStatuseUseCase.execute();
      const dbCode = _viewStatusToDbCode(status);
      const found = statuses.find(s => s.code === dbCode);
      if (!found) throw new Error(`Statut DB introuvable pour: ${dbCode}`);

      _invoiceStatusId.value = found.id;
      _invoiceInformations.value.status = status;
      _invoice.value = { ..._invoice.value, status };

      await updateInvoiceUseCase.execute({
        ...InvoiceMapper.viewToDto(_invoice.value),
        ...(found.id ? { statusId: found.id } : {}),
      });
    } catch (e) {
      console.error('[Invoice] updateInvoiceStatus erreur:', e);
      throw e;
    }
  };

  // #region -> COMPUTED
  // Liste des bodyParts restants (non sélectionnés)
  const availableBodyParts = computed(() => {
    const selectedIds = new Set(_invoiceLines.value.map((line) => {
      return line.bodyPart?.id;
      
    }));
    return _bodyParts.value.filter((bp) => !selectedIds.has(bp.id));
  });
  // #endregion

  const deleteInvoice = (invoiceNumber: string) => {
    deleteInvoiceUseCase.execute(_invoiceId.value)
  }

  const sendInvoice = async () => {
    if (!_invoiceId.value) {
      throw new Error('Invoice ID not found');
    }
    await sendInvoiceUseCase.execute(_invoiceId.value);
  };

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

    invoiceLines: computed(() => _invoiceLines.value),
    addLine,
    removeLine,

    subtotal,
    totalDegarnissage,
    subTotalWithDegarnissage,
    totalTaxRate,
    totalCommission,
    total,

    invoiceStatus: computed(() => _invoiceInformations.value.status as InvoiceStatusViewType),
    updateInvoice,
    updateInvoiceStatus,
    deleteInvoice,
    sendInvoice
  };
}
