import React from 'react';
import Header from '@/src/components/layout/Header.tsx';
import Footer from '@/src/components/layout/Footer.tsx';
import {Routes, Route} from "react-router-dom";
import HomePage from "@/src/pages/Home.tsx";
import PrivacyPolicyPage from "@/src/pages/PrivacyPolicy.tsx";
import PublicOfferPage from "@/src/pages/PublicOffer.tsx";
import TermsOfUse from "@/src/pages/TermsOfUse.tsx";
import ScrollToTop from "@/src/components/features/ScrollToTop.tsx";

const App: React.FC = () => {
    return (
        <div className="min-h-screen selection:bg-purple-500 selection:text-white">
            <Header/>
            <ScrollToTop/>
            <Routes>
                <Route path="/" element={<HomePage/>}/>
                <Route path="/privacy-policy" element={<PrivacyPolicyPage/>}/>
                <Route path="/public-offer" element={<PublicOfferPage/>}/>
                <Route path="/terms" element={<TermsOfUse/>}/>
            </Routes>

            <Footer/>
        </div>
    );
};

export default App;