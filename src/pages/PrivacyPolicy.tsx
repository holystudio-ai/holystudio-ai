import React from 'react';
import PolicyWrapper from "@/src/components/features/PolicyWrapper.tsx";
import {privacyPolicy} from "@/src/data/privacyPolicy.ts";
import Seo from "@/src/components/features/Seo.tsx";

const PrivacyPolicyPage = () => {
    return (
        <>
            <Seo
                title="Політика конфіденційності"
                description="Політика конфіденційності HOLYSTUDIO: порядок збору, обробки та захисту персональних даних користувачів сайту."
            />
            <PolicyWrapper policyData={privacyPolicy}/>
        </>
    );
};

export default PrivacyPolicyPage;
