import React from 'react';
import PolicyWrapper from "@/src/components/features/PolicyWrapper.tsx";
import {termsOfUse} from "@/src/data/termsOfUse.ts";
import Seo from "@/src/components/features/Seo.tsx";

const TermsOfUse = () => {
    return (
        <>
            <Seo
                title="Умови використання"
                description="Умови використання сайту HOLYSTUDIO та правила доступу до матеріалів, уроків, шаблонів і сервісів платформи."
            />
            <PolicyWrapper policyData={termsOfUse}/>
        </>
    );

};

export default TermsOfUse;
