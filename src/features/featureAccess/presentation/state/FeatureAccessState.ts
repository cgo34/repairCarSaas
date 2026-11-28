import { ref, shallowRef } from 'vue'
import type { IGetFeatureAccessUseCase } from '@/features/featureAccess/application/useCases/GetFeatureAccessUseCase'
import { OrganizationFeatures } from '@/features/featureAccess/domain/entities/OrganizationFeatures'
import type { IFeatureAccessState } from '@/features/featureAccess/presentation/state/IFeatureAccessState'

export class FeatureAccessState implements IFeatureAccessState {
  public features = shallowRef<OrganizationFeatures>(OrganizationFeatures.empty())
  public isLoading = ref(false)

  private loadedOrganizationId: string | null = null
  private pending: { organizationId: string; promise: Promise<void> } | null = null
  private requestSeq = 0

  constructor(private readonly getFeatureAccess: IGetFeatureAccessUseCase) {}

  async ensureLoaded(organizationId: string): Promise<void> {
    if (this.loadedOrganizationId === organizationId) return
    if (this.pending?.organizationId === organizationId) return this.pending.promise
    return this.load(organizationId)
  }

  async refresh(organizationId: string): Promise<void> {
    return this.load(organizationId)
  }

  reset(): void {
    this.requestSeq++
    this.pending = null
    this.isLoading.value = false
    this.loadedOrganizationId = null
    this.features.value = OrganizationFeatures.empty()
  }

  private load(organizationId: string): Promise<void> {
    const seq = ++this.requestSeq
    this.isLoading.value = true

    const promise = (async () => {
      try {
        const features = await this.getFeatureAccess.execute(organizationId)
        if (seq !== this.requestSeq) return
        this.features.value = features
        this.loadedOrganizationId = organizationId
      } catch (error) {
        if (seq !== this.requestSeq) return
        // Default deny: no feature granted if the lookup fails
        console.error('[FeatureAccessState] load failed:', error)
        this.features.value = OrganizationFeatures.empty()
        this.loadedOrganizationId = null
      } finally {
        if (seq === this.requestSeq) {
          this.isLoading.value = false
          this.pending = null
        }
      }
    })()

    this.pending = { organizationId, promise }
    return promise
  }
}
