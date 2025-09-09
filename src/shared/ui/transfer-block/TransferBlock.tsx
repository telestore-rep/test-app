import { Dispatch, FC, SetStateAction, useEffect, useState } from "react";
import styles from "./styles.module.scss";
import Button from "../button/Button";
import Text, { TextColor } from "../text/Text";
import Input from "../input/Input";
import cn from "classnames";
import { Layout } from "../../layouts/flex-layout/Layout";
import { useValidation } from "@/shared/hooks/useValidation";
import Switch from "../switch/Switch";

interface State {
  amount: string;
  id?: string | null;
  tag: string;
  partner_info?: string;
}

interface ITransferBlock {
  id?: string;
  loading?: boolean;
  title: string;
  titleBtn: string;
  fields: { label: string; placeholder: string; id: keyof State }[];
  color?: TextColor;
  transferFn: () => void;
  state: State;
  setState: (key: keyof State, value: string) => void;
  invoiceType?: boolean;
  setInvoiceType?: React.Dispatch<React.SetStateAction<boolean>>;
  testId?: string;
}

type FieldsType = [
  string | null,
  Dispatch<SetStateAction<string>>,
  ((value: string) => boolean) | undefined,
  string | undefined
];

export const TransferBlock = ({
  id = "",
  loading,
  title,
  titleBtn,
  color,
  fields,
  state,
  setState,
  transferFn,
  invoiceType,
  setInvoiceType,
  testId,
}: ITransferBlock) => {
  const { validateAmount, validateDescription, errors } = useValidation();
  const toggleSwitch = () => setInvoiceType?.(!invoiceType);

  const getFieldInfo = (fieldId: keyof State): FieldsType => {
    if (fieldId === "tag") {
      return [
        state.tag,
        (value: string) => setState("tag", value),
        (value: string) => validateDescription(value, "tag"),
        errors.tag,
      ];
    }
    if (fieldId === "amount") {
      return [
        state.amount,
        (value: string) => setState("amount", value),
        validateAmount,
        errors.amount,
      ];
    }
    if (fieldId === "partner_info") {
      return [
        state?.partner_info as any,
        (value: string) => setState("partner_info", value),
        (value: string) => validateDescription(value, "partner_info"),
        errors.partner_info,
      ];
    }
    return [
      state?.id as any,
      (value: string) => setState("id", value),
      undefined,
      undefined,
    ];
  };

  return (
    <div
      data-testid={testId}
      className={cn(styles.CreateCard, styles[`CreateCard-${color}`])}
    >
      <div className={styles.CreateCardTitle}>
        <Text size={12} weight="medium" color={color}>
          {title}
        </Text>
        {id === "INVOICE_BLOCK" && (
          <>
            <Text size={10} weight="medium" color={color}>
              Chose type
            </Text>
            <div className={styles.CreateCardSwitch}>
              <Text
                size={12}
                weight="medium"
                color={invoiceType ? "grey" : "dark"}
              >
                Internal invoice
              </Text>
              <Switch
                testId="transfer-switch"
                on={!!invoiceType}
                onSwitch={toggleSwitch}
              />
              <Text
                size={12}
                weight="medium"
                color={invoiceType ? "dark" : "grey"}
              >
                Acquiring invoice
              </Text>
            </div>
          </>
        )}
      </div>

      <div className={styles.CreateCardContainer}>
        {fields.map((field, index) => {
          const [value, setValue, validate, error] = getFieldInfo(field.id);
          return (
            <Layout align="middle-left" isWide key={index}>
              <Layout align="top-left" isWide>
                <Text weight="regular" size={12} color={color}>
                  {field.label}
                </Text>
              </Layout>
              <Layout align="top-left" isWide>
                <Input
                  testid={`${id}_${index}`}
                  value={value ?? ""}
                  setValue={setValue}
                  validate={validate}
                  error={error}
                  placeholder={field.placeholder}
                  color={color}
                />
              </Layout>
            </Layout>
          );
        })}
      </div>
      <Button
        isLoading={loading}
        size="md"
        onClick={transferFn}
        disabled={
          !state.amount.length ||
          !state.tag.length ||
          (state?.partner_info !== undefined && !state?.partner_info?.length
            ? true
            : false)
        }
      >
        {titleBtn}
      </Button>
    </div>
  );
};

export default TransferBlock;
