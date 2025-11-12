export const getUserAge = (birthDate: Date | string): number => {
    const date = birthDate instanceof Date ? birthDate : new Date(birthDate);

    if (Number.isNaN(date.getTime())) {
        throw new Error("Invalid birth date");
    }

    const today = new Date();
    let age = today.getFullYear() - date.getFullYear();
    const hasHadBirthdayThisYear =
        today.getMonth() > date.getMonth() ||
        (today.getMonth() === date.getMonth() && today.getDate() >= date.getDate());

    if (!hasHadBirthdayThisYear) {
        age -= 1;
    }

    return age;
};
