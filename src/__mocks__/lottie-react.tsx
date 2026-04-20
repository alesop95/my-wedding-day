import React from 'react';

// Mock di lottie-react per i test
// Le animazioni Lottie non servono nei test e causano errori Canvas
const Lottie: React.FC<any> = (props) => (
  <div data-testid="lottie-animation" {...props} />
);

export default Lottie;