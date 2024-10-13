import App from "./column"
import { useAuth } from "../../context/auth";
import { login, logout } from "../../lib/auth";
import { useState } from "react";
import { Button } from "@/components/ui/button";
export default function Home() {
  const user = useAuth();
  const [waiting, setWaiting] = useState<boolean>(false);

  const signIn = () => {
    setWaiting(true);

    login()
      .catch((error) => {
        console.error(error?.code);
      })
      .finally(() => {
        setWaiting(false);
      });
  };
  return (<>
    <App></App>
    <div>
      {user === null && !waiting && <Button onClick={signIn}>ログイン</Button>}
      {user && <Button onClick={logout}>ログアウト</Button>}
    </div>
  </>)
}