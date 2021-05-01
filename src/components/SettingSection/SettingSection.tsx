import React from 'react';
import ExportImportSection from './ExportImportSection/ExportImportSection';
import SubscriptionSection from './SubscriptionSection/SubscriptionSection';

const SettingSection: React.FunctionComponent = () => {
  return (
    <React.Fragment>
      <SubscriptionSection />
      <ExportImportSection />
    </React.Fragment>
  );
};

export default SettingSection;
