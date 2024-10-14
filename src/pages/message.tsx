import { useEffect } from "react";
import Split from "react-split";

import Message from "@/components/massage";
import List from "@/components/massagelist";
import Select from "@/components/select";

export default function App() {
    useEffect(() => {
        // Cross-Origin-Opener-Policyヘッダーを設定
        window.opener?.postMessage("Hello from the new window", "*");
        document.addEventListener("visibilitychange", () => {
            if (document.visibilityState === "hidden") {
                window.opener?.postMessage("Window closed", "*");
            }
        });
    }, []);

    return (
        <Split className="flex h-[100vh] border-2" gutterSize={0} sizes={[10, 25, 65]}>
            {/** 一つ目のコンポーネント */}
            <Select />
            {/** 二つ目のコンポーネント */}
            <List />
            {/** 三つ目のコンポーネント */}
            <Message />
        </Split>
    );
}