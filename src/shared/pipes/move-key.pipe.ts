import { Pipe } from "../services/pipe/pipe";

export type MoveArrowKeys = 'left' | 'up' | 'right' | 'down';

export type MoveKeyRequest = {
  key: MoveArrowKeys;
  shift: boolean;
};
export const moveKeyPipe = new Pipe<MoveKeyRequest, {}, 'move-key'>('move-key');
