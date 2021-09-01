import React from 'react';
import ExportImportSection from './ExportImportSection/ExportImportSection';
import Footer from './Footer/Footer';
import Header from './Header/Header';
import SubscriptionSection from './SubscriptionSection/SubscriptionSection';

const SettingSection: React.FunctionComponent = () => {
  return (
    <React.Fragment>
      <Header />
      <SubscriptionSection />
      <ExportImportSection />
      <Footer />
    </React.Fragment>
  );
};

export default SettingSection;
