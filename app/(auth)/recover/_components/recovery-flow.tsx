'use client';

import { useState } from 'react';

import ForgotPasswordForm from './forgot-form';
import ChangePasswordForm from './password-form';
import VerifyForm from './verify-form';

export default function RecoveryFlow() {
  const [step, setStep] = useState(1);
  const [email, setEmail] = useState('');
  const [code, setPin] = useState('');

  const handleForgott = (email: string) => {
    setEmail(email);
    setStep(2);
  };

  const handleVerify = (code: string) => {
    setPin(code);
    setStep(3);
  };

  if (step === 1)
    return <ForgotPasswordForm handleFlowChange={handleForgott} />;
  if (step === 2)
    return <VerifyForm email={email} handleFlowChange={handleVerify} />;
  return <ChangePasswordForm email={email} code={code} />;
}
