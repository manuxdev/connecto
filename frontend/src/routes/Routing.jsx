import {
    createBrowserRouter,
    RouterProvider,
} from "react-router-dom";
import Home from "../page/Home/Home";
import Error404 from "../page/Error404/Error404";
import User from "../page/User";
// import configRouting from "./configRouting";

const Routing = ({ setRefreshCheckLogin }) => {
    const router = createBrowserRouter([
        {
            path: "/:username",
            element: <User setRefreshCheckLogin={setRefreshCheckLogin} />,
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