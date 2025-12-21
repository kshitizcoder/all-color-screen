import React from "react";

interface SeoProps {
    title: string;
    description: string;
}

const Seo: React.FC<SeoProps> = ({ title, description }) => {
    return (
        <>
            <title>{title}</title>
            <meta name="description" content={description} />
            <meta property="og:title" content={title} />
            <meta property="og:description" content={description} />
            <meta name="twitter:title" content={title} />
            <meta name="twitter:description" content={description} />
        </>
    );
};

export default Seo;
