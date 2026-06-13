export const PIN_LENGTH = 4;

export const PIN_DIGIT_ROWS = [
  ['1', '2', '3'],
  ['4', '5', '6'],
  ['7', '8', '9'],
];

export type PinCodeStep = 'verify' | 'create' | 'confirm' | 'biometric' | 'done';
