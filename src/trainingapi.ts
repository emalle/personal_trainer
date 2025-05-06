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
                if (!res.ok) throw new Error("Impossible to fetch trainings");

                const data = await res.json();
                const trainings = data._embedded?.trainings ?? [];

                return trainings.map((training: any) => ({
                    ...training,
                    customer: customerName,
                }));
            } catch (err) {
                console.warn(`Could not fetch trainings`);
                return [];
            }
        })
    );

    return allTrainings.flat(); // Found this method here https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/flat
};
export const deleteTraining = async (url: string) => {
    const response = await fetch(url, {
        method: 'DELETE',
    });

    if (!response.ok) {
        throw new Error('Impossible delete training');
    }
};
export async function addTraining(training: {
    date: string;
    duration: number;
    activity: string;
    customer: string;
}) {
    const response = await fetch(import.meta.env.VITE_API_URL + "trainings", {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify(training)
    });

    if (!response.ok) {
        throw new Error("Impossible to add training");
    }

    return await response.json();
}
