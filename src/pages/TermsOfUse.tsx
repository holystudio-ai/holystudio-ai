import React from 'react';
import PolicyWrapper from "@/src/components/features/PolicyWrapper.tsx";
import {termsOfUse} from "@/src/data/termsOfUse.ts";

const TermsOfUse = () => {
    return <PolicyWrapper policyData={termsOfUse}/>

};

export default TermsOfUse;