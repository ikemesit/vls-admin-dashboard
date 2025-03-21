import { CreateEventPayload } from './create-event-payload.interface';

export interface EditEventPayload extends Partial<CreateEventPayload> {}
