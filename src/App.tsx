import { useEffect, useState } from "react";
import { Login } from "./screens/Login";
import { LoungeScreen } from "./screens/LoungeScreen";
import { WorksManagerScreen } from "./screens/WorksManagerScreen";
import { RECEPTIONIST, WORKS_MANAGER, loadUser, loginRoleFromLink, saveUser, type PortalUser } from "./session";

export default function App() {
  const [user, setUserState] = useState<PortalUser | null>(loadUser);
  const setUser = (u: PortalUser | null) => { saveUser(u); setUserState(u); };

  // After midnight the screen goes back to the login page (the link is kept).
  useEffect(() => {
    if (!user) return;
    const t = setInterval(() => { if (!loadUser()) setUserState(null); }, 60_000);
    return () => clearInterval(t);
  }, [user]);

  if (!user) return <Login onLogin={setUser} onlyRole={loginRoleFromLink()} />;
  return user.role === "WorksManager"
    ? <WorksManagerScreen user={user} onOpenLounge={() => setUser(RECEPTIONIST)} onSignOut={() => setUser(null)} />
    : <LoungeScreen user={user} onSignOut={() => setUser(null)} onOpenWorkshop={loginRoleFromLink() === "Receptionist" ? undefined : () => setUser(WORKS_MANAGER)} />;
}
