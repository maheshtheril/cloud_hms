
import { getAllMenus } from "@/app/actions/developer/menu-actions";
import MenuManagerClient from "./menu-manager-client";

export default async function MenuManagerPage() {
    const { menus, modules } = await getAllMenus();

    return (
        <div className="h-screen flex flex-col bg-slate-50">
            <header className="bg-white border-b px-6 py-4 flex items-center justify-between">
                <div>
                    <h1 className="text-2xl font-bold text-slate-900">Menu Manager</h1>
                    <p className="text-sm text-slate-500">Developer Tools • Global Navigation Architecture</p>
                </div>
            </header>

            <div className="flex-1 overflow-hidden">
                <MenuManagerClient initialMenus={menus} modules={modules} />
            </div>
        </div>
    );
}
