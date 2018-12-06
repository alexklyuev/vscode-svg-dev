import { Pipe } from "../services/pipe/pipe";

/**
 * Host logger
 */
export type LoggerRequest = {[K in 'log' | 'warn' | 'error']?: string};
export const loggerPipe = new Pipe<LoggerRequest, {}, 'hostLogger'>('hostLogger');
