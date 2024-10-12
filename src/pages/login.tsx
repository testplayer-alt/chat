
import "firebase/firestore";
import { useState } from "react";
import { useAuth } from "../../context/auth";
import { login } from "../../lib/auth";


export default function Login() {
    const user = useAuth();
    const [waiting, setWaiting] = useState<boolean>(false);

    const signIn = () => {
        setWaiting(true);
        login()
            .catch((error) => {
                console.error("エラー:" + error?.code);
            })
            .finally(() => {
                setWaiting(false);
            });
    };
    return (<>
        {user && (window.location.href = "/user/account")}
        {user === null && !waiting &&
            <div className="h-[80dvh]">
                <div className="text-center m-auto bg-[#858585] w-[70%] align-middle rounded-[1rem] text-black mt-[87px]">
                    <div className="py-[10rem]">
                        <div className="text-center">
                            <p className=" text-[35px] font-bold">ログインされていません</p>
                        </div>
                        <div className="m-auto mt-[3rem]">
                            <button onClick={signIn} className="text-white border-[#000000] bg-[#000000] border-2 w-[150px] h-[70px] rounded-md">ログイン</button>
                        </div>
                    </div>

                </div>
            </div>}

    </>)

}