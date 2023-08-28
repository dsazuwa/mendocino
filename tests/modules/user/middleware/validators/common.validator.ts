import { AnyZodObject, ZodEffects } from 'zod';

export const testOTPRules = (schema: AnyZodObject, b?: object, p?: object) => {
  const getData = (otp: string | number) => ({
    params: { ...p, otp },
    body: { ...b },
  });

  it('should pass for valid otp', () => {
    expect(() => schema.parse(getData('1234'))).not.toThrow();
  });

  it('should throw error for invalid otp', () => {
    const otps: string[] = ['nonNumeric', '1234w', '', ' '];

    otps.forEach((otp) => {
      expect(() => schema.parse(getData(otp))).toThrow();
    });
  });
};

export const testPasswordRules = (
  schema: AnyZodObject | ZodEffects<AnyZodObject>,
  b?: object,
  p?: object,
) => {
  it('should throw error for invalid password', () => {
    const passwords: string[] = [
      '',
      ' ',
      'alllowercase',
      'ALLUPPERCASE',
      '122345567',
      'noNumbers',
      'small',
      'tooLarge-----------------------------------------------------------------',
    ];

    passwords.forEach((password) => {
      const data = { params: p, body: { ...b, password } };
      expect(() => schema.parse(data)).toThrow();
    });
  });
};

export const testEmailRules = (
  schema: AnyZodObject,
  b?: object,
  p?: object,
) => {
  it('should throw error for invalid email', () => {
    const emails: string[] = ['joedoe', '', ' ', 'joedoe.com'];

    emails.forEach((email) => {
      const data = { params: p, body: { ...b, email } };
      expect(() => schema.parse(data)).toThrow();
    });
  });
};

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
