import {
    createBrowserRouter,
    RouterProvider,
} from "react-router-dom";
import Home from "../page/Home";
import Error404 from "../page/Error404";
import User from "../page/User";
import Users from "../page/Users";
import Bookmarked from "../page/Bookmarked/Bookmarked";
import Buscar from "../page/Buscar/Buscar";
// import configRouting from "./configRouting";

const Routing = ({ setRefreshCheckLogin }) => {
    const router = createBrowserRouter([
        {
            path: "/:username",
            element: <User setRefreshCheckLogin={setRefreshCheckLogin} />,
        },
        {
            path: "/users",
            element: <Users setRefreshCheckLogin={setRefreshCheckLogin} />,
        },
        {
            path: "/search",
            element: <Buscar setRefreshCheckLogin={setRefreshCheckLogin} />,
        },
        {
            path: "/bookmarked",
            element: <Bookmarked setRefreshCheckLogin={setRefreshCheckLogin} />,
        },
        {
            path: "/",
            element: <Home setRefreshCheckLogin={setRefreshCheckLogin} />,
        },
        {
            path: "*",
            element: <Error404 />,
        },
    ]);
    return (
        <RouterProvider router={router} />
    )
}

export default Routing