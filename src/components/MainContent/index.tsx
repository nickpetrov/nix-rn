// utils
import React from 'react';

// components
import {Navigation} from 'navigation';
import InfoModal from 'components/InfoModal';

// hooks
import {useSelector, useDispatch} from 'hooks/useRedux';

// actions
import {setAgreedToUsePhoto, showAgreementPopup} from 'store/base/base.actions';

const MainContent = () => {
  const dispatch = useDispatch();
  const agreementPopup = useSelector(state => state.base.agreementPopup);

  const handleAcceptAgreement = () => {
    dispatch(setAgreedToUsePhoto(true)).then(() =>
      dispatch(showAgreementPopup()),
    );
  };
  return (
    <>
      <Navigation />
      <InfoModal
        modalVisible={agreementPopup}
        setModalVisible={handleAcceptAgreement}
        title="Info box"
        btn={{
          title: 'I understand',
          type: 'positive',
        }}
        text="All meal photos uploaded become public and viewable on Nutritionix.com. No other personal information is shared with the photo. By uploading a photo, you are agreeing to make it public."
      />
    </>
  );
};

export default MainContent;
