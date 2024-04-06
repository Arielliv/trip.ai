// reason to use https://stackoverflow.com/questions/51791163/warning-prop-classname-did-not-match-when-using-styled-components-with-seman

import dynamic from 'next/dynamic';
import React from 'react';

const NoSsr = ({ children }: React.PropsWithChildren) => <>{children}</>;

export default dynamic(() => Promise.resolve(NoSsr), { ssr: false });
