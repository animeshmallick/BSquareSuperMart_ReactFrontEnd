import axios from "axios";

export async function getAllProducts() {
    const { data } = await axios.get("https://api.qa.bsquaresupermart.in/getAllProducts");
    return data;
}
