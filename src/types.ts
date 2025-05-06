export type Customer = Omit<CustomerData, "_links">;

export type CustomerData = {
    firstname: string;
    lastname: string;
    streetaddress: string;
    postcode: string;
    city: string;
    email: string;
    phone: string;
    _links: {
        self: { href: string };
    };
};

export type Training = {
    date: string;
    duration: number;
    activity: string;
    customer: {
        firstname: string;
        lastname: string;
    };
};
