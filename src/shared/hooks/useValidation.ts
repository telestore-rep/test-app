import { useState } from "react";

const amountRegex = /^[0-9]*$/;
const descriptionRegex = /^[\p{L}0-9\s.,!?()@#$%^&*+=_-]+$/u;

export const useValidation = () => {
  const [errors, setErrors] = useState<{
    amount?: string;
    tag?: string;
  }>({});

  const validateAmount = (value: string) => {
    if (!amountRegex.test(value)) {
      setErrors((prev) => ({ ...prev, amount: "Please use only numbers." }));
      return false;
    }
    setErrors((prev) => ({ ...prev, amount: undefined }));
    return true;
  };

  const validateDescription = (value: string) => {
    if (!descriptionRegex.test(value)) {
      setErrors((prev) => ({
        ...prev,
        tag: "Please use only numbers and letters.",
      }));
      return false;
    }
    setErrors((prev) => ({ ...prev, tag: undefined }));
    return true;
  };

  return { errors, validateAmount, validateDescription };
};

//
