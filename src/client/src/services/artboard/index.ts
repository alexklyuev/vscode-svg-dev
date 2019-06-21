import { Artboard }  from './artboard';
import { ArtboardMove } from './artboard-move';
import { userEventMan } from '../user-event';

export const artboard = new Artboard();
export const artboardMove = new ArtboardMove(artboard, userEventMan);
