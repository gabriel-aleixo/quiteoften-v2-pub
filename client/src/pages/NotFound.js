import { NavBar } from "../components/NavBar";
import art133 from "../images/art/abstrakt-design-133-green.png"


const NotFound = () => {
    return (
        <>
            <NavBar />
            <div className="section">
                <div id="error" className="container has-text-centered">
                    <p className="title">Nope...</p>
                    <p className="subtitle">The page you're looking for doesn't exist.</p>
                </div>
                <figure className="image container is-flex is-justify-content-center">
                    <img src={art133} alt="considering" style={{ maxWidth: 500, maxHeight: 500 }} />
                </figure>
            </div>
        </>
    );
}

export default NotFound;