export const getCustomers = async () => {
    const response = await fetch(import.meta.env.VITE_API_URL + "customers");
    if (!response.ok) {
        throw new Error("Failed to fetch customers");
    }
    return await response.json();
};