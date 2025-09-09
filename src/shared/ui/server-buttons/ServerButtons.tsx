import { ServerContext } from "@/providers/ServerProvider";
import Button from "../button/Button";
import React, { useContext } from "react";

type ServerButtonsProps = {
  loading?: boolean;
  onConnectTeleStore: () => void;
  setLoading: (val:boolean) => void;
};

const ServerButtons: React.FC<ServerButtonsProps> = ({
  onConnectTeleStore,
  setLoading,
  loading,
}) => {
  const {setError} = useContext(ServerContext)

  const connectSse = async () => {
    if (loading) return;

    setLoading(true);

    try {
      await fetch("./api/connect_sse", {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      });
    } catch (error) {
      setError("SSE Connection error", error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <Button testId={"CONNECT_TELE"} color="dark" onClick={onConnectTeleStore} disabled={loading}>
        Connect to TeleStore
      </Button>
      <Button testId={"CONNECT_SSE"} color="dark" onClick={connectSse} disabled={loading}>
        Connect SSE
      </Button>
    </>
  )
}

export default ServerButtons; 