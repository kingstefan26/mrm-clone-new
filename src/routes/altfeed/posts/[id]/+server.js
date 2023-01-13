import axios from "axios";

export async function get({ params }) {

    return axios.get(`http://localhost:8080/api/collections/get/potss?populate=1&filter[title]=${params.id}`)
        .then(response => {

            if (!response.data.entries) {
                return {
                    status: 500,
                    body: JSON.stringify({ message: "nah you slut" })
                };
            }

            return {
                status: 200,
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(response.data)
            };
        })
        .catch(error => {
            console.log(error);
            return {
                status: 500,
                body: JSON.stringify({ message: "nah you slut" })
            };
        });
}