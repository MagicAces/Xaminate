"use client";

import { setReload } from "@/redux/slices/settingSlice";
import { updateAlert } from "@/server/actions/user";
import styles from "@/styles/setting.module.scss";
import { useSession } from "next-auth/react";
import { useAction } from "next-safe-action/hooks";
import { useEffect } from "react";
import { MdEmail } from "react-icons/md";
import { useDispatch } from "react-redux";
import Switch from "react-switch";
import { toast } from "react-toastify";

const Alerts = () => {
  const { data: session, update } = useSession();
  const dispatch = useDispatch();

  const { execute, status, result } = useAction(updateAlert, {
    onSuccess: (data) => {
      if (data?.success) {
        toast.success(data?.success);
        update({ emailAlerts: data.emailAlerts });
      }
      if (data?.error) toast.error(data?.error);
    },
    onError: (error) => {
      console.log(error);
      dispatch(setReload(false));
      if (error.serverError) toast.error("Server Error");
    },
  });

  const handleChange = (
    checked: boolean,
    _: MouseEvent | React.SyntheticEvent<MouseEvent | KeyboardEvent, Event>,
    id: string
  ) => {
    execute({ emailAlerts: checked });
  };

  useEffect(() => {
    if (status === "hasSucceeded" && result?.data?.success) {
      dispatch(setReload(false));
    }
  }, [status, result, dispatch]);

  return (
    <>
      <div className={styles.settingContentAlert}>
        <div className={styles.settingContentAlertHeader}>
          <div className={styles.settingContentAlertHeaderLeft}>
            <MdEmail />
            <span>Emails</span>
          </div>
        </div>
        <div className={styles.settingContentAlertBody}>
          <div className={styles.settingContentAlertBodyEmail}>
            <span>
              Receive email alerts when a session ends. Email would include
              reports of the session.
            </span>
            <span>
              <Switch
                onChange={handleChange}
                checked={session?.user?.emailAlerts || false}
                disabled={session?.user === null || status === "executing"}
                onColor="#4CAF50"
                offColor="#1E1E1E"
                onHandleColor="#1E1E1E"
                offHandleColor="#505050"
                uncheckedIcon={false}
                checkedIcon={false}
                handleDiameter={10}
                activeBoxShadow="0 0 2px 3px transparent"
                width={40}
                height={20}
                id={session?.user?.id?.toString()}
              />
            </span>
          </div>
        </div>
      </div>
    </>
  );
};

export default Alerts;
