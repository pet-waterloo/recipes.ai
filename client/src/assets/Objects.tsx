
export interface InfoTabProps {
    image_url: string,
    card_title: string
};

export interface ChatItemProps {
    content: string,
    avatar_url?: string,
    ai: boolean,
    created: number
}

export interface UserLoginObject {
    email: string,
    password: string
};

export interface UserObject {
    uuid: string;
}

export interface UserDataObject {
    user_id: string;
    conversations: number[];
    stats: {[key: string]: number}
};


