import { useContext, useEffect, useRef } from "react";
import { Link, useNavigate } from "react-router-dom";
import Form from "../../components/Form/Form";
import { loginForm } from "../../lib/forms";
import { request, requestWithAuth } from "../../lib/random_functions";
import UserContext from "../../lib/usercontext";
import './Login.css';

//async function getData(){
//let res = await fetch("/api/hello");
//let obj = await res.json();
//}

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

export default function Login() {

    const navigate = useNavigate();

    let ref = useRef();

        //(async () => {
            //await requestWithAuth(navigate, "/api/auth/user");
        //})();
    //useEffect(() => {
    //},)

    const [user, setUser] = useContext(UserContext);

    let handleSubmit = async (values) => {
        let user = values.user;
        //let [_, data] = await requestWithAuth(navigate, "/api/auth/user");
        setUser(user);
        if(user.type=="admin"){
            navigate("/admin/users");
        } else if(user.type == "staff"){
            navigate("/admin/customer");
        } else  {
            navigate("/questions/");
        }
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
        for (let i = 0; i < 20; i++) {
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
                    <h1>Login to QueryBox</h1>
                    <br />
                    <br />
                    <br />
                    <Form ref={ref} formDetails={loginForm} onResponse={handleSubmit} />
                </div>
            <canvas className="canvas" ref={canvasRef} />
        </div>
    );
}
