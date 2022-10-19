// utils
import React, {useState, useEffect} from 'react';

// components
import {Navigation} from 'navigation';
import InfoModal from 'components/InfoModal';

// hooks
import {useSelector, useDispatch} from 'hooks/useRedux';

// actions
import {
  setAgreedToUsePhoto,
  setInfoMessage,
  showAgreementPopup,
} from 'store/base/base.actions';

const MainContent = () => {
  const dispatch = useDispatch();
  const {agreementPopup, infoMessage} = useSelector(state => state.base);
  const [showPhotoUploadMessage, setShowPhotoUploadMessage] = useState(false);

  const handleAcceptAgreement = () => {
    dispatch(setAgreedToUsePhoto(true)).then(() =>
      dispatch(showAgreementPopup()),
    );
  };

  useEffect(() => {
    if (infoMessage) {
      setShowPhotoUploadMessage(true);
    }
  }, [infoMessage]);

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
      <InfoModal
        modalVisible={showPhotoUploadMessage}
        setModalVisible={() => {
          setShowPhotoUploadMessage(false);
          dispatch(setInfoMessage(''));
        }}
        title="Thank you!"
        text={infoMessage || ''}
        btn={{
          type: 'blue',
          title: 'Close',
        }}
      />
    </>
  );
};

export default MainContent;
