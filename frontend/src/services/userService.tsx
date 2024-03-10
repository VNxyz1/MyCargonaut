import {User} from "../models/User";

export const postUser = async (registerData: User): Promise<any> => {
    try {
        const response = await fetch("/user", {
            method: "POST",
            headers: {
                "Content-type": "application/json"
            },
            body: JSON.stringify(registerData),
        });

        if (response) {
            const data = await response.json();
            console.log(data);
            if (data.ok) {
                return {success: true, message: data.message};
            } else {
                return {success: false, message: data.message};
            }
        } else {
            console.error("PROBLEM");
            return {success: false, message: "An error occurred during registration."};
        }
    } catch (error) {
        console.error("Error:", error);
        return {success: false, message: "An error occurred during registration."};
    }
};

export const getLoggedInUser = async (): Promise<User | null> => {
    try {
        const res = await fetch("/user", {
            method: "GET",
            headers: {},
        });

        if (res.ok) {
            const data = await res.json();
            return data;
        } else {
            console.error("Error fetching user data");
            return null;
        }
    } catch (error) {
        console.error("Error:", error);
        return null;
    }
};
export const getAUser = async (userId: any): Promise<User | null> => {
    try {
        const res = await fetch(`/user/other/${userId}`, {
            method: "GET",
            headers: {},
        });

        if (res.ok) {
            const data = await res.json();
            return data;
        } else {
            console.error("Error fetching user data");
            return null;
        }
    } catch (error) {
        console.error("Error:", error);
        return null;
    }
};

export const updateUser = async (userData: User): Promise<any> => {
    try {
        const res = await fetch("/user", {
            method: "PUT",
            headers: {
                "Content-type": "application/json",
            },
            body: JSON.stringify(userData),
        });

        if (!res.ok) {
            const data = await res.json();
            return {success: false, error: data.message};
        } else {
            const data = await res.json();
            return {success: true, data};
        }
    } catch (error) {
        console.error("Error:", error);
        return {success: false, error: "An error occurred"};
    }
};

export const deleteUser = async (): Promise<boolean> => {
    try {
        const res = await fetch("/user", {
            method: "DELETE",
            headers: {"Content-type": "application/json"},
        });

        if (res.ok) {
            console.log('User profile deleted successfully');
            return true;
        } else {
            console.error('Error deleting user profile');
            return false;
        }
    } catch (error) {
        console.error("Error:", error);
        return false;
    }
};

/*-----Image-----*/
export const uploadImage = async (image: File): Promise<boolean> => {
    try {
        const userImage = new FormData();
        userImage.append('image', image);

        const imgRes = await fetch('/user/upload', {
            method: 'PUT',
            body: userImage,
        });

        if (!imgRes.ok) {
            const imageData = await imgRes.json();
            console.log('Image upload failed:', imageData);
            return false;
        } else {
            console.log('Image uploaded successfully');
            return true;
        }
    } catch (error) {
        console.error("Error:", error);
        return false;
    }
};

export const deleteProfileImage = async (): Promise<boolean> => {
    try {
        const res = await fetch("/user/remove-profile-image", {
            method: "DELETE",
            headers: {"Content-type": "application/json"},
        });

        if (res.ok) {
            console.log('Profile image deleted successfully');
            return true;
        } else {
            console.error('Error deleting profile image');
            return false;
        }
    } catch (error) {
        console.error("Error:", error);
        return false;
    }


};