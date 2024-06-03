
import LeftMenu from "../../components/LeftMenu/"
import NavMenu from "../../components/NavMenu/NavMenu"
import RightMenu from "../../components/RightMenu/RightMenu"

const BassicLayout = ({ children, className, setRefreshCheckLogin }) => {

    return (

        <main className={`${className} bg-[#1a1a1a]`}>
            <section className="sm:grid sm:grid-cols-15 h-screen justify-center">
                <aside className=" sm:col-span-3 sm:grid hidden border-[#49494bc4] border-r bg-[#242424]">
                    <LeftMenu setRefreshCheckLogin={setRefreshCheckLogin} />
                </aside>
                <div className=" sm:col-span-9 sm:grid sm:overflow-y-scroll overflow-hidden bg-[#1a1a1a] pb-40">
                    {children}
                </div>
                <div className="sm:col-span-3 sm:grid hidden border-l border-white/20">
                    <RightMenu />
                </div>
                <footer className="sm:hidden fixed bottom-0 z-50 w-full border-t bg-[#1a1a1a] border-white/20 p-5">
                    <NavMenu setRefreshCheckLogin={setRefreshCheckLogin} />
                </footer>
            </section>
        </main>
    )
}



export default BassicLayout