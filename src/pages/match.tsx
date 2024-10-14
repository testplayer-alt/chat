import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { collection, doc, getDoc, getDocs, getFirestore, query, setDoc, where } from 'firebase/firestore';
import { useEffect, useState } from "react";
import Split from "react-split";
import { User } from "../../types/user";



import Select from "@/components/select";
import { useRouter } from "next/router";
import { useAuth } from "../../context/auth";

export default function Match() {

    const [userlist, Setuserlist] = useState<any>([]);
    const router = useRouter();
    const db = getFirestore();
    const userCollectionRef = collection(db, 'users');
    const user = useAuth();
    const [loading, setLoading] = useState<boolean>(true);


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
        const fetchData = async () => {
            if (!user) return;
            const contentsQuery = query(userCollectionRef, where("id", "!=", user.id));
            const contentsSnapshot = await getDocs(contentsQuery);
            if (!contentsSnapshot.empty) { // データが存在するか確認
                Setuserlist(contentsSnapshot.docs.map(doc => doc.data())); // すべてのユーザーを取得
            } else {
                Setuserlist([]); // データがない場合は空の配列を設定
            }
            try {
                setLoading(true); // Start loading

            } catch (error) {
                console.error("Error fetching data: ", error);
            } finally {
                setLoading(false); // Stop loading
            }
        };
        fetchData();

    }, [user]);
    function Loading() {
        return (
            <div className="w-fit m-auto">
                <p className="text-[3rem] text-center m-auto w-fit">Loading...</p>
            </div>
        );
    }

    async function CreateRoom(params: string) {
        const alphabet = "abcdefghijklmnopqrstuvwxyz"
        const b = params.split('').map((str) => alphabet.indexOf(str) + 1)
        const c = user?.id.split('').map((str) => alphabet.indexOf(str) + 1)

        const result = b.join('').replace(/^0+/, '');
        const result2 = c!.join('').replace(/^0+/, '');

        console.log(result);
        console.log(result2);

        const chatref = collection(db, "chat");

        if (result > result2) {
            console.log("相手の方が大きい");
            console.log(result + result2);
            const roomname = params + "_" + user?.id;
            try {
                const data = await getDoc(doc(chatref, roomname));
                if (data.exists()) { // データが存在するか確認
                    console.log("ルームデータ: ", data.data());
                } else {
                    console.log("ルームを作成");
                    // ルーム作成
                    await setDoc(doc(chatref, roomname), {
                        talk: [{
                            id: user?.id,
                            message: user?.message,
                            timestamp: new Date(), // タイムスタンプを追加
                        }], // talk配列に要素を追加
                        roomname: roomname, // ルーム名をデータとして保存
                        userIds: [user?.id, params] // 関連ユーザーのIDを保存
                    });
                }
            } catch (error) {
                console.log("ルーム作成に失敗: ", error);
            }
        } else {
            console.log("自分の方が大きい");
            const roomname = user?.id + "_" + params;
            try {
                const data = await getDoc(doc(chatref, roomname));
                if (data.exists()) { // データが存在するか確認
                    console.log("ルームデータ: ", data.data());
                } else {
                    console.log("ルームを作成");
                    // ルーム作成
                    await setDoc(doc(chatref, roomname), {
                        talk: [{
                            id: user?.id,
                            message: user?.message,
                            timestamp: new Date(), // タイムスタンプを追加
                        }], // talk配列に要素を追加
                        roomname: roomname, // ルーム名をデータとして保存
                        userIds: [user?.id, params] // 関連ユーザーのIDを保存
                    });
                }
            } catch (error) {
                console.log("ルーム作成に失敗: ", error);
            }
        }
    }
    return (
        <>
            {loading ? (
                <Loading />
            ) : user ? (
                <Split className="flex h-[100vh] border-2" gutterSize={0} sizes={[10, 90]}>
                    {/** 一つ目のコンポーネント */}
                    <Select />
                    {/** 二つ目のコンポーネント */}
                    <div>
                        <p className="text-[1.5rem] text-center font-bold mt-2 border-b-2 ">最近ログインしたユーザー</p>
                        <ScrollArea className="h-[83vh] w-full">
                            <div className="block w-full mt-2">
                                {userlist.map((user: User) => (
                                    <div className=" text-center flex w-[30rem] m-auto p-2 border-2 mb-1">
                                        <img className="rounded-full w-[3.5rem] h-auto" src={user.icon} alt="アイコン" />
                                        <div className="block mt-[0.2rem]">
                                            <p className=" font-bold">{user.name}</p>
                                            <p className="text-[#d6d6d6]">{user.instant}</p>
                                        </div>
                                        <Button onClick={() => CreateRoom(user.id)} className="border-2 border-[#6f6f6f] ml-auto mr-0 mt-[0.5rem]">メッセージを送信</Button>
                                    </div>
                                ))}
                            </div>
                        </ScrollArea>

                    </div>
                </Split>
            ) : (window.location.href = "/")}
        </>
    );
}