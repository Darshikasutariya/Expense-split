import React from "react";
import Hero from "../sections/Hero";
import ProblemStatement from "../sections/ProblemStatement";
import Features from "../sections/Features";
import HowItWorks from "../sections/HowItWorks";
import UseCases from "../components/UseCases";
import TechHighlights from "../sections/TechHighlights";
import SplitDemo from "../sections/SplitDemo";
import SocialProof from "../sections/SocialProof";
import FAQ from "../sections/FAQ";
import CTA from "../sections/CTA";
const Home = () => {
    return (
        <div>
            <main className="flex-grow">
                <Hero />
                <ProblemStatement />
                <Features />
                <HowItWorks />
                <UseCases />
                <TechHighlights />
                <SplitDemo />
                <SocialProof />
                <FAQ />
                <CTA />
            </main>
        </div>
    );
};

export default Home;