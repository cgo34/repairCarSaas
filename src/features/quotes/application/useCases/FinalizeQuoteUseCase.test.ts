import { describe, expect, it, vi } from 'vitest';
import { FinalizeQuoteUseCase } from '@/features/quotes/application/useCases/FinalizeQuoteUseCase';
import { EMPTY_QUOTE_ERROR } from '@/features/quotes/application/useCases/SendQuoteUseCase';

const pendingStatus = { id: 'status-pending', code: 'pending' };

function build(view: { quote: unknown; lines: unknown[] | undefined }) {
  const viewQuote = { execute: vi.fn().mockResolvedValue(view) };
  const repository = { markAsSent: vi.fn(), updateStatus: vi.fn() };
  const getStatus = { getByCode: vi.fn().mockResolvedValue(pendingStatus) };
  const useCase = new FinalizeQuoteUseCase(viewQuote as never, repository as never, getStatus as never);
  return { useCase, repository, getStatus };
}

describe('FinalizeQuoteUseCase', () => {
  it('marks a quote with lines as sent and moves it to pending', async () => {
    const { useCase, repository } = build({ quote: { isForfait: false }, lines: [{}] });

    const status = await useCase.execute('q1');

    expect(repository.markAsSent).toHaveBeenCalledWith('q1');
    expect(repository.updateStatus).toHaveBeenCalledWith('q1', 'status-pending');
    expect(status).toBe(pendingStatus);
  });

  it('accepts a forfait quote with a positive amount and no lines', async () => {
    const { useCase, repository } = build({ quote: { isForfait: true, forfaitAmount: 150 }, lines: [] });

    await useCase.execute('q1');

    expect(repository.markAsSent).toHaveBeenCalledWith('q1');
  });

  it('rejects an empty quote without touching the repository', async () => {
    const { useCase, repository } = build({ quote: { isForfait: false }, lines: [] });

    await expect(useCase.execute('q1')).rejects.toThrow(EMPTY_QUOTE_ERROR);
    expect(repository.markAsSent).not.toHaveBeenCalled();
  });

  it('rejects a forfait quote with a zero amount', async () => {
    const { useCase } = build({ quote: { isForfait: true, forfaitAmount: 0 }, lines: [] });

    await expect(useCase.execute('q1')).rejects.toThrow(EMPTY_QUOTE_ERROR);
  });

  it('throws when the quote cannot be found', async () => {
    const { useCase } = build({ quote: undefined, lines: undefined });

    await expect(useCase.execute('q1')).rejects.toThrow('Quote or quote details not found');
  });
});
