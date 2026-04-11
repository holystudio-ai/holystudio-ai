import React from 'react';
import Header from '@/src/components/layout/Header.tsx';
import Footer from '@/src/components/layout/Footer.tsx';
import { Routes, Route, useLocation } from "react-router-dom";
import HomePage from '@/src/pages/Home.tsx';
import PrivacyPolicyPage from "@/src/pages/PrivacyPolicy.tsx";
import PublicOfferPage from "@/src/pages/PublicOffer.tsx";
import TermsOfUse from "@/src/pages/TermsOfUse.tsx";
import ScrollToTop from "@/src/components/features/ScrollToTop.tsx";
import IntensiveSmm from "@/src/pages/IntensiveSmm.tsx";
import IntensivePhotoVideo from "@/src/pages/IntensivePhotoVideo.tsx";
import Intensive from "@/src/pages/Intensive.tsx";
import ThankYou from "@/src/pages/ThankYou.tsx";
import ReturnPage from "@/src/pages/ReturnPage.tsx";
import CancelPage from "@/src/pages/CancelPage.tsx";
import ServicePage from "@/src/pages/ServicePage.tsx";
import EmailModal from "@/src/components/features/EmailModal.tsx";
import PromtsIntensiveHtmlPage from "@/src/pages/PromtsIntensiveHtmlPage.tsx";

const App: React.FC = () => {

    return (
        <div className="min-h-screen selection:bg-purple-500 selection:text-white">
            <ScrollToTop />

            <Header/>

            <Routes>
                <Route path="/" element={<HomePage />} />
                <Route path="/privacy-policy" element={<PrivacyPolicyPage />} />
                <Route path="/public-offer" element={<PublicOfferPage />} />
                <Route path="/terms" element={<TermsOfUse />} />
                <Route path="/intensive-smm" element={<IntensiveSmm />} />
                <Route path="/intensive-photo-video" element={<IntensivePhotoVideo />} />
                <Route path="/intensive" element={<Intensive />} />
                <Route path="/thank-you" element={<ThankYou />} />
                <Route path="/return-page" element={<ReturnPage />} />
                <Route path="/cancel-page" element={<CancelPage />} />
                <Route path="/service-page" element={<ServicePage />} />
            </Routes>

            <Footer/>

            <EmailModal />
        </div>
    );
};

export default App;