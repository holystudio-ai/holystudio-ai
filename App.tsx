import React from 'react';
import Header from '@/src/components/layout/Header.tsx';
import Footer from '@/src/components/layout/Footer.tsx';
import { Routes, Route, useLocation } from "react-router-dom";
import HomePage from '@/src/pages/Home.tsx';
import HomeMain from '@/src/pages/HomeMain.tsx';
import ApplyPage from '@/src/pages/ApplyPage.tsx';
import {APPLY_VARIANTS} from '@/src/pages/applyVariants.ts';
import SplitLanding from '@/src/pages/SplitLanding.tsx';
import {SPLIT_VARIANTS} from '@/src/pages/splitVariants.ts';
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

    // Standalone HTML pages redirect immediately — skip chrome so it doesn't flash.
    const isStandaloneHtml = location.pathname === '/promts_intensive';

    // The apply forms are standalone lead-capture pages — no site nav on them.
    const hideHeader =
        isStandaloneHtml ||
        APPLY_VARIANTS.some((variant) => location.pathname === `/${variant.slug}`);

    return (
        <div className="min-h-screen selection:bg-purple-500 selection:text-white">
            <ScrollToTop />

            {!hideHeader && <Header/>}

            <Routes>
                <Route path="/" element={<HomeMain />} />
                <Route path="/old" element={<HomePage />} />
                {APPLY_VARIANTS.map((variant) => (
                    <Route
                        key={variant.slug}
                        path={`/${variant.slug}`}
                        element={<ApplyPage fields={variant.fields} />}
                    />
                ))}
                {SPLIT_VARIANTS.map((variant) => (
                    <Route
                        key={variant.slug}
                        path={`/${variant.slug}`}
                        element={
                            <SplitLanding
                                imageDesktop={variant.imageDesktop}
                                imageMobile={variant.imageMobile}
                                ctaHref={variant.ctaHref}
                                noindex={variant.noindex}
                            />
                        }
                    />
                ))}
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

            {!isStandaloneHtml && <Footer/>}
        </div>
    );
};

export default App;