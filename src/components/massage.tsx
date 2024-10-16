import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Textarea } from "@/components/ui/textarea";
import { arrayUnion, doc, getFirestore, onSnapshot, updateDoc } from 'firebase/firestore';
import { useEffect, useState, useRef } from "react";
import { useAuth } from "../../context/auth";
import { useGetImageUrl } from "@/components/useGetImageUrl";
import { getStorage, ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import React, { forwardRef, InputHTMLAttributes } from "react";
import { Card } from "@/components/ui/card";

let settalk: any;
let setroomname: any;
let setusername: any;

export const inchat = (room: any, username: any) => {
    if (settalk) {
        settalk(room.talk);
    }
    if (setroomname) {
        setroomname(room.roomname);
    }
    if (setusername) {
        setusername(username);
    }
};

export type Props = {
    onChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
    id: InputHTMLAttributes<HTMLInputElement>["id"];
    children?: React.ReactNode;
};

export default function Message() {
    const [talk, settalkState] = useState<any[]>([]);
    const [username, Setusername] = useState<any>();
    const [roomname, Setroomname] = useState<any>();
    const db = getFirestore();
    const user = useAuth();
    const fileInputRef = useRef<HTMLInputElement>(null);

    const [imageFile, setImageFile] = useState<File | null>(null);
    const { imageUrl } = useGetImageUrl({ file: imageFile });

    const cardRef = useRef(null);
    const scrollAreaRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        settalk = settalkState;
        setusername = Setusername;
        setroomname = Setroomname;

        if (roomname) {
            const roomRef = doc(db, 'chat', roomname);

            const unsubscribe = onSnapshot(roomRef, (doc) => {
                if (doc.exists()) {
                    const roomData = doc.data();
                    if (roomData && roomData.talk) {
                        settalkState(roomData.talk);
                    }
                } else {
                    console.log("No such document!");
                }
            });

            return () => unsubscribe();
        }
    }, [roomname, db]);

    const scrollToBottom = () => {
        if (scrollAreaRef.current) {
            const scrollableNode = scrollAreaRef.current.querySelector('[data-radix-scroll-area-viewport]');
            if (scrollableNode) {
                scrollableNode.scrollTop = scrollableNode.scrollHeight;
            }
        }
    };

    useEffect(() => {
        scrollToBottom();
    }, [talk]);

    async function SendMessage() {
        const messageInput = document.getElementById('textarea') as HTMLInputElement;
        const newMessage = messageInput.value;
        let imageUrl: string | null = null;

        try {
            if (imageFile) {
                imageUrl = await uploadImage(imageFile);
            }
            handleClickCancelButton();

            if (newMessage.trim() !== "" || imageUrl) {
                const newTalkEntry = {
                    id: user?.id,
                    message: newMessage,
                    imageUrl: imageUrl,
                    timestamp: new Date(),
                };

                settalkState((prevTalk) => [...prevTalk, newTalkEntry]);
                messageInput.value = "";

                const roomRef = doc(db, 'chat', roomname);
                await updateDoc(roomRef, {
                    talk: arrayUnion(newTalkEntry)
                });
            }
        } catch (error) {
            console.log(error);
        }
    }

    const InputImage = forwardRef<HTMLInputElement, Props>(
        ({ onChange, id }, ref) => (
            <input ref={ref} id={id} type="file" accept="image/*" onChange={onChange} hidden />
        )
    );

    async function uploadImage(file: File): Promise<string | null> {
        if (!file) return null;

        try {
            const storage = getStorage();
            const storageRef = ref(storage, `images/${file.name}`);
            await uploadBytes(storageRef, file);
            const downloadURL = await getDownloadURL(storageRef);
            return downloadURL;
        } catch (error) {
            console.error("Error uploading image: ", error);
            return null;
        }
    }

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.currentTarget?.files && e.currentTarget.files[0]) {
            const targetFile = e.currentTarget.files[0];
            setImageFile(targetFile);
        }
    };

    const handleClickCancelButton = () => {
        setImageFile(null);
        if (fileInputRef.current) {
            fileInputRef.current.value = "";
        }
    };

    return (
        <div className="bg-[#000000] border-l-2 w-full">
            <div className="border-b-2 mb-3 p-2 h-[6.5vh]">
                <p className="text-[1.5rem] font-bold">{username}</p>
            </div>
            {imageUrl && imageFile ? (
                <ScrollArea ref={scrollAreaRef} className="h-[50vh] w-full p-2 shadow-none">
                    {talk.length > 0 ? (
                        <div className="block w-full">
                            {talk.map((message, index) => (
                                <Card
                                    key={index}
                                    className="mb-4 relative bg-black border-0"
                                >
                                    <div>
                                        {message.id !== user?.id ? (
                                            <div className="bg-[#2a2a2a] w-fit text-[#dedede] p-1 px-3 rounded-r-xl rounded-t-xl mb-2 border-2 border-[#868686]">
                                                {message.imageUrl && (
                                                    <img src={message.imageUrl} alt="Image" className="w-[20vw] h-auto rounded-md" />
                                                )}
                                                {message.message}
                                            </div>
                                        ) : (
                                            <div className="bg-[#5a5a5a] w-fit text-[#dedede] p-1 px-3 rounded-l-xl rounded-t-xl mb-2 border-2 border-[#868686] ml-auto mr-0">
                                                {message.imageUrl && (
                                                    <img src={message.imageUrl} alt="Image" className="w-[20vw] h-auto rounded-md" />
                                                )}
                                                {message.message}
                                            </div>
                                        )}
                                    </div>
                                </Card>
                            ))}
                        </div>
                    ) : (
                        <p className="text-white text-center">メッセージがありません</p>
                    )}
                </ScrollArea>
            ) : (
                <ScrollArea ref={scrollAreaRef} className="h-[80vh] w-full p-2 shadow-none">
                    {talk.length > 0 ? (
                        <div className="block w-full">
                            {talk.map((message, index) => (
                                <Card
                                    key={index}
                                    className="mb-4 relative bg-black border-0"
                                >
                                    <div>
                                        {message.id !== user?.id ? (
                                            <div className="bg-[#2a2a2a] w-fit text-[#dedede] p-1 px-3 rounded-r-xl rounded-t-xl mb-2 border-2 border-[#868686]">
                                                {message.imageUrl && (
                                                    <img src={message.imageUrl} alt="Image" className="w-[20vw] h-auto rounded-md" />
                                                )}
                                                {message.message}
                                            </div>
                                        ) : (
                                            <div className="bg-[#5a5a5a] w-fit text-[#dedede] p-1 px-3 rounded-l-xl rounded-t-xl mb-2 border-2 border-[#868686] ml-auto mr-0">
                                                {message.imageUrl && (
                                                    <img src={message.imageUrl} alt="Image" className="w-[20vw] h-auto rounded-md" />
                                                )}
                                                {message.message}
                                            </div>
                                        )}
                                    </div>
                                </Card>
                            ))}
                        </div>
                    ) : (
                        <p className="text-white text-center">メッセージがありません</p>
                    )}
                </ScrollArea>
            )}

            {imageUrl && imageFile ? (
                <div className="relative">
                    <div className="border-2 h-[30vh]">
                        <img
                            src={imageUrl}
                            alt="アップロード画像"
                            className=" object-cover h-[30vh] w-auto m-auto"
                        />
                    </div>
                    <Button className="absolute top-4 right-4 bg-black hover:bg-black" onClick={handleClickCancelButton}>
                        <svg version="1.1" id="_x32_" xmlns="http://www.w3.org/2000/svg" xmlnsXlink="http://www.w3.org/1999/xlink" x="0px" y="0px" viewBox="0 0 512 512" style={{ width: '32px', height: '32px', opacity: 1 }} xmlSpace="preserve">
                            <g>
                                <polygon className="st0" points="512,52.535 459.467,0.002 256.002,203.462 52.538,0.002 0,52.535 203.47,256.005 0,459.465 
		52.533,511.998 256.002,308.527 459.467,511.998 512,459.475 308.536,256.005" style={{ fill: 'rgb(255, 255, 255)' }}></polygon>
                            </g>
                        </svg>
                    </Button>
                </div>
            ) : ("")}

            <div className="border-t-2 h-[12vh] flex">
                <Textarea id="textarea" className="text-[#dedede] border-r-2 w-[80%] h-[11.4vh] rounded-none resize-none text-[1.3rem]" placeholder="メッセージを入力..."></Textarea>
                <label
                    className="label"
                    htmlFor="imageId"
                    style={{
                        width: "7vw",
                        height: "11.4vh",
                        display: "flex",
                        justifyContent: "center",
                        alignItems: "center",
                        cursor: "pointer",
                        background: "black",
                    }}
                    onMouseEnter={(e) => { e.currentTarget.style.background = '#5d5d5d'; }}
                    onMouseLeave={(e) => { e.currentTarget.style.background = '#000'; }}
                >
                    <InputImage ref={fileInputRef} id="imageId" onChange={handleFileChange} />
                    <svg role="img" xmlns="http://www.w3.org/2000/svg" width="48px" height="48px" viewBox="0 0 24 24" stroke="#fff">
                        <rect width="18" height="18" x="3" y="3" />
                        <path d="M3 14l4-4 11 11" />
                        <circle cx="13.5" cy="7.5" r="2.5" />
                    </svg>
                </label>

                <Button onClick={() => SendMessage()} className="bg-black hover:bg-[#5d5d5d] w-[7vw] h-[11.4vh]">
                    <svg role="img" xmlns="http://www.w3.org/2000/svg" width="48px" height="48px" viewBox="0 0 24 24" stroke="#fff">
                        <polygon points="21.368 12.001 3 21.609 3 14 11 12 3 9.794 3 2.394" />
                    </svg>
                </Button>
            </div>
        </div>
    );
}
