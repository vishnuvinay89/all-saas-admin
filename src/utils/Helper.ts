import FingerprintJS from "fingerprintjs2";
import { getUserDetails } from "../services/UserList";

export const generateUUID = () => {
  let d = new Date().getTime();
  let d2 =
    (typeof performance !== "undefined" &&
      performance.now &&
      performance.now() * 1000) ||
    0;
  return "xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx".replace(/[xy]/g, function (c) {
    let r = Math.random() * 16;
    if (d > 0) {
      r = (d + r) % 16 | 0;
      d = Math.floor(d / 16);
    } else {
      r = (d2 + r) % 16 | 0;
      d2 = Math.floor(d2 / 16);
    }
    return (c === "x" ? r : (r & 0x3) | 0x8).toString(16);
  });
};
export const getUserName = async (userId: string) => {
  try {
    const id = userId;
    const fieldValue = true;
    const userDetails = await getUserDetails(id, fieldValue);
    console.log("userDetails", userDetails);
    return userDetails?.userData?.name; // Accessing the name property from userData
  } catch (error) {
    console.error("Error in fetching user name:", error);
    return null;
  }
};

export const getDeviceId = () => {
  return new Promise((resolve) => {
    FingerprintJS.get((components: any[]) => {
      const values = components.map((component) => component.value);
      const deviceId = FingerprintJS.x64hash128(values.join(""), 31);
      resolve(deviceId);
    });
  });
};

export const generateUsernameAndPassword = (
  stateCode: string,
  role: string
) => {
  const currentYear = new Date().getFullYear().toString().slice(-2);
  const randomNum = Math.floor(10000 + Math.random() * 90000).toString();

  const username =
    role === "F"
      ? `FSC${stateCode}${currentYear}${randomNum}`
      : `SC${stateCode}${currentYear}${randomNum}`;
  const password = randomNum;

  return { username, password };
};
interface State {
  value: string;
  label: string;
}

export const transformLabel = (label: string): string => {
  return label
    .toLowerCase() // Convert to lowercase to standardize
    .replace(/_/g, " ") // Replace underscores with spaces
    .replace(/\b\w/g, (char) => char.toUpperCase()); // Capitalize the first letter of each word
};

export const transformArray = (arr: State[]): State[] => {
  return arr?.map((item) => ({
    ...item,
    label: transformLabel(item.label),
  }));
};

export const firtstLetterInUpperCase = (label: string): string | null => {
  if (!label) {
    return null;
  }

  return label
    ?.split(" ")
    ?.map((word) => word?.charAt(0).toUpperCase() + word?.slice(1))
    ?.join(" ");
};
export const capitalizeFirstLetterOfEachWordInArray = (
  arr: string[]
): string[] => {
  console.log(arr);
  return arr.map((str) =>
    str.replace(/\b[a-z]/g, (char) => char.toUpperCase())
  );
};
export const fieldTextValidation = (text: string) => {
  const regex = /^[A-Za-z\s]+$/;
  return regex.test(text);
};
