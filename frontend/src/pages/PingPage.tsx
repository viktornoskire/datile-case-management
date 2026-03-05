import { usePing } from "../hooks/usePing.tsx";

export default function PingPage() {
    const {data, error} = usePing();

    if (error) return <div>{error}</div>;
    return <pre>{data}</pre>;
}