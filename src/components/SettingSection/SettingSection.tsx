import React from 'react';
import ClearDataSection from './ClearDataSection/ClearDataSection';
import CloudSyncSection from './CloudSyncSection/CloudSyncSection';
import ManageDataSection from './ManageDataSection/ManageDataSection';
import Footer from './Footer/Footer';
import Header from './Header/Header';
import SubscriptionSection from './SubscriptionSection/SubscriptionSection';

const SettingSection: React.FunctionComponent = () => {
  return (
    <React.Fragment>
      <Header />
      <SubscriptionSection />
      <CloudSyncSection />
      <ManageDataSection />
      <ClearDataSection />
      <Footer />
    </React.Fragment>
  );
};

export default SettingSection;
