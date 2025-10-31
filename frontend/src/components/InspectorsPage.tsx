import React from 'react';
import { TrustedInspectors } from './TrustedInspectors';
import InspectorDashboard from './InspectorDashboard';

const InspectorsPage: React.FC = () => {
  return (
    <div className="flex flex-col">
      {/* Showcase + CTA */}
      <TrustedInspectors />
      {/* Verification dashboard */}
      <InspectorDashboard />
    </div>
  );
};

export default InspectorsPage;
