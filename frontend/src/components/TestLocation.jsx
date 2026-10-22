import { useLocation } from "react-router-dom";

const TestLocation = () => {
  const { pathname } = useLocation();

  return (
    <div data-testid="location" hidden>
      {pathname}
    </div>
  );
};

export default TestLocation;
