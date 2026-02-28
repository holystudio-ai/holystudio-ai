import React from 'react';
import PolicyWrapper from "@/src/components/features/PolicyWrapper.tsx";
import {publicOffer} from "@/src/data/publicOffer.ts";

const PublicOfferPage = () => {
    return <PolicyWrapper policyData={publicOffer}/>

};

export default PublicOfferPage;