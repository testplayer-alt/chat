import { Button } from "./ui/button"
const Select = () => {
    return (
        <ul className="bg-[#000000] w-fit">
            <Button className="rounded-none border-b-2 p-2 h-[33vh] block bg-black hover:bg-[#5d5d5d]">
                <p className="text-[1.63vw] font-bold text-center mb-[2.5rem]">メッセージ</p>
                <svg className="m-auto w-[5vw]" role="img" xmlns="http://www.w3.org/2000/svg" width="48px" height="48px" viewBox="0 0 24 24" aria-labelledby="envelopeIconTitle" stroke="#fff" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" fill="none" color="#fff"> <title id="envelopeIconTitle">Envelope</title> <rect width="20" height="14" x="2" y="5" /> <path stroke-linecap="round" d="M2 5l10 9 10-9" /> <path stroke-linecap="round" d="M2 19l6.825-7.8" /> <path stroke-linecap="round" d="M22 19l-6.844-7.822" /> </svg>
            </Button>
            <Button className="rounded-none border-b-2 p-2 h-[33vh] block bg-black hover:bg-[#5d5d5d]">
                <p className="text-[1.63vw] font-bold text-center mb-[2.5rem]">マッチング</p>
                <svg className="m-auto w-[5vw]" role="img" xmlns="http://www.w3.org/2000/svg" width="48px" height="48px" viewBox="0 0 24 24" aria-labelledby="languageIconTitle" stroke="#fff" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" fill="none" color="#fff"> <title id="languageIconTitle">Language</title> <circle cx="12" cy="12" r="10" /> <path stroke-linecap="round" d="M12,22 C14.6666667,19.5757576 16,16.2424242 16,12 C16,7.75757576 14.6666667,4.42424242 12,2 C9.33333333,4.42424242 8,7.75757576 8,12 C8,16.2424242 9.33333333,19.5757576 12,22 Z" /> <path stroke-linecap="round" d="M2.5 9L21.5 9M2.5 15L21.5 15" /> </svg>
            </Button>
            <Button className="rounded-none border-b-2 p-2 h-[33vh] block bg-black hover:bg-[#5d5d5d]">
                <p className="text-[1.63vw] font-bold text-center mb-[2.5rem]">アカウント</p>
                <svg className="m-auto w-[5vw]" role="img" xmlns="http://www.w3.org/2000/svg" width="48px" height="48px" viewBox="0 0 24 24" aria-labelledby="personIconTitle" stroke="#fff" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" fill="none" color="#fff"> <title id="personIconTitle">Person</title> <path d="M4,20 C4,17 8,17 10,15 C11,14 8,14 8,9 C8,5.667 9.333,4 12,4 C14.667,4 16,5.667 16,9 C16,14 13,14 14,15 C16,17 20,17 20,20" /> </svg>
            </Button>
        </ul>
    )
}
export default Select;