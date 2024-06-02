import styles from "@/styles/session.module.scss";
import { useDispatch, useSelector } from "react-redux";
import { IoChevronBack, IoChevronForward } from "react-icons/io5";
import { toast } from "react-toastify";
import { setReload, updateSessionControls } from "@/redux/slices/sessionSlice";
import Skeleton from "react-loading-skeleton";
import "react-loading-skeleton/dist/skeleton.css";
import { useEffect, useState } from "react";

const Footer = () => {
  const { data, isDisabled, sessionsBox } = useSelector(
    (state: any) => state.session
  );
  const dispatch = useDispatch();
  const [paginationInput, setPaginationInput] = useState<string | undefined>(
    sessionsBox.query.page.toString() ?? undefined
  );

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { value } = e.target;

    if (isNaN(parseInt(value))) return;
    if (
      isFinite(parseInt(value)) &&
      (parseInt(value) > data?.totalPages || parseInt(value) < 0)
    ) {
      toast.error("Value is out of range", {
        position: "bottom-left",
      });
      return;
    }

    setPaginationInput(value);
  };

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (paginationInput === undefined || isNaN(parseInt(paginationInput))) return;

    dispatch(
      updateSessionControls({
        name: "page",
        value: parseInt(paginationInput) || sessionsBox.query.page,
      })
    );
  };

  useEffect(() => {
    setPaginationInput(sessionsBox.query.page.toString());
  }, [sessionsBox]);

  console.log(isDisabled);

  return (
    <>
      <div className={styles.sessionContentFooter}>
        <div className={styles.sessionContentFooterStats}>
          <span>
            Pending{" "}
            <span>
              (
              {data ? (
                data?.pendingCount
              ) : (
                <Skeleton
                  baseColor="#2C2C2C"
                  highlightColor="#505050"
                  width={15}
                  height={15}
                  style={{ borderRadius: "0.5rem" }}
                />
              )}
              )
            </span>
          </span>
          <span>
            Active{" "}
            <span>
              (
              {data ? (
                data?.activeCount
              ) : (
                <Skeleton
                  baseColor="#2C2C2C"
                  highlightColor="#505050"
                  width={15}
                  height={15}
                  style={{ borderRadius: "0.5rem" }}
                />
              )}
              )
            </span>
          </span>
          <span>
            Closed{" "}
            <span>
              (
              {data ? (
                data?.closedCount
              ) : (
                <Skeleton
                  baseColor="#2C2C2C"
                  highlightColor="#505050"
                  width={15}
                  height={15}
                  style={{ borderRadius: "0.5rem" }}
                />
              )}
              )
            </span>
          </span>
        </div>
        <div className={styles.sessionContentFooterNavigation}>
          <button
            className={styles.navBack}
            type="button"
            disabled={isDisabled || !data?.hasPrevPage}
            onClick={() => {
              dispatch(
                updateSessionControls({
                  name: "page",
                  value: sessionsBox.query.page - 1,
                })
              );
              dispatch(setReload(true));
            }}
          >
            <IoChevronBack />
          </button>
          <button
            className={styles.navForward}
            type="button"
            disabled={isDisabled || !data?.hasNextPage}
            onClick={() => {
              dispatch(
                updateSessionControls({
                  name: "page",
                  value: sessionsBox.query.page + 1,
                })
              );
              dispatch(setReload(true));
            }}
          >
            <IoChevronForward />
          </button>
        </div>
        <form
          onSubmit={handleSubmit}
          className={styles.sessionContentFooterInput}
        >
          <input
            type="text"
            name="page"
            value={paginationInput}
            onChange={handleInputChange}
            autoComplete="off"
            onFocus={(e) => e.target.select()}
          />
          <span>of</span>
          <span>
            {data?.totalPages || (
              <Skeleton
                baseColor="#2C2C2C"
                highlightColor="#505050"
                width={15}
                height={15}
                style={{ borderRadius: "0.1rem" }}
              />
            )}
          </span>
        </form>
      </div>
    </>
  );
};

export default Footer;
