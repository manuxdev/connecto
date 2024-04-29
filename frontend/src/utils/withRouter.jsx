import { useLocation, useNavigate, useParams } from 'react-router-dom';

export function withRouter(Component) {
    function ComponentWithRouterProp(props) {
        const location = useLocation();
        const navigate = useNavigate();
        const params = useParams();
        const history = {
            push: (path) => navigate(path),
            replace: (path) => navigate(path, { replace: true }),
            goBack: () => navigate(-1),
            goForward: () => navigate(1),
            // Puedes agregar más funciones según sea necesario
        };

        return <Component {...props} router={{ location, navigate, params, history }} />;
    }

    return ComponentWithRouterProp;
}