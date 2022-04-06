import React from 'react';
import ClearDataSection from './ClearDataSection/ClearDataSection';
import CloudSyncSection from './CloudSyncSection/CloudSyncSection';
import Footer from './Footer/Footer';
import ManageDataSection from './ManageDataSection/ManageDataSection';
import SubscriptionSection from './SubscriptionSection/SubscriptionSection';

interface IProps { }

type TComponentProps = React.ComponentPropsWithoutRef<'div'>;

type TProps = IProps & TComponentProps;

const Settings: React.FunctionComponent<TProps> = (props) => {
  const { className, ...otherProps } = props;
  return (
    <div className={className} {...otherProps}>
      <SubscriptionSection />
      <CloudSyncSection />
      <ManageDataSection />
      <ClearDataSection />
      <Footer />
    </div>
  );
};

Settings.displayName = 'Settings';

export default Settings;
