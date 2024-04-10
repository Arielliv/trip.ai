// __mocks__/@react-google-maps/api.js

export const GoogleMap = ({ children }) => <div data-testid="google-map">{children}</div>;
export const Marker = (props) => <div data-testid="marker" {...props}></div>;
export const LoadScript = ({ children }) => <div data-testid="load-script">{children}</div>;
export const Autocomplete = () => <div data-testid="autocomplete"></div>;
// Mock other components from @react-google-maps/api as needed
