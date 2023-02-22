import { useContext, useEffect, useRef } from "react";
import { registerForm } from "../lib/forms";
import Form from "../components/Form/Form";
import './Login/Login.css';
import UserContext from "../lib/usercontext";
import { useNavigate } from "react-router-dom";

function getRandomInt(min, max) {
    min = Math.ceil(min);
    max = Math.floor(max);
    return Math.floor(Math.random() * (max - min + 1)) + min;
}

class Point {
    constructor(x, y) {
        this.x = x;
        this.y = y;
        this.speed = getRandomInt(3, 5);
    }

    update(maxWidth, containerRef) {
        this.x -= this.speed;
        if (this.x < 0) {
            this.x = maxWidth;
            this.y = Math.floor(Math.random() * containerRef.current.clientHeight);
        }
    }

    draw(ctx) {
        ctx.fillStyle = "black";
        ctx.fillRect(this.x, this.y, 5, 5);
    }
}

export default function Register() {
    const navigate = useNavigate();
    const [user, setUser] = useContext(UserContext);
    let ref = useRef();
    let handleSubmit = (values) => {
        let user = values.user;
        setUser(user);
        navigate("/questions/");
    }

    const canvasRef = useRef(null)
    const containerRef = useRef(null)



    const draw = (ctx, points) => {
        ctx.fillStyle = "rgba(255,255,255,0.15)";
        ctx.fillRect(0, 0, ctx.canvas.width, ctx.canvas.height)
        points.forEach(point => {
            point.draw(ctx);
        });
    }

    useEffect(() => {

        const canvas = canvasRef.current
        const context = canvas.getContext('2d')
        canvas.height = containerRef.current.clientHeight;
        canvas.width = containerRef.current.clientWidth;
        let animationFrameId

        let points = [];
        for (let i = 0; i < 10; i++) {
            let x = Math.floor(Math.random() * containerRef.current.clientWidth);
            let y = Math.floor(Math.random() * containerRef.current.clientHeight);
            points.push(new Point(x, y))
        }

        const render = () => {
            draw(context, points)
            points.forEach(point => {
                point.update(containerRef.current.clientWidth, containerRef);
            });
            animationFrameId = window.requestAnimationFrame(render)
        }


        render()

        return () => {

            window.cancelAnimationFrame(animationFrameId)
        }
    }, [draw])

    return (
        <div ref={containerRef} className="auth-container">
            <div className="auth-form-container">
                <h1>Register to QueryBox</h1>
                <br />
                <br />
                <Form ref={ref} formDetails={registerForm} onResponse={handleSubmit} />
            </div>
            <canvas className="canvas" ref={canvasRef} />
        </div>
    );
}
