import React from 'react';
import Header from '@/src/components/layout/Header.tsx';
import Footer from '@/src/components/layout/Footer.tsx';
import { Routes, Route, useLocation } from "react-router-dom";
import HomePage from '@/src/pages/Home.tsx';
import HomeMain from '@/src/pages/HomeMain.tsx';
import ApplyPage from '@/src/pages/ApplyPage.tsx';
import HomeSplit from '@/src/pages/HomeSplit.tsx';
import HomeSplitV2 from '@/src/pages/HomeSplitV2.tsx';
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
import PromtsIntensiveHtmlPage from "@/src/pages/PromtsIntensiveHtmlPage.tsx";
import AdminPanel from "@/src/pages/AdminPanel.tsx";

const App: React.FC = () => {
    const location = useLocation();
    const isAdmin = location.pathname === '/admin-panel';

    if (isAdmin) {
        return <AdminPanel />;
    }

    // The apply form is a standalone lead-capture page — no site nav on it.
    const hideHeader = location.pathname === '/apply';

    return (
        <div className="min-h-screen selection:bg-purple-500 selection:text-white">
            <ScrollToTop />

            {!hideHeader && <Header/>}

            <Routes>
                <Route path="/" element={<HomeMain />} />
                <Route path="/old" element={<HomePage />} />
                <Route path="/apply" element={<ApplyPage />} />
                <Route path="/split" element={<HomeSplit />} />
                <Route path="/splitv2" element={<HomeSplitV2 />} />
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
                <Route path="/promts_intensive" element={<PromtsIntensiveHtmlPage />} />
            </Routes>

            <Footer/>
        </div>
    );
};

export default App;