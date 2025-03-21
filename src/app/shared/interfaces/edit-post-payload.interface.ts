import { CreatePostPayload } from './create-post-payload.interface';

export interface EditPostPayload extends Partial<CreatePostPayload> {}
