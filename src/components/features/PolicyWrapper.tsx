import React, {FC, useMemo} from "react";
import {PolicyData} from "@/src/data/types";

interface PolicyWrapperProps {
    policyData: PolicyData;
}

const PolicyWrapper: FC<PolicyWrapperProps> = ({policyData}) => {
    const safeTitle = policyData?.title ?? "";
    const sections = useMemo(() => policyData?.sections ?? [], [policyData]);

    return (
        <section className="py-20 px-4 bg-white text-black">
            <div className="max-w-4xl mx-auto">
                <div className="mb-10">
                    <h1 className="text-2xl min-[480px]:text-3xl md:text-5xl lg:text-7xl font-black font-brutal tracking-tighter uppercase leading-none">
                        {safeTitle}
                    </h1>
                    <div className="mt-6 h-[2px] w-full bg-black"/>
                </div>

                <div className="space-y-6">
                    {sections.map((section) => (
                        <article
                            key={section.id}
                            className="brutalist-border border-2 border-black bg-white brutalist-shadow overflow-hidden mr-2 mb-2"
                        >
                            <div className="p-6 bg-black text-white flex items-start gap-4">
                <span className="bg-purple-600 text-white px-2 py-1 font-black font-brutal text-[12px] shrink-0">
                  {String(section.id).padStart(2, "0")}
                </span>

                                <h2 className="text-sm md:text-xl font-black font-brutal leading-tight">
                                    {section.title}
                                </h2>
                            </div>

                            {/* body */}
                            <div className="p-6 bg-white">
                                <div className="h-[3px] w-20 bg-purple-600 mb-4"/>
                                <p className="text-sm md:text-lg font-medium leading-relaxed whitespace-pre-line text-zinc-900">
                                    {section.text?.trim()}
                                </p>
                            </div>
                        </article>
                    ))}
                </div>

                <div className="mt-10 text-xs md:text-sm uppercase font-black font-brutal opacity-70">
                    Останнє оновлення: {new Date().toLocaleDateString("uk-UA")}
                </div>
            </div>
        </section>
    );
};

export default PolicyWrapper;