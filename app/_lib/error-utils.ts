import { SerializedError } from '@reduxjs/toolkit';
import { FetchBaseQueryError } from '@reduxjs/toolkit/query';

export const getErrorMessage = (
  error: FetchBaseQueryError | SerializedError | undefined,
) => {
  if (error === undefined) return '';

  let message = '';
  if ('status' in error) {
    message =
      'error' in error
        ? error.error
        : (error.data as { message: string }).message;
  } else {
    message = error.message ?? '';
  }

  return message;
};
