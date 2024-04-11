import LeftMenu from "../../components/LeftMenu/"

const BassicLayout = ({ children, className, setRefreshCheckLogin }) => {
    return (
        <main className={`${className} h-screen w-screen bg-[#1a1a1a]`}>
            <section className="grid grid-cols-15 h-screen justify-center">
                <aside className=" col-span-3 border-[#49494bc4] border-r bg-[#242424]">
                    <LeftMenu setRefreshCheckLogin={setRefreshCheckLogin} />
                </aside>
                <div className=" col-span-8">
                    {children}
                </div>
                <div className="col-span-4 bg-black">
                    el otro lado
                </div>
            </section>
        </main>
    )
}

export default BassicLayout