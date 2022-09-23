import React, {useEffect} from 'react';
import scheduleNotification from 'helpers/scheduleNotification';

interface useLocalNotificationProps {
  weekday: number;
  weekend: number;
}

const useLocalNotification: React.FC<useLocalNotificationProps> = ({
  weekday,
  weekend,
}) => {
  useEffect(() => {
    scheduleNotification(weekday, weekend);
  }, [weekday, weekend]);
  return null;
};

export default useLocalNotification;
