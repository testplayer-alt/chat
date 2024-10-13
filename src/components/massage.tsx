import Split from "react-split";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { useEffect, useState } from "react";
import { collection, doc, getFirestore, onSnapshot } from 'firebase/firestore'; // onSnapshotをインポート
import { useAuth } from "../../context/auth";
import { updateDoc, arrayUnion } from 'firebase/firestore';

let settalk: any; // 外部で使用するために定義
let setroomname: any;
let setusername: any;

export const inchat = (room: any, username: any) => {
    console.log(room.talk);
    if (settalk) {
        settalk(room.talk); // 選択されたチャットルームの `talk` データをセット
    }
    if (setroomname) {
        setroomname(room.roomname);
    }
    if (setusername) {
        setusername(username);
    }
};

export default function Message() {
    const [talk, settalkState] = useState<any[]>([]); // `talk` データの state
    const [username, Setusername] = useState<any>();
    const [roomname, Setroomname] = useState<any>();
    const [loading, setLoading] = useState<boolean>(true);
    const db = getFirestore();
    const user = useAuth(); // 現在ログインしているユーザー情報を取得

    useEffect(() => {
        settalk = settalkState;
        setusername = Setusername;
        setroomname = Setroomname;

        if (roomname) {
            // チャットルームのデータをリアルタイムでリスン
            const roomRef = doc(db, 'chat', roomname);

            const unsubscribe = onSnapshot(roomRef, (doc) => {
                if (doc.exists()) {
                    const roomData = doc.data();
                    if (roomData && roomData.talk) {
                        settalkState(roomData.talk); // talkデータを更新
                    }
                } else {
                    console.log("No such document!");
                }
            });

            // クリーンアップ関数でリスナーを解除
            return () => unsubscribe();
        }
    }, [roomname, db]);

    // メッセージを送信する関数
    async function SendMessage() {
        const messageInput = document.getElementById('textarea') as HTMLInputElement;
        const newMessage = messageInput.value;

        if (newMessage.trim() !== "") {
            // 新しいメッセージを配列の末尾に追加
            const newTalkEntry = {
                id: user?.id, // ユーザーID
                message: newMessage,
                timestamp: new Date(), // タイムスタンプを追加
            };

            settalkState((prevTalk) => [...prevTalk, newTalkEntry]);
            messageInput.value = "";

            try {
                // Firestore のチャットルームドキュメントを更新
                const roomRef = doc(db, 'chat', roomname); // roomIdは対象チャットルームのID
                await updateDoc(roomRef, {
                    talk: arrayUnion(newTalkEntry) // Firestoreのtalk配列にメッセージを追加
                });

                console.log("Message sent and updated in Firestore.");
            } catch (error) {
                console.error("Error updating Firestore: ", error);
            }
        }
    }

    return (
        <div className="bg-[#000000] border-l-2 w-full">
            <div className="border-b-2 mb-3 p-2 h-[6.5vh]">
                <p className="text-[1.5rem] font-bold">{username}</p>
            </div>
            <ScrollArea className="h-[80vh] w-full p-2">
                {talk.length > 0 ? (
                    <div className="block w-full">
                        {talk.map((message, index) => (
                            <div key={index}>
                                {/* メッセージが自分のものではない場合 */}
                                {message.id !== user?.id ? (
                                    <div className="bg-[#2a2a2a] w-fit text-[#dedede] p-1 px-3 rounded-r-xl rounded-t-xl mb-2 border-2 border-[#868686]">
                                        {message.message}
                                    </div>
                                ) : (
                                    /* メッセージが自分のものである場合 */
                                    <div className="bg-[#5a5a5a] w-fit text-[#dedede] p-1 px-3 rounded-l-xl rounded-t-xl mb-2 border-2 border-[#868686] ml-auto mr-0">
                                        {message.message}
                                    </div>
                                )}
                            </div>
                        ))}
                    </div>
                ) : (
                    <div className="block w-full">
                        <p className="text-white text-center">メッセージがありません</p>
                    </div>
                )}
            </ScrollArea>
            {talk.length > 0 ? (
                <div className="border-t-2 h-[12vh] flex">
                    <Textarea id="textarea" className="border-r-2 w-[80%] h-[11.4vh] rounded-none resize-none text-[1.3rem]" placeholder="メッセージを入力..."></Textarea>
                    <Button onClick={() => SendMessage()} className="bg-black hover:bg-[#5d5d5d] w-[7vw] h-[11.4vh]">
                        <svg role="img" xmlns="http://www.w3.org/2000/svg" width="48px" height="48px" viewBox="0 0 24 24" aria-labelledby="sendIconTitle" stroke="#fff" stroke-width="1" stroke-linecap="square" stroke-linejoin="miter" fill="none" color="#fff">
                            <title id="sendIconTitle">Send</title>
                            <polygon points="21.368 12.001 3 21.609 3 14 11 12 3 9.794 3 2.394" />
                        </svg>
                    </Button>
                </div>
            ) : (
                <div></div>
            )}
        </div>
    );
}
