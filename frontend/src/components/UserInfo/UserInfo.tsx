import { useState } from "react";
import { User } from "../../../../shared/types";
import { useAppStore } from "../../appStore";

interface UserInfoProps {
    userId: string | null;  // When null, assume current user.
}

function UserInfo(props: UserInfoProps) {
    const {userId} = props;
    const {currentUser} = useAppStore();
    const [user, setUser] = userId ? useState<User | null> : 
}

export default UserInfo;