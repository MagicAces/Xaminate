"use client";
import { ProfileInput, profileSchema } from "@/lib/schema";
import styles from "@/styles/modal.module.scss";
import { useModal } from "@/utils/context";
import { zodResolver } from "@hookform/resolvers/zod";
import { useSession } from "next-auth/react";
import Avatar from "react-avatar";
import { useForm } from "react-hook-form";
import { MdClose } from "react-icons/md";

const Profile = () => {
  const { data: session } = useSession();

    const { exitModal } = useModal();
    
  const {
    register,
    formState: { errors },
  } = useForm<ProfileInput>({
    resolver: zodResolver(profileSchema),
    defaultValues: {
      firstName:
        session?.user?.firstName !== null
          ? session?.user?.firstName
          : undefined,
      lastName:
        session?.user?.lastName !== null ? session?.user?.lastName : undefined,
      email: session?.user?.email ? session?.user?.email : undefined,
    },
  });

  return (
    <>
      <div
        className={styles.profileContainer}
        onClick={(e) => e.stopPropagation()}
      >
        <div className={styles.avatarContainer}>
          <Avatar
            className={styles.avatar}
            name={
              session?.user?.firstName !== null
                ? `${session?.user?.firstName} ${session?.user?.lastName}`
                : "John Doe"
            }
            // src={
            //   "https://gravatar.com/avatar/dd8888debaa7564112a4425c4189a024?s=200&d=identicon&r=pg"
            // }
            size={"120"}
            round={true}
            maxInitials={1}
            textSizeRatio={3}
            textMarginRatio={0.55}
          />
        </div>
        <span className={styles.closeIcon}>
          <MdClose onClick={() => exitModal()} />
        </span>
        <form className={styles.profile}>
          <div className={styles.inputBox}>
            <div className={styles.nameBox}>
              <div className={styles.firstName}>
                <label htmlFor="firstName">First Name</label>
                <input
                  type="text"
                  {...register("firstName")}
                  readOnly
                  autoComplete="false"
                />
              </div>
              <div className={styles.lastName}>
                <label htmlFor="lastName">Last Name</label>
                <input
                  type="text"
                  {...register("lastName")}
                  readOnly
                  autoComplete="false"
                />
              </div>
            </div>
            <div className={styles.emailBox}>
              <label htmlFor="email">Email Address</label>
              <input
                type="email"
                {...register("email")}
                readOnly
                autoComplete="false"
              />
            </div>
          </div>
        </form>
      </div>
    </>
  );
};

export default Profile;
