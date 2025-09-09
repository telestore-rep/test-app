import { useState } from "react";

const amountRegex = /^[0-9]*$/;
const descriptionRegex = /^[A-Za-z0-9\s.,!?()@#$%^&*+=_\-|\/"'~`]+$/;

export const useValidation = () => {
  const [errors, setErrors] = useState<{
    amount?: string;
    tag?: string;
    partner_info?: string;
  }>({});

  const validateAmount = (value: string) => {
    if (!amountRegex.test(value)) {
      setErrors((prev) => ({ ...prev, amount: "Please use only numbers." }));
      return false;
    }
    setErrors((prev) => ({ ...prev, amount: undefined }));
    return true;
  };

  const validateDescription = (
    value: string,
    field: "tag" | "partner_info"
  ) => {
    if (!descriptionRegex.test(value)) {
      setErrors((prev) => ({
        ...prev,
        [field]: "Please use only numbers and Latin letters.",
      }));
      return false;
    }
    setErrors((prev) => ({ ...prev, [field]: undefined }));
    return true;
  };

  return { errors, validateAmount, validateDescription };
};
