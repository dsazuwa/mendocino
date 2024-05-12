import { AnyZodObject } from 'zod';

export const testIdRules = (schema: AnyZodObject, b?: object, p?: object) => {
  const getData = (id: string | number) => ({
    params: { ...p, id },
    body: { ...b },
  });

  it('should pass for valid id', () => {
    const ids: string[] = ['1234', ' 1234', '1234 '];

    ids.forEach((id) => {
      expect(() => schema.parse(getData(id))).not.toThrow();
    });
  });

  it('should throw error for invalid id', () => {
    const ids: string[] = ['nonNumeric', '1234w', '', ' ', '12 34'];

    ids.forEach((id) => {
      expect(() => schema.parse(getData(id))).toThrow();
    });
  });
};
