import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
    Popover,
    PopoverContent,
    PopoverTrigger,
} from "@/components/ui/popover";
import { Textarea } from "@/components/ui/textarea";
import { useEffect, useRef, useState } from "react";
import Split from "react-split";
import { login, logout } from "../../lib/auth";

import Select from "@/components/select";
import { doc, getFirestore, updateDoc } from "firebase/firestore";
import { useAuth } from "../../context/auth";

export default function Account() {
    const user = useAuth();
    const cheatRef = useRef<HTMLTextAreaElement>(null);
    const [waiting, setWaiting] = useState<boolean>(false);
    const [loading, setLoading] = useState<boolean>(true);
    const db = getFirestore();
    const [username, setusername] = useState<string>("");
    const [usercomment, setusercomment] = useState<string>("");
    const [userchat, setuserchat] = useState<any>("");

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
    useEffect(() => {
        if (!user) return;
        setusername(user.name);
        setusercomment(user.instant);
        setuserchat(user.message);
    }, [user]);

    async function Changeinfo(params: number) {
        switch (params) {
            case 0:
                const name = document.getElementById('name') as HTMLInputElement;
                if (name.value.trim() !== "") {
                    console.log(name.value);
                    if (user?.id) {
                        await updateDoc(doc(db, "users", user.id), { name: name.value });
                        // 変更後に状態を更新
                        setusername(name.value); // setusernameで状態を更新する
                    }
                }
                break;
            case 1:
                const comment = document.getElementById('comment') as HTMLInputElement;
                if (comment.value.trim() !== "") {
                    console.log(comment.value);
                    if (user?.id) {
                        setusercomment(comment.value);
                        await updateDoc(doc(db, "users", user.id), { instant: comment.value });
                        // setusercommentでリアルタイムに更新
                    }
                }
                break;
            case 2:
                if (cheatRef.current?.value.trim() !== "") {
                    console.log(cheatRef.current?.value);
                    if (user?.id) {
                        setuserchat(cheatRef.current?.value);
                        await updateDoc(doc(db, "users", user.id), { message: cheatRef.current?.value });
                        // setuserchatでリアルタイムに更新
                    }
                }
                break;

            default:
                break;
        }
    }

    return (
        <>
            {user ? (
                <>
                    <Split className="flex h-[100vh] border-2" gutterSize={0} sizes={[10, 90]}>
                        {/** 一つ目のコンポーネント */}
                        <Select />
                        {/** 二つ目のコンポーネント */}
                        <div className="p-6 px-16">
                            <p className="text-[2rem] font-bold">アカウント情報</p>
                            <img className="rounded-full my-4" src={user?.icon} alt="アイコン" />
                            <div className="border-y-2 py-4">
                                <div className="flex">
                                    <p className="text-[1.2rem] font-bold">名前:</p>
                                    <p className="mb-4 pt-[3px]">{username}</p>
                                </div>
                                <Popover>
                                    <PopoverTrigger asChild>
                                        <Button className="bg-[#000] w-fit border-2">名前の変更</Button>
                                    </PopoverTrigger>
                                    <PopoverContent className="w-fit bg-black h-fit">
                                        <div className="body w-fit">
                                            <div className="contents m-auto text-black w-fit">
                                                <div className="rounded-none m-auto w-fit">
                                                    <div className="text-center w-fit">
                                                        <Input className="text-[#d2d2d2]" type="text" placeholder="名前を入力" id="name" />
                                                        <Button className="mt-3 border-2 border-[#818181]" id="inputs" onClick={() => { Changeinfo(0) }
                                                        }>送信</Button>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </PopoverContent>
                                </Popover>
                            </div>
                            <div className="mt-5 border-y-2 py-4">
                                <div className="flex">
                                    <p className="text-[1.2rem] font-bold">ひとこと:</p>
                                    <p className="pt-[3px]">{usercomment}</p>
                                </div>
                                <p className="text-[0.6rem] mb-4 text-[#939393]">「マッチング」にて他ユーザーに表示されます</p>
                                <Popover>
                                    <PopoverTrigger asChild>
                                        <Button className="bg-[#000] w-fit border-2">ひとことの変更</Button>
                                    </PopoverTrigger>
                                    <PopoverContent className="w-fit bg-black h-fit">
                                        <div className="body w-fit">
                                            <div className="contents m-auto text-black w-fit">
                                                <div className="rounded-none m-auto w-fit">
                                                    <div className="text-center w-fit">
                                                        <Input className="text-[#d2d2d2]" type="text" placeholder="ひとことを入力" id="comment" />
                                                        <Button className="mt-3 border-2 border-[#818181]" id="inputs" onClick={() => { Changeinfo(1) }
                                                        }>送信</Button>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </PopoverContent>
                                </Popover>
                            </div>
                            <div className="mt-5 border-y-2 py-4">
                                <div className="flex">
                                    <p className="text-[1.2rem] font-bold">定型文:</p>
                                    <p className="pt-[3px]">{userchat}</p>
                                </div>
                                <p className="text-[0.6rem] mb-4 text-[#939393]">他ユーザーに初めてメッセージを送信する際、この文章が送られます</p>
                                <Popover>
                                    <PopoverTrigger asChild>
                                        <Button className="bg-[#000] w-fit border-2">定型分の変更</Button>
                                    </PopoverTrigger>
                                    <PopoverContent className="w-fit bg-black h-fit">
                                        <div className="body w-fit">
                                            <div className="contents m-auto text-black w-fit">
                                                <div className="rounded-none m-auto w-fit">
                                                    <div className="text-center w-fit">
                                                        <Textarea className="text-[#d2d2d2]" ref={cheatRef} placeholder="定型分を入力" id="sendtext" />
                                                        <Button className="mt-3 border-2 border-[#818181]" id="inputs" onClick={() => { Changeinfo(2) }
                                                        }>送信</Button>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </PopoverContent>
                                </Popover>
                            </div>
                            <Button className="mt-[2rem] border-2 border-[#555555]" onClick={logout}>ログアウト</Button>
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