export type Contents = {
  id: string;//名前
  img: string;//画像
  lore: string;//説明
  money: Number;//値段
  Isbought: boolean;//買えるかどうか
  Rebuy: boolean;//何度でも購入できるかどうか
  itemid: string;//個別id
  username: string;//ニックネーム
  userid: string;
  date: Date;
  url: string;//コンテンツのurl
};