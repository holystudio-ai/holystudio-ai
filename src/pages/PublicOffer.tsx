import React from 'react';
import PolicyWrapper from "@/src/components/features/PolicyWrapper.tsx";
import {publicOffer} from "@/src/data/publicOffer.ts";
import Seo from "@/src/components/features/Seo.tsx";

const PublicOfferPage = () => {
    return (
        <>
            <Seo
                title="Публічна оферта"
                description="Публічна оферта HOLYSTUDIO: умови придбання онлайн-інтенсиву, порядок оплати, доступу до матеріалів та повернення коштів."
            />
            <PolicyWrapper policyData={publicOffer}/>
        </>
    );

};

export default PublicOfferPage;
