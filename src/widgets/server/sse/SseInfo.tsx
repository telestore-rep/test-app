import { ServerContext } from '@/providers/ServerProvider';
import Button from '@/shared/ui/button/Button'
import { InfoCard } from '@/shared/ui/info-card/InfoCard'
import {FC, useContext, useState} from 'react'

interface SseInfoProps {
    loading?: boolean;
    setLoading: (val:boolean) => void;
}

export const SseInfo:FC<SseInfoProps> = ({loading, setLoading}) => {
    const {sseEvents, setError} = useContext(ServerContext)

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
            <InfoCard
                testId={"SSE"}
                value={sseEvents.join("\n")}
                title="SSE (Server side events)"
                color="dark"
            />
            <Button testId={"CONNECT_SSE"} color="dark" onClick={connectSse}>
                Connect SSE
            </Button>
        </>
    )
}