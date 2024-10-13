import { Button } from "./ui/button"
import { ScrollArea } from "./ui/scroll-area"
import { Textarea } from "./ui/textarea"
export default function Message() {
    return (<>
        <div className="bg-[#000000] border-l-2 w-full">
            <div className=" border-b-2 mb-3 p-2 h-[6.5vh]">
                <p className="text-[1.5rem] font-bold">チャット相手の名前</p>
            </div>
            <ScrollArea className="h-[80vh] w-full p-2">
                <div className="block w-full">
                    <div className="bg-[#2a2a2a] w-fit text-[#dedede] p-1 px-3 rounded-r-xl rounded-t-xl mb-2 border-2 border-[#868686]">
                        ここにメッセージを表示
                    </div>
                    <div className="bg-[#5a5a5a] w-fit text-[#dedede] p-1 px-3 rounded-l-xl rounded-t-xl mb-2 border-2 border-[#868686] ml-auto mr-0">
                        ここにメッセージを表示
                    </div>

                </div>
            </ScrollArea>
            <div className="border-t-2 h-[12vh] flex">
                <Textarea className="border-r-2 w-[80%] h-[11.4vh] rounded-none resize-none text-[1.3rem]" placeholder="メッセージを入力...">
                </Textarea>

                <Button className="bg-black hover:bg-[#5d5d5d] w-[7vw] h-[11.4vh]">
                    <svg role="img" xmlns="http://www.w3.org/2000/svg" width="48px" height="48px" viewBox="0 0 24 24" aria-labelledby="imageIconTitle" stroke="#fff" stroke-width="1" stroke-linecap="square" stroke-linejoin="miter" fill="none" color="#fff"> <title id="imageIconTitle">Image</title> <rect width="18" height="18" x="3" y="3" /> <path stroke-linecap="round" d="M3 14l4-4 11 11" /> <circle cx="13.5" cy="7.5" r="2.5" /> <path stroke-linecap="round" d="M13.5 16.5L21 9" /> </svg>
                </Button>
                <Button className="bg-black hover:bg-[#5d5d5d] w-[7vw] h-[11.4vh]">
                    <svg role="img" xmlns="http://www.w3.org/2000/svg" width="48px" height="48px" viewBox="0 0 24 24" aria-labelledby="sendIconTitle" stroke="#fff" stroke-width="1" stroke-linecap="square" stroke-linejoin="miter" fill="none" color="#fff"> <title id="sendIconTitle">Send</title> <polygon points="21.368 12.001 3 21.609 3 14 11 12 3 9.794 3 2.394" /> </svg>
                </Button>
            </div>
        </div>
    </>)
}