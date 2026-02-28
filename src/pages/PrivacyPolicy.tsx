import React from 'react';
import PolicyWrapper from "@/src/components/features/PolicyWrapper.tsx";
import {privacyPolicy} from "@/src/data/privacyPolicy.ts";

const PrivacyPolicyPage = () => {
    return <PolicyWrapper policyData={privacyPolicy}/>
};

export default PrivacyPolicyPage;