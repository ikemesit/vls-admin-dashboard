import { CreateCampaignPayload } from './create-campaign-payload.interface';

export interface EditCampaignPayload extends Partial<CreateCampaignPayload> {}
