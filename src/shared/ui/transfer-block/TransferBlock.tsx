import { Dispatch, FC, SetStateAction } from "react";
import styles from "./styles.module.scss";
import Button from "../button/Button";
import Text, { TextColor } from "../text/Text";
import Input from "../input/Input";
import cn from "classnames";
import { Layout } from "../../layouts/flex-layout/Layout";
import { useValidation } from "@/shared/hooks/useValidation";

interface State {
  amount: string;
  id: string | null;
  tag: string;
}

interface ITransferBlock {
  loading?: boolean;
  title: string;
  titleBtn: string;
  fields: { label: string; placeholder: string; id: keyof State }[];
  color?: TextColor;
  transferFn: () => void;
  state: State;
  setState: (key: keyof State, value: string) => void;
}

type FieldsType = [
  string | null,
  Dispatch<SetStateAction<string>>,
  ((value: string) => boolean) | undefined,
  string | undefined
];

export const TransferBlock = ({
  loading,
  title,
  titleBtn,
  color,
  fields,
  setState,
  state,
  transferFn,
}: ITransferBlock) => {
  const { validateAmount, validateDescription, errors } = useValidation();
  const getFieldInfo = (fieldId: keyof State): FieldsType => {
    if (fieldId === "tag") {
      return [
        state.tag,
        (value: string) => setState("tag", value),
        validateDescription,
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
    return [
      state.id,
      (value: string) => setState("id", value),
      undefined,
      undefined,
    ];
  };

  return (
    <div className={cn(styles.CreateCard, styles[`CreateCard-${color}`])}>
      <Text size={12} weight="medium" color={color}>
        {title}
      </Text>
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
        disabled={!state.amount.length || !state.tag.length}
      >
        {titleBtn}
      </Button>
    </div>
  );
};

export default TransferBlock;
