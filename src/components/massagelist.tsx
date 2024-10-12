import { Button } from "./ui/button"
import { ScrollArea } from "./ui/scroll-area"


const List = () => {
    const tags = Array.from({ length: 50 }).map(
        (_, i, a) => `チャット相手${a.length - i}`
    )
    return (
        <div className="bg-[#000000] border-l-2 p-2 w-full">
            <p className="text-[30px] font-bold text-center mb-[5rem]">DM</p>
            <ScrollArea className="h-[83vh] w-full">
                <div className="block w-full border-t-2">
                    {tags.map((tag) => (
                        <Button className="w-full rounded-none border-b-2 h-[4rem] bg-black hover:bg-[#5d5d5d]">
                            <div key={tag} className="text-sm">
                                {tag}
                            </div>
                        </Button>
                    ))}
                </div>
            </ScrollArea>
        </div>
    )
}
export default List;