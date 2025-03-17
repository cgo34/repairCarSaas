import { Quote } from '@/@domain/entities/Quote';
import { IQuoteRepository } from '@/@domain/repositories/IQuoteRepository';
import { QuoteApiModel } from '@/@infrastructure/database/api/QuoteApiModel';
import { SupabaseClient } from '@/@infrastructure/database/clients/SupabaseClient';
import { QuoteLineItemDto } from '@/@infrastructure/dtos/QuoteLineItemDto';
import { QuoteStatusDto } from '@/@infrastructure/dtos/QuoteStatusDto';
import { IClientProvider } from '@/@infrastructure/interfaces/IClientProvider';
import { SYMBOLS } from '@/@infrastructure/ioc/symbols';
import { QuoteMapper } from '@/@infrastructure/mappers/QuoteMapper';
import { inject, injectable } from 'inversify';
import { QuoteDetailApiModel } from '../api/QuoteDetailApiModel';

@injectable()
export class QuoteRepository implements IQuoteRepository {
  constructor(@inject(SYMBOLS.Providers.ClientProvider) private clientProvider: IClientProvider<SupabaseClient>) {}

  /**
   * Génère un numéro de devis unique.
   */
  async generateQuoteNumber(): Promise<string> {
    console.log('QuoteRepository.generateQuoteNumber');
    
    const { count, error } = await this.clientProvider.getClient()
    .fromSchema<'quoting', 'quotes'>('quoting', 'quotes')
    .select('*', { count: 'exact', head: true }); // ⚡ Optimisé pour éviter un gros dataset

    console.log('count', count);
    
    if (error) throw new Error('Error generating quote number');

    const year = new Date().getFullYear().toString().slice(-2);
    const quoteNumber = `D${year}${(count! + 1).toString().padStart(5, '0')}`;
    
    return quoteNumber;
  }

  /**
   * Récupère tous les devis.
   */
  async getAll(): Promise<Quote[]> {
    const { data, error } = await this.clientProvider.getClient()
      .fromSchema<'quoting', 'quotes'>('quoting', 'quotes')
      .select('*')
      .returns<QuoteApiModel[]>();

    if (error) throw new Error('Error fetching quotes');

    return data.map(QuoteMapper.apiToDomain);
  }

  /**
   * Récupère tous les devis d'un utilisateur.
   */
  async getAllByUserId(userId: string): Promise<Quote[]> {
    const { data, error } = await this.clientProvider.getClient()
      .fromSchema<'quoting', 'quotes'>('quoting', 'quotes')
      .select('*')
      .eq('user_id', userId)
      .returns<QuoteApiModel[]>();

    if (error) throw new Error('Error fetching user quotes');

    return data.map(QuoteMapper.apiToDomain);
  }

  /**
   * Récupère un devis par ID.
   */
  async getById(id: string): Promise<Quote | null> {
    const { data, error } = await this.clientProvider.getClient()
      .fromSchema<'quoting', 'quotes'>('quoting', 'quotes')
      .select('*')
      .eq('id', id)
      .single<QuoteApiModel>();

    if (error) throw new Error('Error fetching quote');

    return data ? QuoteMapper.apiToDomain(data) : null;
  }

  async getDetails(quoteId: string): Promise<QuoteDetail[]> {
    const { data, error } = await this.clientProvider.getClient()
      .fromSchema<'quoting', 'quote_details'>('quoting', 'quote_details')
      .select('*')
      .eq('quote_id', quoteId)
      .returns<QuoteDetailApiModel[]>();
  
    if (error) throw new Error(`Error fetching quote details: ${error.message}`);
  
    return data.map(QuoteDetailMapper.apiToDomain);
  }
  

  /**
   * Crée un devis.
   */
  async create(quote: Quote): Promise<void> {
    const quoteApi = QuoteMapper.domainToApi(quote);

    const { error } = await this.clientProvider.getClient()
      .fromSchema<'quoting', 'quotes'>('quoting', 'quotes')
      .insert(quoteApi);

    if (error) throw new Error('Error creating quote');
  }

  /**
   * Met à jour un devis.
   */
  async update(quote: Quote): Promise<void> {
    const quoteApi = QuoteMapper.domainToApi(quote);

    if (!quoteApi.id) throw new Error('Quote ID is required');

    const { error } = await this.clientProvider.getClient()
      .fromSchema<'quoting', 'quotes'>('quoting', 'quotes')
      .update(quoteApi)
      .eq('id', quoteApi.id);

    if (error) throw new Error('Error updating quote');
  }

  /**
   * Supprime un devis.
   */
  async delete(id: string): Promise<void> {
    const { error } = await this.clientProvider.getClient()
      .fromSchema<'quoting', 'quotes'>('quoting', 'quotes')
      .delete()
      .eq('id', id);

    if (error) throw new Error('Error deleting quote');
  }

  async addLineItem(quoteId: string, lineItem: QuoteLineItem): Promise<void> {
    const lineApi: QuoteDetailApiModel = {
      id: crypto.randomUUID(),
      quote_id: quoteId,
      body_part_id: lineItem.bodyPartId,
      body_material_id: lineItem.bodyMaterialId,
      repair_type_id: lineItem.repairTypeId,
      impact_count_25: lineItem.impactCount25,
      impact_count_35: lineItem.impactCount35,
      stripping_percentage: lineItem.strippingPercentage,
      price: lineItem.price,
    };

    const { error } = await this.clientProvider.getClient()
      .fromSchema<'quoting', 'quote_details'>('quoting', 'quote_details')
      .insert(lineApi);

    if (error) throw new Error('Error adding quote detail');
  }

  async updateLineItem(quoteId: string, lineItem: QuoteLineItemDto): Promise<void> {
    const lineApi: QuoteDetailApiModel = {
      id: lineItem.id,
      quote_id: quoteId,
      body_part_id: lineItem.bodyPartId,
      body_material_id: lineItem.bodyMaterialId,
      repair_type_id: lineItem.repairTypeId,
      impact_count_25: lineItem.impactCount25,
      impact_count_35: lineItem.impactCount35,
      stripping_percentage: lineItem.strippingPercentage,
      price: lineItem.price,
    };

    const { error } = await this.clientProvider.getClient()
      .fromSchema<'quoting', 'quote_details'>('quoting', 'quote_details')
      .update(lineApi)
      .eq('id', lineApi.id);

    if (error) throw new Error('Error updating quote detail');
  }

  async updateStatus(quoteId: string, status: QuoteStatusDto): Promise<void> {
    const { error } = await this.clientProvider.getClient()
      .fromSchema<'quoting', 'quotes'>('quoting', 'quotes')
      .update({ status: status.status })
      .eq('id', quoteId);

    if (error) throw new Error('Error updating quote status');
  }
}
