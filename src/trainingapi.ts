export const getTrainings = async () => {
    const cust_training = await fetch(import.meta.env.VITE_API_URL + "customers");


    const customerData = await cust_training.json();
    const customers = customerData._embedded?.customers ?? [];

    const allTrainings = await Promise.all(
        customers.map(async (customer: any) => {
            const trainingsUrl = customer._links.trainings.href;
            const customerName = {
                firstname: customer.firstname,
                lastname: customer.lastname,
            };

            try {
                const res = await fetch(trainingsUrl);
                if (!res.ok) throw new Error("Failed to fetch trainings");

                const data = await res.json();
                const trainings = data._embedded?.trainings ?? [];

                return trainings.map((training: any) => ({
                    ...training,
                    customer: customerName,
                }));
            } catch (err) {
                console.warn(`Could not fetch trainings for ${customer.firstname} ${customer.lastname}`);
                return [];
            }
        })
    );

    return allTrainings.flat(); // Merge all into one array
};
