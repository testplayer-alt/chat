import { useAuth } from "../../context/auth";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Button } from "@/components/ui/button";
import { useEffect, useState } from "react";
import { collection, doc, getDoc, getFirestore, query, where, onSnapshot } from 'firebase/firestore'; // onSnapshotをインポート
import { inchat } from "./massage";

const List = () => {
    const user = useAuth();
    const [sortedChatData, setSortedChatData] = useState<any[]>([]);
    const [loading, setLoading] = useState<boolean>(true);
    const db = getFirestore();
    const chatCollectionRef = collection(db, 'chat');
    const usersCollectionRef = collection(db, 'users');

    useEffect(() => {
        if (!user) return;

        setLoading(true); // ローディングを開始

        // 現在のユーザーIDを含むチャットルームをリアルタイムで取得
        const q = query(chatCollectionRef, where("userIds", "array-contains", user.id));

        const unsubscribe = onSnapshot(q, async (contentsSnapshot) => {
            if (!contentsSnapshot.empty) {
                const rooms = contentsSnapshot.docs.map(doc => doc.data());

                const otherUserIds = rooms.map(room => {
                    return room.userIds.find((id: string) => id !== user.id);
                });

                const userPromises = otherUserIds.map(async (otherUserId: string) => {
                    const userDoc = await getDoc(doc(usersCollectionRef, otherUserId));
                    return userDoc.exists() ? userDoc.data()?.name : "Unknown User";
                });

                const userNamesArray = await Promise.all(userPromises);

                // チャットルームを最後のメッセージのタイムスタンプで並び替え
                const sortedData = rooms
                    .map((room, index) => {
                        const lastMessage = room.talk && room.talk.length > 0 ? room.talk[room.talk.length - 1] : null;
                        const lastMessageTime = lastMessage && lastMessage.timestamp && lastMessage.timestamp.seconds
                            ? new Date(lastMessage.timestamp.seconds * 1000)
                            : new Date(0);

                        return {
                            room,
                            userName: userNamesArray[index],
                            lastMessageTime
                        };
                    })
                    .sort((a, b) => b.lastMessageTime.getTime() - a.lastMessageTime.getTime());

                setSortedChatData(sortedData); // 並べ替えたデータをステートに保存
            } else {
                setSortedChatData([]); // データがない場合は空の配列を設定
            }

            setLoading(false); // ローディングを終了
        });

        // コンポーネントのアンマウント時にリアルタイムリスナーを解除
        return () => unsubscribe();
    }, [user, db]);

    return (
        <div className="bg-[#000000] p-2 w-full">
            <p className="text-[30px] font-bold text-center mb-[5rem]">DM</p>
            {loading ? (
                <p className="text-white text-center">Loading...</p>
            ) : (
                <ScrollArea className="h-[83vh] w-full">
                    <div className="block w-full border-t-2">
                        {sortedChatData.length > 0 ? (
                            sortedChatData.map(({ room, userName }, index) => (
                                <Button
                                    onClick={() => inchat(room, userName)} // room と userName を正しく渡す
                                    key={room.roomname}
                                    className="w-full rounded-none border-b-2 h-[4rem] bg-black hover:bg-[#5d5d5d]">
                                    <div className="text-sm">
                                        {userName} {/* 他のユーザーの名前を表示 */}
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
