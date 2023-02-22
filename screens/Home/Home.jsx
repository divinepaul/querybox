import { Button } from "@mui/material";
import Link from "../../components/Link/Link";
import React, { useRef, useEffect } from 'react'
import './Home.css';

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

export default function Home() {

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
        for (let i = 0; i < 50; i++) {
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

        containerRef.current.addEventListener("mousemove", (event) => {
            if (getRandomInt(1, 2) == 1) {
                points.push(new Point(event.offsetX, event.offsetY))
            }
        });

        render()

        return () => {
            window.cancelAnimationFrame(animationFrameId)
        }
    }, [draw])

    return (
        <>
            <div ref={containerRef} className="hero-container">
                <div className="white-box">
                    <h1>querybox</h1>
                    <p>The best question answer site ever.</p>
                </div>
                <canvas className="canvas" ref={canvasRef} />
            </div>
            <div className="side-section">
                <img src="/assets/ask.jpg" />
                <div className="side-section-content">
                    <h1>We have the best questions.</h1>
                    <p> We have diffrent feilds of study asking all types of questions</p>
                </div>
            </div>
            <div className="side-section">
                <div className="side-section-content">
                    <h1>We have the best answers.</h1>
                    <p> We have different feilds of study asking all types of questions</p>
                </div>
                <img src="/assets/answer.jpg" />
            </div>
        </>
    );
}
