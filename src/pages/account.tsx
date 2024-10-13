import Split from "react-split";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator"
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { useEffect, useState } from "react";
import { Skeleton } from "@/components/ui/skeleton";
import { login, logout } from "../../lib/auth";

import Select from "@/components/select";
import List from "@/components/massagelist";
import Message from "@/components/massage";
import { useAuth } from "../../context/auth";

export default function Account() {
    const user = useAuth();
    const [waiting, setWaiting] = useState<boolean>(false);
    const [loading, setLoading] = useState<boolean>(true);
    const signIn = () => {
        setWaiting(true);

        login()
            .catch((error) => {
                console.error(error?.code);
            })
            .finally(() => {
                setWaiting(false);
            });
    };
    useEffect(() => {
        // Cross-Origin-Opener-Policyヘッダーを設定
        window.opener?.postMessage("Hello from the new window", "*");
        document.addEventListener("visibilitychange", () => {
            if (document.visibilityState === "hidden") {
                window.opener?.postMessage("Window closed", "*");
            }
        });
    }, []);
    function Loading() {
        return (
            <div className="w-fit m-auto">
                <p className="text-[3rem] text-center m-auto w-fit">Loading...</p>
            </div>
        );
    }

    return (
        <>
            {user ? (
                <>
                    <Split className="flex h-[100vh] border-2" gutterSize={0} sizes={[10, 90]}>
                        {/** 一つ目のコンポーネント */}
                        <Select />
                        {/** 二つ目のコンポーネント */}
                        <div className=" text-center w-fit">
                            <p className="text-[2rem] font-bold mt-[2rem]">アカウント情報</p>
                            <img className="rounded-full w-fit m-auto" src={user?.icon} alt="アイコン" />
                            <p className="font-bold mt-2">{user?.name}</p>
                            <div className="mt-5">
                                <p>{user?.instant}</p>
                            </div>
                            <div className="mt-5">
                                <p>{user?.message}</p>
                            </div>
                            <Button className="mt-[5rem]" onClick={logout}>ログアウト</Button>
                        </div>
                    </Split>
                </>
            ) : (<div>
                <Split className="flex h-[100vh] border-2" gutterSize={0} sizes={[10, 90]}>
                    {/** 一つ目のコンポーネント */}
                    <Select />
                    {/** 二つ目のコンポーネント */}
                    <div className=" text-center w-full">
                        <Button className="mt-[25rem]" onClick={signIn}>ログインまたはサインアップ</Button>
                    </div>
                </Split>

            </div>)}
        </>
    );
}