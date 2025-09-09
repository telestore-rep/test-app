import { FetchResponse, IAppData } from "@/app/types/types";
import { AppData } from "@/shared/ui/app-data/AppData";
import { FC, useState } from "react";

interface ListAppProps {}

export const ListApp: FC<ListAppProps> = () => {
  const [listAppProgress, setListAppProgress] = useState<IAppData[]>([]);

  const onLoadData = async () => {
    const response = await fetch(
      `https://dev.tele.store:8081/appauth/v1/list_app_user_data`,
      {
        credentials: "include",
        method: "GET",
        headers: { "content-type": "application/json" },
      }
    );

    if (!response.ok) {
      console.log("error with sending tokens");
      return;
    }

    const responseData: FetchResponse<IAppData[]> = await response.json();
    if (responseData.result) setListAppProgress(responseData.result);

    if (!responseData?.result?.[0]?.url) return;
  };

  const getListAppProgress = () => {
    if (!listAppProgress.length) return "";
    return listAppProgress
      .map((item, index) => {
        return (
          `Game ${index + 1}:\n` +
          Object.entries(item)
            .map(([key, value]) => `  ${key}: ${value}`)
            .join("\n")
        );
      })
      .join("\n\n");
  };

  return (
    <AppData
      testIdCard={"LOAD_PROGRESS_CARD"}
      testIdBtn={"LOAD_PROGRESS_BTN"}
      value={getListAppProgress()}
      nameBtn="Load progress"
      onChange={() => {}}
      title="Load App data"
      color="light"
      onSubmit={onLoadData}
      height="210px"
    />
  );
};
