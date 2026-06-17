"use client";

import { ReactTyped } from 'react-typed'

export const Title = () => {
    const strings = [
        "Javascript",
        "",
        "Typescript",
        "",
        "React",
        "React + Redux",
        "",
        "NextJS",
        "",
        "NodeJS",
        "",
        "ExpressJS",
        "",
    ];

    return (
        <ReactTyped
            strings={strings}
            typeSpeed={40}
            backSpeed={50} loop>
        </ReactTyped>
    )
}