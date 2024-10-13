import { useAuth } from "../../context/auth";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Button } from "@/components/ui/button";
import { useEffect, useState } from "react";
import { collection, doc, getDocs, getDoc, getFirestore, query, where } from 'firebase/firestore';
import { inchat } from "./massage";

const List = () => {
    const user = useAuth();
    const [chatlist, Setchatlist] = useState<any>([]);
    const [userNames, setUserNames] = useState<any[]>([]); // 他のユーザー名を保存するステート
    const [loading, setLoading] = useState<boolean>(true);
    const db = getFirestore();
    const chatCollectionRef = collection(db, 'chat');
    const usersCollectionRef = collection(db, 'users');

    useEffect(() => {
        const fetchData = async () => {
            if (!user) return;

            try {
                setLoading(true); // ローディングを開始

                // `user.id` を含むチャットルームを取得
                const q = query(chatCollectionRef, where("userIds", "array-contains", user.id));
                const contentsSnapshot = await getDocs(q);

                if (!contentsSnapshot.empty) {
                    // チャットルームのデータを保存
                    const rooms = contentsSnapshot.docs.map(doc => doc.data());
                    Setchatlist(rooms);

                    // 他のユーザーのIDを取得
                    const otherUserIds = rooms.map(room => room.userIds.find((id: string) => id !== user.id));

                    // 他のユーザーIDに対応するユーザー名を取得
                    const userPromises = otherUserIds.map(async (otherUserId: string) => {
                        const userDoc = await getDoc(doc(usersCollectionRef, otherUserId));
                        return userDoc.exists() ? userDoc.data()?.name : "Unknown User"; // ユーザードキュメントが存在すれば名前を取得
                    });

                    // 取得したユーザー名をセット
                    const userNamesArray = await Promise.all(userPromises);
                    setUserNames(userNamesArray);

                } else {
                    setUserNames([]); // データがない場合は空の配列を設定
                }

            } catch (error) {
                console.error("データ取得中のエラー: ", error);
            } finally {
                setLoading(false); // ローディング終了
            }
        };

        fetchData();
    }, [user]);

    return (
        <div className="bg-[#000000] p-2 w-full">
            <p className="text-[30px] font-bold text-center mb-[5rem]">DM</p>
            {loading ? (
                <p className="text-white text-center">Loading...</p>
            ) : (
                <ScrollArea className="h-[83vh] w-full">
                    <div className="block w-full border-t-2">
                        {userNames.length > 0 ? (
                            chatlist.map((room: any, index: any) => (
                                <Button onClick={() => inchat(room, userNames[index])} key={room.id} className="w-full rounded-none border-b-2 h-[4rem] bg-black hover:bg-[#5d5d5d]">
                                    <div className="text-sm">
                                        {userNames[index]} {/* 他のユーザーの名前を表示 */}
                                    </div>
                                </Button>
                            ))
                        ) : (
                            <p className="text-white text-center">ユーザーが見つかりません</p>
                        )}
                    </div>
                </ScrollArea>
            )}
        </div>
    );
};

export default List;
