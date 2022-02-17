import { validateOrReject } from 'class-validator';

/**
 * @description Validates email data
 * @export
 * @template T
 * @param {object} data
 * @param {T} Model
 * @returns {Promise<void>}
 */
export function validateEmailTemplateData<
  T extends { new (...args: any[]): any },
>(data: any, Model: T): Promise<void> {
  const model = new Model();
  Object.assign(model, data);
  return validateOrReject(model);
}
