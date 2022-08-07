import { useEffect } from 'react';
import { useNavigate } from "react-router-dom";
import { useParams } from "react-router-dom";

export function Dashboard() {
    const navigate = useNavigate();
    const { userid } = useParams();

    useEffect(() => {
        console.log(`${userid}`);
    }, [userid]);

    function handleClick() {
        navigate("/", { replace: true });
    }

    return (
        <div>
            <button type="button" onClick={handleClick}>
                Go home
            </button>
            Dashboard here
        </div>
    );
}