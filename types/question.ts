export type Question = {
    userid: string,
    questionid: string,
    answer: Array<{ text: string, userid: string }>,
    text: string,
    image: string | null;
    image2: string | null;
    reward: number,
    solution: boolean,
    date: Date,
}
