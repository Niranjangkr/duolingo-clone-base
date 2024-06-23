"use client"

import React, { useEffect } from "react";
import { BentoGrid, BentoGridItem } from "../components/ui/bento-grid";
import axios from "axios";

export function Card() {
    const fetchData = async() => {
        const data = await axios.get("/api/course/getAll");
        console.log("DDDAAATTAA: ", data, "DDDAAATTAADDDAAATTAA");
    }

    useEffect(() => {
        fetchData();
    }, []);

    return (
        <div>
            <div className="flex flex-col">
                <h2 className="text-4xl font-bold ">Learn and Create Specialized Quiz-Based Courses</h2>
                <p className="text-lg text-slate-400">From critical skills to technical topics, Monaito supports your professional development.</p>
            </div>
            <BentoGrid className="max-w-4xl mx-auto md:auto-rows-[20rem] mt-8">
                {items.map((item, i) => (
                    <BentoGridItem
                        key={i}
                        title={item.title}
                        description={item.description}
                        className={item.className}
                    />
                ))}
            </BentoGrid>
        </div>
    );
}


const items = [
    {
        title: "The Dawn of Innovation",
        description: "Explore the birth of groundbreaking ideas and inventions.",
        className: "md:col-span-1 border-[#d1d7dc] border",
    },
    {
        title: "The Digital Revolution",
        description: "Dive into the transformative power of technology.",
        className: "md:col-span-1 border-[#d1d7dc] border",
    },
    {
        title: "The Art of Design",
        description: "Discover the beauty of thoughtful and functional design.",
        className: "md:col-span-1 border-[#d1d7dc] border",
    },
    {
        title: "The Power of Communication",
        description:
            "Understand the impact of effective communication in our lives.",
        className: "md:col-span-1 border-[#d1d7dc] border",
        // icon: <IconSchool className="h-4 w-4 text-neutral-500" />,
    },
];
