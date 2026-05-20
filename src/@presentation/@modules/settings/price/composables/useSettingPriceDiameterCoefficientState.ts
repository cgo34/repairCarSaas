import { computed, ref } from 'vue';

import { inject, injectable } from 'inversify';

import { container } from '@/@infrastructure/ioc/inversify.config';

import { SYMBOLS } from '@/@infrastructure/ioc/symbols';

import { IAuthState } from '@/@application/states/interfaces/IAuthState';

import { ISettingPriceDiameterCoefficientUseCase } from '@/@domain/useCases/settings/price/ISettingPriceDiameterCoefficientUseCase';

import { SettingPriceDiameterCoefficientMapper } from '@/@presentation/mappers/settings/SettingPriceDiameterCoefficientMapper';

import { IUseSettingPriceDiameterCoefficientState } from '@/@presentation/types/composables/settings/price/IUseSettingPriceDiameterCoefficientState';

import { SettingPriceDiameterCoefficientViewModel } from '@/@presentation/types/models/settings/SettingPriceDiameterCoefficientViewModel';

@injectable()
export class UseSettingPriceDiameterCoefficientState
implements IUseSettingPriceDiameterCoefficientState
{
  /**
   * ============================================================
   * DEPENDENCIES
   * ============================================================
   */

  private authState =
    container.get<IAuthState>(
      SYMBOLS.States.AuthState
    );

  private useCase =
    container.get<ISettingPriceDiameterCoefficientUseCase>(
      SYMBOLS.UseCases
        .SettingPriceDiameterCoefficientUseCase
    );

  /**
   * ============================================================
   * STATE
   * ============================================================
   */

  private _settings =
    ref<
      SettingPriceDiameterCoefficientViewModel[]
    >([]);

  private _selectedSetting =
    ref<
      SettingPriceDiameterCoefficientViewModel | null
    >(null);

  loading = ref<boolean>(false);

  error = ref<unknown>(null);

  /**
   * ============================================================
   * INIT
   * ============================================================
   */

  async init(): Promise<void> {
    await this.fetchSettings();
  }

  /**
   * ============================================================
   * FETCH SETTINGS
   * ============================================================
   */

  async fetchSettings():
    Promise<
      SettingPriceDiameterCoefficientViewModel[]
    >
  {
    this.loading.value = true;

    try {
      const organizationId =
        this.authState.userContext.value
          ?.organization.id;

      if (!organizationId) {
        throw new Error(
          'Organization ID is required'
        );
      }

      const dto =
        await this.useCase
          .getByOrganizationId(
            organizationId
          );

      if (!dto) {
        this._settings.value = [];

        return [];
      }

      const view =
        SettingPriceDiameterCoefficientMapper
          .dtoToView(dto);

      this._settings.value = [view];

      return this._settings.value;
    } catch (e) {
      this.error.value = e;

      throw e;
    } finally {
      this.loading.value = false;
    }
  }

  /**
   * ============================================================
   * SELECT SETTING
   * ============================================================
   */

  selectSetting(
    setting:
      SettingPriceDiameterCoefficientViewModel
  ): void
  {
    this._selectedSetting.value = {
      ...setting,
    };
  }

  /**
   * ============================================================
   * CREATE
   * ============================================================
   */

  async createSetting(
    setting:
      SettingPriceDiameterCoefficientViewModel
  ): Promise<void>
  {
    this.loading.value = true;

    try {
      const organizationId =
        this.authState.userContext.value
          ?.organization.id;

      if (!organizationId) {
        throw new Error(
          'Organization ID is required'
        );
      }

      setting.organization_id =
        organizationId;

      const dto =
        SettingPriceDiameterCoefficientMapper
          .viewToDto(setting);

      const created =
        await this.useCase.create(dto);

      const createdView =
        SettingPriceDiameterCoefficientMapper
          .dtoToView(created);

      this._settings.value.push(
        createdView
      );
    } catch (e) {
      this.error.value = e;

      throw e;
    } finally {
      this.loading.value = false;
    }
  }

  /**
   * ============================================================
   * UPDATE
   * ============================================================
   */

  async updateSetting(
    setting:
      SettingPriceDiameterCoefficientViewModel
  ): Promise<void>
  {
    this.loading.value = true;

    try {
      const dto =
        SettingPriceDiameterCoefficientMapper
          .viewToDto(setting);

      const updated =
        await this.useCase.update(dto);

      const updatedView =
        SettingPriceDiameterCoefficientMapper
          .dtoToView(updated);

      this._settings.value =
        this._settings.value.map(s =>
          s.id === updatedView.id
            ? updatedView
            : s
        );
    } catch (e) {
      this.error.value = e;

      throw e;
    } finally {
      this.loading.value = false;
    }
  }

  /**
   * ============================================================
   * SAVE
   * ============================================================
   */

  async saveSetting(
    setting:
      SettingPriceDiameterCoefficientViewModel
  ): Promise<void>
  {
    if (setting.id) {
      await this.updateSetting(setting);

      return;
    }

    await this.createSetting(setting);
  }

  /**
   * ============================================================
   * DELETE
   * ============================================================
   */

  async deleteSetting(
    id: string
  ): Promise<void>
  {
    this.loading.value = true;

    try {
      await this.useCase.delete(id);

      this._settings.value =
        this._settings.value.filter(
          s => s.id !== id
        );
    } catch (e) {
      this.error.value = e;

      throw e;
    } finally {
      this.loading.value = false;
    }
  }

  /**
   * ============================================================
   * RESET
   * ============================================================
   */

  resetSelectedSetting(): void
  {
    this._selectedSetting.value = null;
  }

  /**
   * ============================================================
   * EXPOSE
   * ============================================================
   */

  get settings() {
    return computed(
      () => this._settings.value
    );
  }

  get selectedSetting() {
    return computed(
      () =>
        this._selectedSetting.value
    );
  }
}