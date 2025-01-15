
'use client';

import { AppProgressBar as ProgressBar } from 'next-nprogress-bar';

const NProgressWrapper = ({ children }: { children: React.ReactNode }) => {
    return (
        <>
            {children}
            <ProgressBar
                height="3px"
                color="#17a043"
                options={{ showSpinner: false }}
                shallowRouting
            />
        </>
    );
};

export default NProgressWrapper;