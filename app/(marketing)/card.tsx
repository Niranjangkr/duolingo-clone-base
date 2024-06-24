"use client"

import React, { useEffect, useState } from "react";
import { BentoGrid, BentoGridItem } from "../components/ui/bento-grid";
import axios from "axios";
import { Course } from "@/types";

export function Card() {
    const [data, setData] = useState<null | Course[]>(null);

    const fetchData = async () => {
        const data = await axios.get("/api/course/getAll");
        setData(data.data);
    }


    useEffect(() => {
        fetchData();
    }, []);


    console.log("DDDAAATTAA: ", data, "DDDAAATTAADDDAAATTAA");
    return (
        <div>
            <div className="flex flex-col">
                <h2 className="text-4xl font-bold ">Learn and Create Specialized Quiz-Based Courses</h2>
                <p className="text-lg text-slate-400">From critical skills to technical topics, Monaito supports your professional development.</p>
            </div>
            <BentoGrid className="max-w-4xl mx-auto md:auto-rows-[20rem] mt-8">
                {/* {items.map((item, i) => (
                    <BentoGridItem
                        key={i}
                        title={item.title}
                        description={item.description}
                        className={item.className}
                    />
                ))} */}
                {
                    data?.map((item, idx) => Object.entries(item.courseData!).map((item, idx) => {
                        console.log(item[idx], item[1].description);
                        let demoDescription = "";
                        if(item[idx] === "English Grammar"){
                            demoDescription = "Master the rules of English grammar to enhance your writing and communication skills effectively."
                        }else if(item[idx] === "Rust Programming Language"){
                            demoDescription="Discover the power and safety of the Rust programming language, designed for performance and reliability in systems programming."
                        }else if(item[idx] === "Javascript"){
                            demoDescription="Explore the versatility of JavaScript, the essential language for dynamic and interactive web development."
                        }
                        
                        return (
                            <BentoGridItem
                                key={idx}
                                title={item[idx] as string}
                                description={item[1].description || demoDescription}
                                className={`md:col-span-1 border-[#d1d7dc] border`}
                            />
                        )
                    }))
                }
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
