import { NavBar } from "../components/NavBar";
import art140 from "../images/art/abstrakt-design-140-green.png"

const FallbackComponent = () => {
    return (
        <>
            <NavBar />
            <div className="section">
                <div id="error" className="container has-text-centered">
                    <p className="title">Oh no...</p>
                    <p className="subtitle">Something went wrong. We will look into it.</p>
                </div>
                <figure className="image container is-flex is-justify-content-center">
                    <img src={art140} alt="considering" style={{ maxWidth: 500, maxHeight: 500 }} />
                </figure>
            </div>
        </>
    );
}

export default FallbackComponent;